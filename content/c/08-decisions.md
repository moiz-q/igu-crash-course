---
id: c-08
title: Decision structures: if, else and switch
goal: branch program execution using if, else if, nested if, the ternary operator ?: and switch-case
week: 8
minutes: 20
---

Until now, every line in `main` ran from top to bottom. **Decision structures** let your program choose different paths based on conditions.


@widget viz name=c-ifelse

## `if`, `else if` and `else`

```c run stdin="78"
#include <stdio.h>

int main() {
    int score;
    scanf("%d", &score);

    if (score >= 90) {
        printf("Grade: A\n");
    } else if (score >= 80) {
        printf("Grade: B\n");
    } else if (score >= 50) {
        printf("Grade: C\n");
    } else {
        printf("Grade: F\n");
    }
    return 0;
}
```

In an `if ... else if ... else` chain, C checks conditions from top to bottom and runs **only the first** matching branch.

## The ternary operator `?:`

A compact one-line `if-else` for picking between two values:
`condition ? value_if_true : value_if_false`

```c
int max = (a > b) ? a : b;
printf("%s\n", (n % 2 == 0) ? "even" : "odd");
```

## `switch-case`

When you compare **one integer or `char` expression** against exact constant values, `switch` is cleaner than many `else if`s.

```c run stdin="2"
#include <stdio.h>

int main() {
    int day;
    scanf("%d", &day);

    switch (day) {
        case 1:
            printf("Monday\n");
            break;
        case 2:
            printf("Tuesday\n");
            break;
        case 3:
            printf("Wednesday\n");
            break;
        default:
            printf("Other day\n");
    }
    return 0;
}
```

:::warn Always remember `break;` in `switch`!
If you forget `break;`, execution **falls through** into the next `case` below it — even if that case's value doesn't match! Exam bug-hunt questions test this all the time.
:::

## Try it

Practice `if`, `else if`, `?:` and `switch` in the exercises below.

@widget exercises lesson=c-08

## Common mistakes
- Putting a semicolon right after `if (x > 5);` — the `;` acts as an empty body, so the `{ ... }` block runs unconditionally!
- Forgetting `break;` at the end of a `case` in `switch`, causing unintended fall-through.
- Using `switch` with a `float`/`double` or a string (`"yes"`) — `switch` only works on integer types (`int`, `char`, `enum`).
- Writing `if (x = 5)` instead of `if (x == 5)`.

## Key terms
- branching | choosing between different code paths using a condition | dallanma
- ternary operator | compact `cond ? a : b` conditional expression | üçlü operatör
- switch-case | multi-way branch matching an integer or char against constant cases | switch-case yapısı
- fall-through | continuing into the next `case` when `break` is omitted | alta geçme (fall-through)

## Quick check
? What does this print when `x = 2`?
```c
switch (x) {
    case 1: printf("A"); break;
    case 2: printf("B");
    case 3: printf("C"); break;
    default: printf("D");
}
```
- `B` ~~ There is no `break;` after `case 2`, so it falls through into `case 3`.
* `BC` ~~ `case 2` prints `B`, falls through to `case 3` which prints `C`, then `break;` exits.
- `BCD` ~~ `case 3` has a `break;`, so it stops before `default`.
- `D` ~~ `x` matches `case 2`.
! Without `break;`, `switch` falls through to subsequent cases until it hits a `break;` or `}`.

? What does `if (x > 10); printf("Big\n");` print when `x = 3`?
- Nothing ~~ The `;` ends the `if` immediately!
* `Big` ~~ The semicolon makes the `if` body empty; `printf("Big\n");` always runs.
- Compile error ~~ An empty statement `;` is legal C, just almost always a bug.
- `3` ~~ It prints `Big`.
! Never put a semicolon `;` right after `if (...)`.

? Which type is **NOT** allowed in `switch (expr)`?
- `int` ~~ Allowed.
- `char` ~~ Allowed (`char` is a small integer).
* `double` ~~ `switch` only accepts integer/character types, not floating-point or strings.
- `long` ~~ Allowed.
! `switch` works on `int` and `char`, not `float`, `double`, or strings.
