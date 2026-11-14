---
id: office-02
title: File formats, compression, and cloud storage
goal: identify common document, data, and archive file extensions and manage cloud sharing permissions safely
week: 1, 3
minutes: 15
---

In computer labs, knowing what a file extension means saves you from submitting the wrong file (like sending a `.lnk` shortcut instead of a `.docx` or `.pdf`!).

## Common file formats

| Extension | What it is | Typical app |
| --- | --- | --- |
| `.docx` | Editable Word document | Microsoft Word / LibreOffice Writer |
| `.xlsx` | Editable Excel spreadsheet | Microsoft Excel / LibreOffice Calc |
| `.pptx` | Editable PowerPoint presentation | Microsoft PowerPoint / Impress |
| `.pdf` | Fixed-layout document (looks identical on every device) | Adobe Reader / Web Browser |
| `.txt` | Plain unformatted text | Notepad / VS Code |
| `.csv` | Comma-Separated Values (plain-text table) | Excel / Python / SQL import |
| `.zip` | Compressed archive holding one or more files/folders | Windows Explorer / 7-Zip |

:::tip Show file extensions in Windows
In Windows File Explorer, click **View → Show → File name extensions** (Windows 11) or **View → File name extensions** (Windows 10) so you never confuse `report.pdf` with `report.pdf.exe`!
:::

## Cloud storage & sharing permissions

Cloud drives (**Google Drive**, **OneDrive**) let you access files anywhere and collaborate in real time. When clicking **Share**, always check the permission level:
- **Viewer (Read-only)**: can read and download, cannot edit. (Use this when sharing finished slides or notes!)
- **Commenter**: can add comments/suggestions without changing original text.
- **Editor**: can change or delete anything.

## Try it

Match each file extension to its purpose, then complete the checklist:

@widget match set=formats

:::checklist Lesson 2 hands-on checklist
- Turned on **File name extensions** in Windows File Explorer
- Created a test folder with two files and compressed it into a `.zip` (`Right-click → Compress to ZIP file` / `Send to → Compressed (zipped) folder`)
- Practiced setting a Google Drive / OneDrive share link to **Viewer** vs. **Editor**
:::

## Common mistakes

- Submitting a `.pptx` or `.docx` when an assignment specifically asks for **`.pdf`** (fonts and layout shift if opened on another OS!).
- Leaving a shared Google Drive link on **"Anyone with the link: Editor"** when you only meant for classmates to read it.
- Trying to upload a whole folder to a form that only accepts one file—compress it into a **`.zip`** first!

## Key terms

- file extension | the suffix after the dot (`.docx`, `.pdf`, `.zip`) showing file format | dosya uzantısı
- PDF | Portable Document Format — preserves exact page layout across devices | PDF formatı
- CSV | Comma-Separated Values — plain-text table format | virgülle ayrılmış değerler
- ZIP archive | a compressed single file bundling multiple files or folders | sıkıştırılmış arşiv

## Quick check

? You finished your CV and want to email it so the layout, margins, and fonts look **identical** on the recruiter's computer. Which format should you export?
- `.txt` ~~ loses all formatting and fonts
- `.docx` ~~ layout may shift if the recipient lacks your fonts
* `.pdf` ~~ preserves exact layout and fonts across all systems
- `.csv` ~~ CSV is for tabular data, not CVs
! Export final documents to `.pdf` whenever layout consistency matters.

? Which file format stores tabular rows as plain text with commas between columns?
- `.pptx` ~~ PowerPoint slides
* `.csv` ~~ Comma-Separated Values
- `.zip` ~~ compressed archive
- `.pdf` ~~ fixed-layout document
! `.csv` is universal for importing/exporting spreadsheet and database tables.

? You want classmates to read your study notes on Google Drive **without** accidentally deleting paragraphs. Which permission should you grant?
- Editor ~~ Editor allows modifying and deleting content
* Viewer ~~ Viewer allows reading without editing
- Owner ~~ transfers ownership
- Public Admin ~~ not a Drive sharing role
! Grant **Viewer** access when people only need to read.
