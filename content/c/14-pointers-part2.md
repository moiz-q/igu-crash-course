---
id: c-14
title: Pointers (Part 2): Arrays and pass-by-reference
goal: use pointers to modify caller variables (swap) and walk through arrays using pointer arithmetic
week: 13
minutes: 20
---

Now that you know `&` and `*`, let's see the two biggest reasons C uses pointers: **changing caller variables from a function** and **working with arrays**.

## Pass-by-reference: the `swap` function

Remember from Lesson 11 that `void badSwap(int a, int b)` only swaps local copies. By passing **addresses** (`&x, &y`) into pointer parameters (`int *a, int *b`), the function reaches back into `main`'s variables!

Step through this in the memory visualizer to see `a` and `b` pointing into `main`'s stack frame:

```memviz
#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main() {
    int x = 3, y = 7;
    swap(&x, &y);
    printf("x=%d y=%d\n", x, y);
    return 0;
}
```

## Pointers and arrays

In C, an array name `arr` (when used in an expression) decays to the **address of its first element** (`&arr[0]`).
- `int *p = arr;` points to `arr[0]`.
- `p + 1` does **not** add 1 byte — it advances by `1 * sizeof(int)` (4 bytes) to point to `arr[1]`!
- In general, `*(p + i)` is the exact same element as `arr[i]`.

```c run
#include <stdio.h>

int main() {
    int arr[4] = {10, 20, 30, 40};
    int *p = arr;

    for (int i = 0; i < 4; i++) {
        printf("arr[%d] = %d, *(p+%d) = %d\n", i, arr[i], i, *(p + i));
    }
    return 0;
}
```

## Try it

Solve the pointer-function and array-pointer exercises below!

@widget exercises lesson=c-14

## Common mistakes
- Writing `swap(x, y)` instead of `swap(&x, &y)` when `swap` expects `int *` pointers.
- Writing `*p++` expecting to increment the *value* `*p` — `++` binds tighter than `*`, so `*p++` reads `*p` and then moves `p` to the next element! Use `(*p)++` to increment the value.
- Incrementing a pointer past the end of the array and dereferencing it.

## Key terms
- pass-by-reference | passing variable addresses (`&x`) so a function can modify the caller's variables | adres ile aktarım
- pointer arithmetic | adding `k` to a pointer moves by `k * sizeof(*p)` bytes | işaretçi aritmetiği
- array decay | an array name turning into a pointer to its first element (`&arr[0]`) | dizi indirgenmesi

## Quick check
? Given `int a[4] = {5, 10, 15, 20}; int *p = a;`, what is `*(p + 2)`?
- `5` ~~ `*(p + 0)` is `5`.
- `10` ~~ `*(p + 1)` is `10`.
* `15` ~~ `p + 2` points to `a[2]`, which is `15`.
- `7` ~~ Pointer arithmetic steps by whole `int`s, not adding `2` to `5`.
! `*(p + i)` is identical to `a[i]`.

? How must you call `void reset(int *n) { *n = 0; }` for `int score = 50;`?
- `reset(score);` ~~ Passes an `int`, not an `int *` address.
* `reset(&score);` ~~ `&score` passes the address of `score`.
- `reset(*score);` ~~ `score` is not a pointer.
- `reset(&int score);` ~~ Invalid syntax.
! Pass `&score` when a function parameter is `int *`.

? If `p` is an `int *` (`sizeof(int) == 4`) pointing to address `0x1000`, what address does `p + 3` point to?
- `0x1003` ~~ Pointer arithmetic scales by `sizeof(int)`, not 1 byte.
* `0x100C` (`0x1000 + 3 * 4 = 0x1000 + 12`) ~~ Adding `3` to an `int *` advances by `3 * 4 = 12` bytes (`0xC`).
- `0x1006` ~~ `3 * 2 = 6` would be for a 2-byte `short`.
- `0x1030` ~~ `3 * 16 = 48`.
! Adding `k` to `T *p` advances the address by `k * sizeof(T)` bytes.
