import webview
import datetime

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
        date = datetime.datetime.now().isoformat().split(".")[0]
        result =  {
            "date": date,
            "Content": note
        }
        print("REUSLT!")
        print(date)
        self.notes.append(result)

    def show_notes(self):
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

    