# omanotes

A small frameless desktop notes widget built with [pywebview](https://pywebview.flowrl.com/) (GTK backend) and plain HTML/CSS/JS.

<img src="docs/screenshot.png" alt="omanotes widget" width="360">

## Features

- Add notes (Enter to add, Shift+Enter for a new line)
- Click a note to mark it done; double-click it to edit (Enter saves, Esc cancels)
- Delete single notes or clear all done notes at once
- Notes are saved to `notes.json` next to the app
- Old `notes.txt` files (`date: content` per line) are imported automatically on first run

## Requirements

- Python 3
- pywebview with GTK support: `pip install "pywebview[gtk]"`

## Run

```sh
python main.py
```

## Files

| File         | Purpose                                  |
|--------------|------------------------------------------|
| `main.py`    | Window setup and the Python API used by the UI |
| `index.html` | Widget markup                            |
| `app.js`     | UI logic, calls the Python API           |
| `style.css`  | Styling                                  |
| `notes.json` | Saved notes                              |
