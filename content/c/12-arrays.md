---
id: c-12
title: Arrays (1D, searching, sorting and 2D)
goal: declare and loop over 1D and 2D arrays, search and sort them, and pass arrays to functions
week: 12
minutes: 25
---

When you need to store 50 student grades, creating `g1, g2, ..., g50` is impossible to manage. An **array** (*dizi*) stores a fixed-size list of values of the **same type** side by side in memory.

## 1D arrays and 0-based indexing

An array of size `N` has valid indices **`0` through `N - 1`**!

```c run
#include <stdio.h>

int main() {
    int grades[5] = {80, 95, 70, 88, 60};
    int sum = 0, max = grades[0];

    for (int i = 0; i < 5; i++) {
        sum += grades[i];
        if (grades[i] > max) max = grades[i];
    }
    printf("Sum = %d, Avg = %.1f, Max = %d\n", sum, sum / 5.0, max);
    return 0;
}
```

## Linear search and bubble sort

- **Linear search:** Check `arr[0], arr[1], ...` one by one until `arr[i] == target` (return index `i`, or `-1` if not found).
- **Bubble sort:** Repeatedly compare adjacent pairs `arr[j]` and `arr[j + 1]` and swap them if out of order.

```c run
#include <stdio.h>

void sort(int a[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
            }
        }
    }
}

int main() {
    int a[5] = {40, 10, 50, 20, 30};
    sort(a, 5);
    for (int i = 0; i < 5; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
```

Notice something important: when you pass an array `a` to a function `sort(a, 5)`, C passes the **starting address** of the array — so modifying `a[j]` inside the function **does** modify the original array in `main`! Also, always pass the length `n` as a separate parameter.

## 2D arrays (tables / matrices)

A 2D array is a grid of rows and columns: `int m[2][3] = { {1, 2, 3}, {4, 5, 6} };`. Use two nested loops: outer for rows, inner for columns.

## Try it

Solve the array exercises below!

@widget exercises lesson=c-12

## Common mistakes
- **Out-of-bounds access:** writing `arr[5]` on `int arr[5]` — valid indices are `0..4`, so `arr[5]` reads/corrupts neighbouring memory!
- Comparing or copying two arrays with `a == b` or `a = b` — you must loop element by element.
- Initializing `max = 0` instead of `max = arr[0]` (fails when all array elements are negative).

## Key terms
- array | a contiguous fixed-size collection of elements of the same type | dizi
- index | zero-based position of an element (`0` to `size - 1`) | indis (indeks)
- linear search | scanning an array from index 0 until the target is found | doğrusal arama
- bubble sort | sorting by repeatedly swapping out-of-order adjacent elements | kabarcık sıralaması

## Quick check
? For `int a[8];`, what is the index of the **last** element?
- `8` ~~ `a[8]` is out of bounds!
* `7` ~~ Indices run from `0` to `size - 1`, so `0 .. 7`.
- `1` ~~ C arrays are 0-indexed, not 1-indexed.
- `9` ~~ Out of bounds.
! An array of size `N` has indices `0` through `N - 1`.

? If you pass `int nums[5]` to `void doubleAll(int a[], int n)` and multiply each `a[i]` by 2, what happens to `nums` in `main`?
- `nums` stays unchanged ~~ Arrays are NOT copied by value; the function receives the array's address.
* `nums` in `main` IS doubled ~~ Changes to `a[i]` modify the caller's array directly.
- Compile error ~~ Passing `int a[]` is standard C.
- Only `nums[0]` changes ~~ The loop updates all `n` elements.
! Passing an array passes a pointer to its first element, so the function modifies the original array.

? In `int grid[3][4];`, how many `int` elements does `grid` hold?
- `7` ~~ Multiply rows × columns, don't add.
* `12` ~~ `3` rows × `4` columns = `12` elements.
- `3` ~~ `3` is only the number of rows.
- `4` ~~ `4` is only the number of columns.
! A 2D array `T[rows][cols]` holds `rows * cols` elements.
