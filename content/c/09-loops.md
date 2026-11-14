---
id: c-09
title: Loops: while, for and do-while
goal: repeat actions with while, for and do-while loops and control them with break and continue
week: 9
minutes: 25
---

A **loop** repeats a block of code as long as a condition stays true. C has three loop statements:

| Loop | When to use it | Key rule |
| --- | --- | --- |
| `for` | You know how many times to repeat (e.g. `1 .. N`) | `for (init; cond; step)` |
| `while` | You repeat until a condition changes (e.g. reading until `0`) | Checks condition **before** each pass (may run 0 times) |
| `do-while` | Menu or input validation that must run **at least once** | Checks condition **after** each pass; ends with `;` |

## `while`, `for` and `do-while` in action

```c run
#include <stdio.h>

int main() {
    // 1. for loop: 1 to 5
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    // 2. while loop: count down
    int c = 3;
    while (c > 0) {
        printf("%d ", c);
        c--;
    }
    printf("\n");

    // 3. do-while: runs at least once even if condition is false
    int x = 10;
    do {
        printf("x=%d\n", x);
    } while (x < 5);

    return 0;
}
```

## `break`, `continue` and nested loops

- **`break;`:** immediately exits the innermost loop.
- **`continue;`:** skips the rest of the current pass and jumps to the next iteration (in `for`, it still runs `step`!).
- **Nested loops:** a loop inside a loop — for each pass of the outer loop, the inner loop runs all the way through.

```c run
#include <stdio.h>

int main() {
    for (int i = 1; i <= 6; i++) {
        if (i == 3) continue;  // skip 3
        if (i == 5) break;     // stop at 5
        printf("%d ", i);
    }
    printf("\n");
    return 0;
}
```

## Try it

Solve the loop exercises below!

@widget exercises lesson=c-09

## Common mistakes
- Putting a semicolon after `for (int i = 0; i < 5; i++);` or `while (x > 0);` — that creates an empty loop (and with `while`, an **infinite loop**!).
- Off-by-one errors: writing `i < 10` when you wanted `1..10` (`i <= 10`).
- Forgetting the semicolon at the end of `do { ... } while (cond);`.
- Forgetting to update the loop variable in `while`, causing an infinite loop.

## Key terms
- iteration | one single pass through the body of a loop | yineleme (iterasyon)
- infinite loop | a loop whose condition never becomes false | sonsuz döngü
- break | immediately exits the enclosing loop or switch | döngüyü kırma
- continue | skips the rest of the current iteration and starts the next | sonraki adıma atlama

## Quick check
? How many times does `for (int i = 0; i <= 5; i++)` run?
- `5` times ~~ It runs for `0, 1, 2, 3, 4, 5`.
* `6` times ~~ `0` through `5` inclusive is 6 iterations.
- `4` times ~~ `<= 5` includes `5`.
- `0` times ~~ `0 <= 5` is true.
! `0..5` inclusive is `5 - 0 + 1 = 6` iterations.

? What is guaranteed about a `do { ... } while (cond);` loop?
- It runs forever ~~ It stops when `cond` is false.
* Its body always executes **at least once** ~~ The condition is checked at the bottom, after the body runs.
- It never checks `cond` ~~ It checks `cond` after each pass.
- It runs faster than `for` ~~ Speed is identical.
! `do-while` is post-test, so the body always runs at least once.

? What does this print? `for (int i = 1; i <= 5; i++) { if (i % 2 == 0) continue; printf("%d", i); }`
- `24` ~~ Even numbers trigger `continue`, which skips `printf`.
* `135` ~~ `1, 3, 5` are printed; `2, 4` are skipped.
- `12345` ~~ `continue` skips `printf` when `i` is even.
- `1` ~~ `continue` skips to the next iteration; it does not exit the loop like `break`.
! `continue` skips the rest of the loop body for that pass and moves to `i++`.
