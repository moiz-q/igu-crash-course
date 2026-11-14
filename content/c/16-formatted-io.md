---
id: c-16
title: Formatted input and output
goal: align tables with printf field width and precision, use printf's return value, and handle scanf formats
week: 15
minutes: 15
---

When printing reports or grade tables, messy unaligned columns are hard to read. `printf` gives you **width** and **precision** controls right inside `%...`.

## Width, alignment and precision

Syntax: `%[flags][width][.precision]specifier`

- `%5d`: print `int` in a column at least **5 characters wide**, right-aligned (`   42`).
- `%-10s`: `-` means **left-aligned** in a 10-char column (`Deniz     `).
- `%05d`: `0` pads with leading zeros (`00042`).
- `%8.2f`: **8** characters wide total, **2** digits after the decimal point (`   85.50`).

```c run
#include <stdio.h>

int main() {
    printf("%-10s %5s %8s\n", "Name", "ID", "GPA");
    printf("%-10s %05d %8.2f\n", "Deniz", 42, 3.456);
    printf("%-10s %05d %8.2f\n", "Ece", 107, 3.8);
    return 0;
}
```

## Return values of `printf` and `scanf`

- `printf(...)` returns the **number of characters printed** (e.g. `printf("Hi\n")` prints `Hi` + newline and returns `3`).
- `scanf(...)` returns the **number of items successfully read** (e.g. `while (scanf("%d", &x) == 1)` keeps reading until input ends or a non-number is typed).

## Try it

Solve the formatted I/O exercises below!

@widget exercises lesson=c-16

## Common mistakes
- Thinking `%6.2f` means "6 digits before the dot and 2 after" — `6` is the **total** minimum width (including digits, the `.`, and minus sign).
- Confusing `%-10s` (left-aligned) with `%10s` (right-aligned).
- Expecting `%5d` to chop off a 7-digit number like `1234567` — width is a *minimum*, so C prints all 7 digits without truncating.

## Key terms
- field width | minimum number of characters a printed value occupies | alan genişliği
- precision | number of decimal digits for `%f` (or max chars for `%s`) | hassasiyet (duyarlılık)
- left-aligned | padding spaces on the right using `-` (e.g. `%-10s`) | sola hizalı

## Quick check
? What does `printf("[%-5d]", 42);` print?
- `[   42]` ~~ Without `-`, it right-aligns.
* `[42   ]` ~~ `-5d` left-aligns `42` in a 5-character field, padding 3 spaces on the right.
- `[00042]` ~~ Zero-padding uses `%05d`.
- `[42]` ~~ Minimum width 5 adds 3 spaces.
! `-` inside `%...` means left-align.

? What does `int n = printf("AB\n");` store in `n`?
- `2` ~~ `\n` also counts as 1 printed character.
* `3` ~~ `'A'`, `'B'`, and `'\n'` = 3 characters printed.
- `0` ~~ `0` is `main`'s success return, not `printf`'s.
- `4` ~~ The null terminator is not printed.
! `printf` returns the total count of characters it printed.

? What does `printf("%6.1f", 3.46);` print (use `·` for spaces)?
- `···3.4` ~~ `printf` rounds `3.46` to `3.5` for `.1f`.
* `···3.5` ~~ `"3.5"` is 3 characters, so 3 leading spaces pad it to width 6.
- `3.5000` ~~ `.1f` prints 1 digit after the decimal point.
- `····3.5` ~~ That would be 7 characters wide.
! `%6.1f` rounds to 1 decimal place (`3.5`, 3 chars) and pads with 3 leading spaces to reach width 6.
