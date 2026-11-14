---
id: c-06
title: Basic input and output: printf and scanf
goal: display formatted values with printf and read user input safely with scanf and &
week: 5
minutes: 20
---

Programs become interactive when they display results (`printf`) and read values typed by the user (`scanf`). Both live in `<stdio.h>`.

## `printf` and format specifiers

A **format specifier** (*biçim belirteci*) is a placeholder starting with `%` inside the quotes of `printf`, telling C what type of value to print there:

| Specifier | Type | Example |
| --- | --- | --- |
| `%d` | `int` | `printf("%d", 42);` → `42` |
| `%f` | `float` or `double` | `printf("%.2f", 3.14159);` → `3.14` |
| `%c` | `char` | `printf("%c", 'A');` → `A` |
| `%s` | string (`char[]`) | `printf("%s", "IGU");` → `IGU` |

**Escape sequences** start with `\`:
- `\n` = new line
- `\t` = tab (align columns)
- `\\` = literal backslash, `\"` = literal quote, `%%` = literal `%` sign

## `scanf` and the `&` (address-of) operator

`scanf` reads input from the keyboard and stores it into a variable. Because `scanf` needs to know **where in memory** your variable lives, you must put `&` (*address-of*) in front of `int`, `float`, `double` and `char` variables!

```c run stdin="20 3.75"
#include <stdio.h>

int main() {
    int age;
    double gpa;

    scanf("%d %lf", &age, &gpa);
    printf("Age: %d\nGPA: %.2f\n", age, gpa);
    return 0;
}
```

:::warn Watch out: `float` vs `double` in `scanf`!
- In `printf`, `%f` prints **both** `float` and `double`.
- In `scanf`, **`%f` is ONLY for `float`**, and **`%lf` is for `double`**! Using `%f` for a `double` in `scanf` corrupts the value.
:::

:::warn Reading a `char` with `scanf`
When you read a number then a `char`, the `Enter` key (`\n`) left in the input buffer gets swallowed by `%c`! Put a **space before `%c`** (`scanf(" %c", &ch);`) to skip leftover whitespace and newlines.
:::

## Try it

Practice `printf` and `scanf` in the exercises below.

@widget exercises lesson=c-06

## Common mistakes
- Forgetting `&` in `scanf("%d", x);` — one of the most common C crashes/bugs!
- Using `%f` instead of `%lf` when reading a `double` with `scanf`.
- Writing `scanf("%d\n", &x);` — never put `\n` inside `scanf`'s format string (it waits for extra non-whitespace input).
- Passing arguments in the wrong order or mismatching `%d` with a `float`.

## Key terms
- printf | prints formatted text and values to the screen | ekrana yazdırma
- scanf | reads formatted input from the keyboard into variables | klavyeden okuma
- format specifier | placeholder like `%d`, `%f`, `%c`, `%s` matching a data type | biçim belirteci
- escape sequence | special character starting with `\` such as `\n` or `\t` | kaçış dizisi

## Quick check
? What is wrong with `int n; scanf("%d", n);`?
- `n` must be a `float` ~~ `%d` matches `int`.
* Missing `&` before `n` (`&n`) ~~ `scanf` needs the memory address of `n`.
- Missing `\n` inside `scanf` ~~ You should NOT put `\n` inside `scanf`.
- `scanf` cannot read `int` ~~ `scanf` reads `int` with `%d`.
! Always pass `&var` to `scanf` for `int`, `float`, `double`, and `char`.

? Which specifier must you use in `scanf` to read into a `double x;`?
- `%d` ~~ `%d` is for `int`.
- `%f` ~~ `%f` in `scanf` expects a 4-byte `float*`, not an 8-byte `double*`.
* `%lf` ~~ `double` requires `%lf` in `scanf`.
- `%c` ~~ `%c` is for `char`.
! Use `%lf` for `double` in `scanf` (and `%f` or `%.2f` in `printf`).

? What does `printf("A\tB\nC%%");` print?
- `A t B n C%` ~~ `\t` and `\n` are tab and newline, not letters.
* `A` + tab + `B`, then `C%` on the next line ~~ `\t` = tab, `\n` = newline, `%%` = literal `%`.
- `A\tB\nC%%` ~~ Escape sequences are interpreted, not printed literally.
- Compile error ~~ All escape sequences here are valid.
! `\t` inserts a tab, `\n` starts a new line, and `%%` prints one `%`.
