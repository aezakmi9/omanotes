
const counter = document.getElementById("count");
const bar = document.getElementById("bar");

function render(value) {
    counter.textContent = value;
    bar.style.width = `${Math.min(value / 8, 1) * 100}%`;
}

window.addEventListener("pywebviewready", async () => {
    // Read initial value from Python
    render(await window.pywebview.api.get_count());
    render(await window.pywebview.api.show_notes());

    document.getElementById("add").onclick = async () => {
        const result = await window.pywebview.api.add();
        render(result);
    };

    document.getElementById("addNote").onclick  = async () => {
        kall = getElementById("i").value;
        if(kall==null) {
            render(null);
        }
        const govno = await window.pywebview.api.add_note(kall);
        render(govno)
        render(await window.pywebview.api.show_notes());
    }

    document.getElementById("reset").onclick = async () => {
        const result = await window.pywebview.api.reset();
        render(result);
    };
});
