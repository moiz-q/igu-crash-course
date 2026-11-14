---
id: office-08
title: Microsoft Excel — Essential formulas and functions
goal: write Excel formulas using SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF, COUNTIF, and ROUND (plus Turkish equivalents)
week: 10
minutes: 22
---

Every Excel formula **must start with `=`**. Without `=`, Excel treats what you typed as plain text!

## Essential Excel functions

| English | Turkish Excel | What it does | Example |
| --- | --- | --- | --- |
| `=SUM(A1:A5)` | `TOPLA` | Adds numbers in a range | `=SUM(B2:B6)` |
| `=AVERAGE(A1:A5)` | `ORTALAMA` | Arithmetic mean of numbers | `=AVERAGE(B2:B6)` |
| `=MIN(A1:A5)` | `MİN` | Smallest number | `=MIN(B2:B6)` |
| `=MAX(A1:A5)` | `MAK` | Largest number | `=MAX(B2:B6)` |
| `=COUNT(A1:A5)` | `BAĞ_DEĞ_SAY` | Counts **numeric** cells only | `=COUNT(B2:B6)` |
| `=COUNTA(A1:A5)` | `BAĞ_DEĞ_DOLU_SAY` | Counts **all non-empty** cells (text + numbers) | `=COUNTA(A2:A6)` |
| `=IF(cond, yes, no)` | `EĞER` | Decision: returns `yes` if true, `no` if false | `=IF(D2>=60, "Pass", "Fail")` |
| `=COUNTIF(range, crit)` | `EĞERSAY` | Counts cells matching a condition | `=COUNTIF(E2:E6, "Pass")` |
| `=ROUND(num, digits)` | `YUVARLA` | Rounds a number to `digits` decimals | `=ROUND(C2, 2)` |

*(Note: In Turkish-locale desktop Excel, arguments are separated by semicolons `;` instead of commas `,`—for example `=EĞER(D2>=60; "Geçti"; "Kaldı")`.)*

## Try it

Use the interactive Excel formula sandbox below to complete the tasks (both English and Turkish names `TOPLA`, `ORTALAMA`, `EĞER` work!):

@widget formula

:::checklist Lesson 8 hands-on checklist
- Completed all formula tasks in the interactive sandbox above
- Tested `=SUM(...)`, `=AVERAGE(...)`, `=MIN(...)`, `=MAX(...)`
- Wrote an `=IF(...)` condition with text results in double quotes (`"Pass"`)
- Checked the difference between `COUNT` (numbers only) and `COUNTA` (all non-empty)
:::

## Common mistakes

- Forgetting the leading **`=`** sign (typing `SUM(A1:A5)` instead of `=SUM(A1:A5)`).
- Writing text inside `IF` or `COUNTIF` without double quotes (`=IF(D2>=60, Pass, Fail)` gives `#NAME?`—it must be `"Pass"`).
- Confusing `COUNT` (ignores text!) with `COUNTA` (counts text and numbers).

## Key terms

- formula | an expression starting with `=` that computes a value in a spreadsheet | formül
- `IF` (`EĞER`) | conditional function returning one value if true and another if false | koşullu EĞER fonksiyonu
- `COUNT` vs `COUNTA` | `COUNT` counts numbers only; `COUNTA` counts all non-empty cells | SAY vs DOLU_SAY

## Quick check

? Cells `A1:A4` contain `10`, `"Ali"`, `25`, and *(blank)*. What does `=COUNT(A1:A4)` return vs. `=COUNTA(A1:A4)`?
- `3` and `4` ~~ blank cell is not counted by `COUNTA`, and `"Ali"` is not counted by `COUNT`
* `2` and `3` ~~ `COUNT` counts only the 2 numbers (`10, 25`); `COUNTA` counts the 3 non-empty cells (`10, "Ali", 25`)
- `2` and `4` ~~ `COUNTA` skips blank cells
- `4` and `4` ~~ `COUNT` skips text and blanks
! `COUNT` counts numbers (`2`); `COUNTA` counts all non-empty cells (`3`).

? Which formula returns `"Pass"` if cell `D2` is `60` or higher, and `"Fail"` otherwise?
- `IF(D2>=60, "Pass", "Fail")` ~~ missing the leading `=`
* `=IF(D2>=60, "Pass", "Fail")` ~~ starts with `=`, checks `>=60`, quotes text strings
- `=IF(D2>60, "Pass", "Fail")` ~~ `>` excludes `60` itself
- `=SUM(D2>=60, "Pass", "Fail")` ~~ `SUM` adds numbers, not conditions
! Start with `=`, use `>= 60`, and wrap text outputs in double quotes.

? In Excel, what error appears if you write `=10/0` or divide by an empty cell?
- `#NAME?` ~~ `#NAME?` means misspelled function name or unquoted text
* `#DIV/0!` ~~ division by zero error
- `#VALUE!` ~~ wrong data type (e.g., adding text to a number)
- `###` ~~ column too narrow
! Dividing by zero produces `#DIV/0!`.
