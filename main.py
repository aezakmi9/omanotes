import webview
import datetime
import json
import os
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
NOTES_FILE = os.path.join(BASE_DIR, "notes.json")
LEGACY_NOTES_FILE = os.path.join(BASE_DIR, "notes.txt")


def _unescape(text):
    out, i = [], 0
    while i < len(text):
        if text[i] == "\\" and i + 1 < len(text):
            out.append("\n" if text[i + 1] == "n" else text[i + 1])
            i += 2
        else:
            out.append(text[i])
            i += 1
    return "".join(out)


def _new_note(content, date=None, done=False):
    return {
        "id": uuid.uuid4().hex,
        "date": date or datetime.datetime.now().isoformat().split(".")[0],
        "Content": content,
        "done": done,
    }


def _load_legacy():
    """Import notes from the old 'date: content' text format."""
    notes = []
    if not os.path.exists(LEGACY_NOTES_FILE):
        return notes
    with open(LEGACY_NOTES_FILE, "r") as f:
        for line in f:
            line = line.rstrip("\n")
            if ": " not in line:
                continue
            date, content = line.split(": ", 1)
            notes.append(_new_note(_unescape(content), date=date))
    return notes


class Counter:
    def __init__(self):
        self.count = 0
        self.notes = self._load()

    # --- counter (unused by UI, kept as-is) ---
    def get_count(self):
        return self.count

    def add(self):
        self.count += 1
        return self.count

    def reset(self):
        self.count = 0
        return self.count

    # --- storage ---
    def _load(self):
        if os.path.exists(NOTES_FILE):
            with open(NOTES_FILE, "r") as f:
                return json.load(f)
        notes = _load_legacy()
        if notes:
            self.notes = notes
            self._save()
        return notes

    def _save(self):
        tmp = NOTES_FILE + ".tmp"
        with open(tmp, "w") as f:
            json.dump(self.notes, f, ensure_ascii=False, indent=2)
        os.replace(tmp, NOTES_FILE)

    def _find(self, note_id):
        return next((n for n in self.notes if n["id"] == note_id), None)

    # --- API exposed to JS ---
    def show_notes(self):
        return self.notes

    def add_note(self, note):
        note = (note or "").strip()
        if not note:
            return self.notes
        self.notes.append(_new_note(note))
        self._save()
        return self.notes

    def toggle_note(self, note_id):
        n = self._find(note_id)
        if n:
            n["done"] = not n.get("done", False)
            self._save()
        return self.notes

    def edit_note(self, note_id, content):
        content = (content or "").strip()
        n = self._find(note_id)
        if n and content:
            n["Content"] = content
            self._save()
        return self.notes

    def delete_note(self, note_id):
        self.notes = [n for n in self.notes if n["id"] != note_id]
        self._save()
        return self.notes

    def clear_done(self):
        self.notes = [n for n in self.notes if not n.get("done")]
        self._save()
        return self.notes


if __name__ == "__main__":
    webview.create_window(
        title="Focus Widget",
        url="index.html",
        js_api=Counter(),
        width=480,
        height=480,
        resizable=False,
    )

    webview.start(gui="gtk")
