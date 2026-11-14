---
title: Algorithms & Programming (C) — Final Mock Exam (Comprehensive)
minutes: 120
---

## Question 1 (20 pts) — Pointers & trace

Trace the program and write its exact output:

```c
#include <stdio.h>

void bump(int *p, int val) {
    *p += val;
    val += 100;
}

int main(void) {
    int x = 10, y = 20;
    int *ptr = &x;
    *ptr = 15;
    bump(&x, y);
    printf("x=%d y=%d\n", x, y);
    return 0;
}
```

:::reveal Show model answer
```text
x=35 y=20
```
- `*ptr = 15;` changes `x` from `10` to `15`.
- `bump(&x, y)` passes the address of `x` and a copy of `y` (`20`).
- `*p += 20` changes `x` from `15` to `35`.
- `val += 100` only changes the local parameter `val`; `y` stays `20`.
:::

:::rubric Question 1 marking checklist
- Tracks `*ptr = 15` updating `x`
- Tracks `*p += val` updating `x` to `35`
- Recognizes `val` is passed by value so `y` stays `20`
:::

## Question 2 (20 pts) — Strings without `<string.h>`

Write a function `int countVowels(const char s[])` that counts how many lowercase vowels (`a, e, i, o, u`) appear in string `s`, stopping at `'\0'`. Do not use `strlen`.

:::reveal Show model answer
```c
int countVowels(const char s[]) {
    int count = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        char c = s[i];
        if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
            count++;
        }
    }
    return count;
}
```
:::

:::rubric Question 2 marking checklist
- Loops until `s[i] != '\0'` without calling `strlen`
- Checks all 5 vowels accurately
- Returns the integer count
:::

## Question 3 (30 pts) — 2D arrays (matrix row sums)

Write a function `void rowSums(int mat[][4], int rows, int out[])` that stores the sum of each row `r` (`0 .. rows-1`) into `out[r]`. Test it in `main` with a `2x4` matrix.

:::reveal Show model answer
```c
#include <stdio.h>

void rowSums(int mat[][4], int rows, int out[]) {
    for (int r = 0; r < rows; r++) {
        int s = 0;
        for (int c = 0; c < 4; c++) {
            s += mat[r][c];
        }
        out[r] = s;
    }
}

int main(void) {
    int m[2][4] = {
        {1, 2, 3, 4},
        {10, 20, 30, 40}
    };
    int sums[2];
    rowSums(m, 2, sums);
    printf("%d %d\n", sums[0], sums[1]);  /* 10 100 */
    return 0;
}
```
:::

:::rubric Question 3 marking checklist
- Declares column size `[][4]` in parameter list
- Resets `s = 0` inside the outer `r` loop
- Writes `out[r] = s` and prints `10 100`
:::

## Question 4 (30 pts) — Structs & File I/O

Define a `struct Product` with `int id`, `char name[32]`, and `double price`. Write a `main` function that reads `n` products from `"products.txt"` (format: `id name price` per line) into an array `struct Product items[100]` and prints the name of the most expensive product. Close the file properly.

:::reveal Show model answer
```c
#include <stdio.h>

struct Product {
    int id;
    char name[32];
    double price;
};

int main(void) {
    FILE *fp = fopen("products.txt", "r");
    if (fp == NULL) {
        printf("Cannot open file\n");
        return 1;
    }

    struct Product items[100];
    int n = 0;
    while (n < 100 &&
           fscanf(fp, "%d %31s %lf", &items[n].id, items[n].name, &items[n].price) == 3) {
        n++;
    }
    fclose(fp);

    if (n == 0) {
        printf("No products\n");
        return 0;
    }

    int best = 0;
    for (int i = 1; i < n; i++) {
        if (items[i].price > items[best].price) {
            best = i;
        }
    }
    printf("Most expensive: %s (%.2f)\n", items[best].name, items[best].price);
    return 0;
}
```
:::

:::rubric Question 4 marking checklist
- Defines `struct Product` with `id`, `name`, `price`
- Checks `fp == NULL` after `fopen` and calls `fclose(fp)`
- Uses `fscanf` return value `== 3` and bounds `n < 100`, with `%31s` and `&items[n].price` (`%lf`)
- Correctly finds and prints the maximum-price product
:::
