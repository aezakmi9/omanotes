const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");
const clearDoneBtn = document.getElementById("clearDone");
const input = document.getElementById("i");

let api = null;
let lastCount = 0;

const TRASH_SVG = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor"
  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  <path d="M10 11v6"/><path d="M14 11v6"/></svg>`;

function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

function startEdit(note, content) {
    const editor = document.createElement("textarea");
    editor.className = "edit";
    editor.value = note["Content"];
    editor.rows = Math.min(6, note["Content"].split("\n").length + 1);
    content.replaceWith(editor);
    editor.focus();
    editor.setSelectionRange(editor.value.length, editor.value.length);

    let finished = false;
    const finish = async (save) => {
        if (finished) return;
        finished = true;
        const text = editor.value.trim();
        if (save && text && text !== note["Content"]) {
            renderNotes(await api.edit_note(note.id, text));
        } else {
            editor.replaceWith(content);
        }
    };

    editor.addEventListener("click", (e) => e.stopPropagation());
    editor.addEventListener("blur", () => finish(true));
    editor.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { e.preventDefault(); finish(false); }
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); finish(true); }
    });
}

function renderNotes(notes) {
    notesContainer.replaceChildren();

    const done = notes.filter((n) => n.done).length;
    noteCount.textContent = notes.length
        ? `${done}/${notes.length} done`
        : "";
    clearDoneBtn.hidden = done === 0;

    if (!notes.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Nothing here yet. Write your first note below.";
        notesContainer.append(empty);
        lastCount = 0;
        return;
    }

    for (const note of notes) {
        const card = document.createElement("article");
        card.className = "note" + (note.done ? " done" : "");
        card.title = "Click to toggle done · double-click to edit";

        const meta = document.createElement("div");
        meta.className = "meta";

        const date = document.createElement("time");
        date.dateTime = note["date"];
        date.textContent = formatDate(note["date"]);

        const del = document.createElement("button");
        del.className = "trash";
        del.title = "Delete";
        del.innerHTML = TRASH_SVG;
        del.addEventListener("click", async (e) => {
            e.stopPropagation();
            card.classList.add("removing");
            await new Promise((r) => setTimeout(r, 150));
            renderNotes(await api.delete_note(note.id));
        });

        meta.append(date, del);

        const content = document.createElement("p");
        content.textContent = note["Content"];

        // Delay single-click so a double-click (edit) doesn't also toggle.
        let clickTimer = null;
        card.addEventListener("click", () => {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(async () => {
                renderNotes(await api.toggle_note(note.id));
            }, 200);
        });
        card.addEventListener("dblclick", () => {
            clearTimeout(clickTimer);
            if (card.querySelector("textarea.edit")) return;
            startEdit(note, content);
        });

        card.append(meta, content);
        notesContainer.append(card);
    }

    // Only jump to the bottom when a note was added.
    if (notes.length > lastCount) {
        notesContainer.scrollTop = notesContainer.scrollHeight;
    }
    lastCount = notes.length;
}

window.addEventListener("pywebviewready", async () => {
    api = window.pywebview.api;
    renderNotes(await api.show_notes());

    const addNote = async () => {
        const text = input.value.trim();
        if (!text) return;
        renderNotes(await api.add_note(text));
        input.value = "";
        input.focus();
    };

    document.getElementById("addNote").onclick = addNote;
    document.getElementById("closeBtn").onclick = () => api.close();
    clearDoneBtn.onclick = async () => renderNotes(await api.clear_done());

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            addNote();
        }
    });
});
