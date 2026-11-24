import webview
import datetime
import os

NOTES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "notes.txt")


def _escape(text):
    return text.replace("\\", "\\\\").replace("\n", "\\n")


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

class Counter:
    def __init__(self):
        self.count=0
        self.notes = []

    def get_count(self):
        return self.count

    def add(self):
        self.count += 1
        return self.count

    def reset(self):
        self.count = 0
        return self.count

    def add_note(self,note):
        note = (note or "").strip()
        if not note:
            return
        date = datetime.datetime.now().isoformat().split(".")[0]
        result =  {
            "date": date,
            "Content": note
        }
        print("REUSLT!")
        print(date)
        self.notes.append(result)

        with open(NOTES_FILE, "a") as f:
            f.write(f"{date}: {_escape(note)}\n")

    def show_notes(self):
        self.notes = []
        if not os.path.exists(NOTES_FILE):
            return self.notes
        with open(NOTES_FILE, "r") as f:
            for line in f:
                line = line.rstrip("\n")
                if ": " not in line:
                    continue
                date, content = line.split(": ", 1)
                self.notes.append({"date": date, "Content": _unescape(content)})
        print("SHIT!")
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

    