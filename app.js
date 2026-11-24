
const notesContainer = document.getElementById("notesContainer");
const noteCount = document.getElementById("noteCount");
const input = document.getElementById("i");

function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

function renderNotes(notes) {
    notesContainer.replaceChildren();
    noteCount.textContent = notes.length ? `${notes.length} note${notes.length === 1 ? "" : "s"}` : "";

    if (!notes.length) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "Nothing here yet. Write your first note below.";
        notesContainer.append(empty);
        return;
    }

    for (const note of notes) {
        const card = document.createElement("article");
        card.className = "note";

        const date = document.createElement("time");
        date.dateTime = note["date"];
        date.textContent = formatDate(note["date"]);

        const content = document.createElement("p");
        content.textContent = note["Content"];

        card.append(date, content);
        notesContainer.append(card);
    }
    notesContainer.scrollTop = notesContainer.scrollHeight;
}

window.addEventListener("pywebviewready", async () => {
    renderNotes(await window.pywebview.api.show_notes());

    const addNote = async () => {
        const text = input.value.trim();
        if (!text) return;
        await window.pywebview.api.add_note(text);
        renderNotes(await window.pywebview.api.show_notes());
        input.value = "";
        input.focus();
    };

    document.getElementById("addNote").onclick = addNote;
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            addNote();
        }
    });
});
