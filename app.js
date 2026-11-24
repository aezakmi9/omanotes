
const counter = document.getElementById("count");
const bar = document.getElementById("bar");

function render(value) {
    counter.textContent = value;
    bar.style.width = `${Math.min(value / 8, 1) * 100}%`;
}

function renderNotes(notes) {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.textContent = notes.map(note => `${note["Date"]}: ${note["Content"]}`).join("\n");
}

window.addEventListener("pywebviewready", async () => {
    // Read initial value from Python
    render(await window.pywebview.api.get_count());
    renderNotes(await window.pywebview.api.show_notes());

    document.getElementById("add").onclick = async () => {
        const result = await window.pywebview.api.add();
        render(result);
    };

    document.getElementById("addNote").onclick  = async () => {
        console.log("azshel")
        const kall = document.getElementById("i").value;
        const govno = await window.pywebview.api.add_note(kall);
        renderNotes(govno)
        renderNotes(await window.pywebview.api.show_notes());
        document.getElementById("i").value = "";
    }

    document.getElementById("reset").onclick = async () => {
        const result = await window.pywebview.api.reset();
        render(result);
    };
});
