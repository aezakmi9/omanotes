import webview

class Counter:
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

    