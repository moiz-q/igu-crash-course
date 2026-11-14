---
id: office-07
title: Microsoft Excel — Basics, formatting, and cell references
goal: navigate workbooks and worksheets, format numbers, and distinguish relative ($A1$) from absolute ($A\$1$) cell references
week: 8–9
minutes: 18
---

**Microsoft Excel** (and **Google Sheets**) organizes data into grids of **columns** (`A, B, C...`) and **rows** (`1, 2, 3...`). Each box is a **cell** named by its column + row (e.g., `B3`).

## Workbooks, sheets, and ranges

- **Workbook**: the entire `.xlsx` file.
- **Worksheet**: one tab at the bottom (`Sheet1`, `Grades`).
- **Range**: a rectangular block of cells written with a colon, e.g., `A1:C10`.
- **Number formatting** (`Home → Number`): format cells as **Currency** (`₺`), **Percentage** (`%`), **Date**, or **2 Decimal Places** (`0.00`). Never type `"TL"` or `"%"` as plain text inside a number if you want to calculate with it!

## Relative vs. Absolute references (the #1 Excel exam topic!)

When you drag a formula down or across using the **fill handle** (bottom-right corner of a cell):

| Reference | Syntax | Behavior when copied | Example use |
| --- | --- | --- | --- |
| **Relative** | `B2` | Row & column **shift** automatically | `=B2*C2` dragged down becomes `=B3*C3` |
| **Absolute** | `$B$2` | Both column & row stay **locked** | `=B2*$F$1` (multiplying every row by one tax rate in `F1`) |
| **Mixed** | `$B2` or `B$2` | Only the `$` part stays locked | Multiplication tables |

*(Shortcut: press **`F4`** while your cursor is on `F1` in the formula bar to cycle through `F1` → `$F$1` → `F$1` → `$F1`!)*

## Moving around a worksheet quickly

| Keys | Moves to |
| --- | --- |
| `Ctrl+Home` | cell **A1** |
| `Ctrl+End` | the last used cell |
| `Ctrl+→ / ↓ / ← / ↑` | the edge of the current data block |
| `Ctrl+PgDn / PgUp` | next / previous **sheet** |
| `F5` or `Ctrl+G` | **Go To** a cell address |
| `Ctrl+Space` / `Shift+Space` | select the whole column / row |

**Freeze Panes** (View → Freeze Panes → *Freeze Top Row* / *Freeze First Column* / *Freeze Panes* at the selected cell) keeps headings visible while you scroll. **Cursor shapes:** white thick cross = select · thin black **+** at the cell corner = **fill handle** (copy/series) · four-headed arrow = move cells. **Save formats:** `.xlsx` (normal), `.xlsm` (with macros), `.xls` (old), **`.csv`** (plain text, commas, only the active sheet and no formatting or formulas — just values), `.pdf`.

## Try it

:::checklist Lesson 7 hands-on checklist
- Created a small 4-row price table (`Item`, `Qty`, `Unit Price`, `Total`)
- Formatted prices as Currency/Number (`Home → Number`) without typing `"TL"` into the number
- Put a tax rate `0.20` in `F1` and wrote `=D2*$F$1`, then dragged it down to verify `$F$1` stayed locked
- Tested `F4` in the formula bar to toggle `$` locks
:::

## Common mistakes

- Forgetting `$` around a fixed tax/bonus cell (`F1`) before dragging a formula down—Row 3 then multiplies by empty `F2` (`0`)!
- Typing `"20 TL"` as text instead of `20` formatted as Currency—text cannot be summed (`SUM` ignores text!).
- Seeing `###` in a cell and thinking it's an error—`###` just means the **column is too narrow**; double-click the column border to auto-fit!

## Key terms

- cell reference | a cell's coordinate such as `B3` or `$F$1` | hücre başvurusu
- relative reference | a reference (`A1`) that shifts automatically when copied | göreli başvuru
- absolute reference | a locked reference (`$A$1`) that never changes when copied | mutlak başvuru
- fill handle | the small square at the bottom-right of a selected cell used to copy formulas | doldurma tutamacı

## Quick check

? Cell `C2` contains `=B2*E1`. You drag the fill handle down one row into `C3`. What does `C3` become?
- `=B2*E1` ~~ neither has `$`, so both shift
* `=B3*E2` ~~ both relative references move down 1 row
- `=B3*E1` ~~ `E1` has no `$`, so it also shifts to `E2`
- `=C3*F2` ~~ dragging down changes rows, not columns
! Without `$` locks, dragging down 1 row increments every row number by 1.

? You want every row in `D2:D10` to multiply by a single discount rate stored in `H1`. Which formula should you write in `D2` before dragging down?
- `=C2*H1` ~~ `H1` will shift to `H2, H3...`
* `=C2*$H$1` ~~ `$H$1` stays locked on `H1` in every row
- `=$C$2*H1` ~~ locks `C2` instead of `H1`
- `=C2*H$2` ~~ points to `H2`, not `H1`
! Lock the single rate cell with `$H$1`.

? What does `###` displayed inside an Excel cell mean?
- Division by zero ~~ that shows `#DIV/0!`
- Invalid formula name ~~ that shows `#NAME?`
* The column is too narrow to display the number or date ~~ widen the column
- The cell is locked ~~ unrelated
! `###` simply means the column needs to be widened.
