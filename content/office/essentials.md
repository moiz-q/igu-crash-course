---
title: Office applications — the essentials
minutes: 12
intro: internet and email, Google tools, Word, Excel, PowerPoint
---

Mostly hands-on — the exam asks **where things are**. Six pictures.

:::idea Email fields
@widget viz name=off-email
Watch out for **phishing**: fake emails asking for your password. [Go deeper](#/lesson/office-01)
:::

:::idea Google Drive roles
@widget viz name=off-roles
**File → Version history** brings back old versions. Forms: multiple choice = one answer, checkboxes = many. [Go deeper](#/lesson/office-03)
:::

:::idea Word: which tab?
@widget viz name=off-ribbon
`.docx` document · `.dotx` template · `.pdf` fixed layout. [Go deeper](#/lesson/office-04)
:::

:::idea Excel: the $ sign locks
@widget viz name=off-ref
`#DIV/0!` ÷ by zero · `#NAME?` typo · `#VALUE!` text not number · `#REF!` deleted cell. [Try it](#/tool/excel-formulas)
:::

:::idea PowerPoint: animation vs. transition
@widget viz name=off-anim
**F5** from slide 1 · **Shift+F5** from this slide · **Slide Master** changes every slide. [Go deeper](#/lesson/office-12)
:::

:::remember If you remember only this
`Ctrl+C / X / V` copy / cut / paste · `Ctrl+Z / Y` undo / redo · `Ctrl+S` save · `F12` save as · `Ctrl+P` print · `Ctrl+F` find · `Ctrl+H` replace · `Ctrl+B / I / U` bold / italic / underline
:::

## Quick check

? You email 100 students and don't want them to see each other's addresses. Use:
- To ~~ everyone sees it
- CC ~~ everyone sees it
* BCC ~~ hidden from the other receivers
- Subject ~~ no
! BCC = blind carbon copy.

? In Google Drive, who can add comments but not change the text?
- Viewer ~~ can only look
* Commenter ~~ correct
- Editor ~~ can change text
- Owner ~~ full control
! Viewer < Commenter < Editor.

? You copy `=B2*$E$1` from C2 down to C3. What appears in C3?
* `=B3*$E$1` ~~ B2 moves, $E$1 is locked
- `=B2*$E$1` ~~ the relative part moves
- `=B3*$E$2` ~~ $E$1 doesn't move
- `=C3*$E$1` ~~ only the row changes when copying down
! `$` locks a reference.

? Excel shows `#NAME?`. The most likely reason is:
- dividing by zero ~~ that's #DIV/0!
* a misspelled function name, like `=SUMM(A1:A5)` ~~ correct
- a deleted cell ~~ that's #REF!
- the column is too narrow ~~ that's ####
! #NAME? = Excel doesn't recognise a name.

? Which key starts a PowerPoint slide show from the **current** slide?
- F5 ~~ from slide 1
* Shift+F5 ~~ from the current slide
- F12 ~~ Save As
- Ctrl+P ~~ print
! F5 = beginning, Shift+F5 = current.
