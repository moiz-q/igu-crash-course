---
title: Algorithms & Programming (C) — Midterm Mock Exam (Weeks 1–6)
minutes: 90
---

## Question 1 (20 pts) — Trace & predict output

Trace the program by hand and write its exact output:

```c
#include <stdio.h>

int main(void) {
    int a = 11, b = 4;
    int q = a / b;
    int r = a % b;
    double d = (double)a / b;
    printf("q=%d r=%d d=%.2f\n", q, r, d);

    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        if (i % 2 == 0) continue;
        sum += i;
    }
    printf("sum=%d\n", sum);
    return 0;
}
```

:::reveal Show model answer
```text
q=2 r=3 d=2.75
sum=9
```
- `11 / 4` is integer division → `2`, `11 % 4` → `3`.
- `(double)11 / 4` promotes to `double` → `2.75`.
- Loop adds odd `i` values `1 + 3 + 5 = 9` (`continue` skips `2` and `4`).
:::

:::rubric Question 1 marking checklist
- Correctly computes `q=2`, `r=3` (integer division and modulo)
- Correctly computes `d=2.75` with 2 decimal places
- Correctly traces `continue` to get `sum=9`
:::

## Question 2 (25 pts) — Conditionals & switch

Write a C program that reads an integer `score` (`0` to `100`) and prints:
- `"Invalid"` if `score < 0` or `score > 100`
- `"AA"` if `score >= 90`
- `"BA"` if `80 <= score < 90`
- `"BB"` if `70 <= score < 80`
- `"CB"` if `60 <= score < 70`
- `"FF"` if `score < 60`

:::reveal Show model answer
```c
#include <stdio.h>

int main(void) {
    int score;
    scanf("%d", &score);

    if (score < 0 || score > 100) {
        printf("Invalid\n");
    } else if (score >= 90) {
        printf("AA\n");
    } else if (score >= 80) {
        printf("BA\n");
    } else if (score >= 70) {
        printf("BB\n");
    } else if (score >= 60) {
        printf("CB\n");
    } else {
        printf("FF\n");
    }
    return 0;
}
```
:::

:::rubric Question 2 marking checklist
- Checks out-of-range (`< 0 || > 100`) first
- Uses `else if` chain in descending order (avoids chained `60 <= score < 70` bug)
- Uses `&score` in `scanf`
:::

## Question 3 (25 pts) — Loops & sentinel input

Write a C program that keeps reading integers until the user enters `0` (sentinel). Print how many positive integers were entered and their average (`0.00` if none were positive). Ignore negative numbers in the average.

:::reveal Show model answer
```c
#include <stdio.h>

int main(void) {
    int x, count = 0, sum = 0;
    while (scanf("%d", &x) == 1 && x != 0) {
        if (x > 0) {
            sum += x;
            count++;
        }
    }
    if (count == 0) {
        printf("count=0 avg=0.00\n");
    } else {
        printf("count=%d avg=%.2f\n", count, (double)sum / count);
    }
    return 0;
}
```
:::

:::rubric Question 3 marking checklist
- Stops cleanly when `0` is read
- Counts and sums only positive numbers (`x > 0`)
- Guards against division by zero when `count == 0`
- Casts `sum` to `double` before dividing
:::

## Question 4 (30 pts) — 1D arrays & functions

Write a function `int countAbove(const int a[], int n, int limit)` that returns how many elements in `a` are strictly greater than `limit`. Then write a `main` that tests it on `{12, 5, 19, 8, 25, 14}` with `limit = 10` and prints the result.

:::reveal Show model answer
```c
#include <stdio.h>

int countAbove(const int a[], int n, int limit) {
    int c = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] > limit) {
            c++;
        }
    }
    return c;
}

int main(void) {
    int nums[] = {12, 5, 19, 8, 25, 14};
    int n = 6;
    printf("%d\n", countAbove(nums, n, 10));  /* prints 4 */
    return 0;
}
```
:::

:::rubric Question 4 marking checklist
- Correct function signature taking array + size `n` + `limit`
- Loops `0 <= i < n` without out-of-bounds access
- Uses strict `>` (`a[i] > limit`) and returns `c`
- Calls `countAbove` from `main` and prints `4`
:::
