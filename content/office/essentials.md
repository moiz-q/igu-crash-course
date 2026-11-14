---
title: Office applications — the essentials
minutes: 20
intro: internet and email, Google tools, Word, Excel, PowerPoint
---

This course is mostly **hands-on**, and the exam asks "where is this button?" and "what does this shortcut do?". You probably already use these apps — these five ideas fill the gaps the exam cares about.

:::idea Internet, email and online shopping
- The **Internet** is the network; the **Web** is the pages you open in a browser. **HTTPS** + padlock = encrypted.
- Email fields: **To** (main person) · **CC** (copy, everyone sees it) · **BCC** (hidden copy — use it for mass emails).
- Threats: **phishing** (fake emails that steal passwords), **spam**, **malicious attachments** (`.exe`, macros).
- E-commerce: **B2C** (shop → you), **B2B** (company → company), **C2C** (person → person, second-hand sites), **B2G** (company → government), **C2B** (person → company).

[Go deeper: internet and email](#/lesson/office-01)
:::

:::idea Google Workspace: share, collaborate, collect
- **Drive sharing roles:** Viewer (look) < Commenter (comment) < Editor (change).
- Several people can edit a Doc **at the same time**; **File → Version history** brings back old versions.
- **Google Forms** question types to know: short answer, paragraph, **multiple choice** (one answer), **checkboxes** (many answers), dropdown, **linear scale**, grid, date, time, file upload. Answers can go straight into a Google Sheet.
- **Calendar:** create an event, add guests, and click *Add Google Meet* for a video link.

[Go deeper: Google tools](#/lesson/office-03)
:::

:::idea Word: where things live
| You want to… | Go to |
| --- | --- |
| margins, orientation, columns | **Layout** tab |
| tables, pictures, page numbers | **Insert** tab |
| fonts, bullets, styles, Format Painter | **Home** tab |
| table of contents, citations | **References** tab |
| spelling, comments, track changes | **Review** tab |
| save as PDF, password, Inspect Document | **File** (Backstage view) |

`.docx` = document · `.dotx` = template · `.pdf` = fixed layout for sharing.

[Go deeper: Word basics](#/lesson/office-04)
:::

:::idea Excel: formulas and $ signs
Every formula starts with `=`. The five functions you'll use most: `=SUM(B2:B10)`, `=AVERAGE(…)`, `=MIN(…)`, `=MAX(…)`, `=COUNT(…)`, plus `=IF(B2>=50,"Pass","Fail")`.

When you copy a formula, cell references move. A **$** locks them: `A1` moves, `$A$1` never moves (use it for a fixed rate or total).

Error codes: `#DIV/0!` divided by zero · `#NAME?` misspelled function · `#VALUE!` text where a number should be · `#REF!` deleted cell.

[Go deeper: Excel references](#/lesson/office-07) · [Try formulas yourself](#/tool/excel-formulas)
:::

:::idea PowerPoint: master, motion, show
- **Slide Master** (View tab) changes the design of **every** slide at once.
- **Transition** = effect **between** slides. **Animation** = effect on an **object** on a slide (see the Animation Pane).
- **F5** starts from slide 1; **Shift+F5** from the current slide. **Presenter View** shows your notes only to you.

[Go deeper: Slide Master](#/lesson/office-10) · [animations](#/lesson/office-12)
:::

:::remember Shortcuts that appear on every exam
`Ctrl+C` copy · `Ctrl+X` cut · `Ctrl+V` paste · `Ctrl+Z` undo · `Ctrl+Y` redo · `Ctrl+S` save · `F12` save as · `Ctrl+P` print · `Ctrl+F` find · `Ctrl+H` replace · `Ctrl+B / I / U` bold / italic / underline · `Ctrl+A` select all · `F5` start slide show.
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
