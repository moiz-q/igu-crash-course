---
id: c-02
title: Algorithms and pseudocode
goal: write clear step-by-step algorithms in plain English and pseudocode before writing C code
week: 2
minutes: 15
---

Good programmers do not start by typing C code. First they solve the problem in plain steps. An **algorithm** (*algoritma*) is a finite, unambiguous, step-by-step recipe that takes **input**, processes it, and produces **output**.

## Rules of a good algorithm

1. **Clear steps:** No vague instructions like *"do something with x"*.
2. **Exact order:** Steps run in sequence unless a decision or loop jumps.
3. **Finite:** It must eventually stop and produce a result.

## Plain language vs pseudocode

**Pseudocode** (*sözde kod*) looks halfway between English and a programming language. There is no strict syntax — the goal is clarity.

**Worked example:** Find the larger of two numbers `A` and `B`.

In plain steps:
1. Start.
2. Read two numbers `A` and `B` from the user.
3. If `A > B`, print `A`. Otherwise, print `B`.
4. Stop.

In pseudocode:
```text
START
  INPUT A, B
  IF A > B THEN
      OUTPUT A
  ELSE
      OUTPUT B
  END IF
STOP
```

Notice how easy it is to turn that into C once you know the syntax:
```c run stdin="14 9"
#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    if (a > b) {
        printf("%d\n", a);
    } else {
        printf("%d\n", b);
    }
    return 0;
}
```

## Try it

Write a step-by-step algorithm (on paper) that reads a student's score `0..100` and prints `"Pass"` if `score >= 50`, or `"Fail"` otherwise. Then open the model pseudocode to compare.

:::reveal Show model pseudocode
```text
START
  INPUT score
  IF score >= 50 THEN
      OUTPUT "Pass"
  ELSE
      OUTPUT "Fail"
  END IF
STOP
```
:::

## Common mistakes
- Writing an algorithm that never stops (e.g. a loop whose counter never changes).
- Skipping the `ELSE` case when the problem asks for two outcomes.
- Worrying about semicolons `;` or `#include` in pseudocode — pseudocode is for logic, not compiler syntax.

## Key terms
- algorithm | a finite, unambiguous step-by-step procedure to solve a problem | algoritma
- pseudocode | informal code-like notation for writing an algorithm | sözde kod
- input | data given to a program from the user or a file | girdi
- output | the result produced and displayed by a program | çıktı

## Quick check
? What is the main purpose of **pseudocode**?
- To be compiled directly by `gcc` ~~ Compilers cannot compile pseudocode.
* To plan and communicate an algorithm clearly without worrying about exact language syntax ~~ You design the logic first, then translate to C.
- To replace RAM ~~ Pseudocode is a notation, not hardware.
- To draw hardware circuits ~~ That is circuit design.
! Pseudocode bridges human thinking and C code.

? Which property is **required** for every valid algorithm?
- It must be written in C ~~ Algorithms can be written in plain English, pseudocode, flowcharts or any language.
* It must have clear, unambiguous steps and finish in a finite number of steps ~~ Infinite or vague procedures are not valid algorithms.
- It must use at least 10 variables ~~ Use only the variables the problem needs.
- It must never take input ~~ Many algorithms take input, though some have fixed data.
! Every algorithm must be clear, ordered and finite.

? Trace this algorithm when `N = 4`: `sum = 0; FOR i = 1 TO N: sum = sum + i; OUTPUT sum`. What does it print?
- `4` ~~ It adds `1 + 2 + 3 + 4`, not just `N`.
- `6` ~~ `1 + 2 + 3 = 6`, missing `i = 4`.
* `10` ~~ `1 + 2 + 3 + 4 = 10`.
- `0` ~~ `sum` increases on every iteration.
! Tracing step by step: `0 + 1 = 1`, `+ 2 = 3`, `+ 3 = 6`, `+ 4 = 10`.
