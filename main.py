import webview
import datetime

class Counter:
    notes = []
    def __init__(self):
        self.count=0

    def get_count(self):
        return self.count

    def add(self):
        self.count += 1
        return self.count

    def reset(self):
        self.count = 0
        return self.count

    def add_note(self,note):
        result =  {
            "date": datetime.datetime.now().isoformat(),
            "Content": note
        }
        self.notes.append(result)

    def show_notes(self):
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

    