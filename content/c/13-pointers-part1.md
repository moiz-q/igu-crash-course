---
id: c-13
title: Pointers (Part 1): Addresses, & and *
goal: understand memory addresses, declare pointers, dereference them with *, and use NULL safely
week: 13
minutes: 20
---

Every variable you declare lives at a numbered byte location in RAM, called its **memory address**. A **pointer** (*işaretçi*) is simply a variable whose value is the **memory address** of another variable.


@widget viz name=c-pointer

## `&` (address-of) and `*` (dereference)

Two operators do all the work:
- **`&x`:** gives the **address** of `x` (where `x` lives in RAM).
- **`int *p = &x;`:** declares `p` as a pointer-to-`int`, storing `x`'s address.
- **`*p`:** (**dereference**) follows the address stored in `p` to read or change `x` itself!

*(To print a pointer address safely in `printf`, cast to `(void *)p` and use `%p`.)*

## Watch it in memory step by step

Press **Next ▶** in the memory visualizer below and watch `p` store `x`'s address, and `*p = 99` change `x`!

```memviz
#include <stdio.h>

int main() {
    int x = 10;
    int *p = &x;
    *p = 99;
    printf("x = %d, *p = %d\n", x, *p);
    return 0;
}
```

## `NULL` pointers

If a pointer does not point to any valid variable yet, initialize it to **`NULL`**:
```c
int *p = NULL;
if (p != NULL) {
    printf("%d\n", *p);
}
```
Never dereference (`*p`) a `NULL` or uninitialized pointer — it crashes the program!

## Try it

Solve the pointer basics exercises below.

@widget exercises lesson=c-13

## Common mistakes
- Confusing `*` in a **declaration** (`int *p;` = `p` is a pointer) with `*` in an **expression** (`*p = 5;` = go to the address in `p` and set the value to `5`).
- Declaring `int* a, b;` thinking both are pointers — in C, `a` is `int *`, while `b` is a plain `int`! Write `int *a, *b;`.
- Dereferencing an uninitialized or `NULL` pointer (`int *p; *p = 5;` → crash!).

## Key terms
- memory address | the numbered location of a variable in RAM | bellek adresi
- pointer | a variable that stores a memory address | işaretçi (pointer)
- dereference (*) | accessing the value at the address stored in a pointer | adresteki değere erişme
- NULL | a special pointer value meaning "points to nothing" | NULL (boş işaretçi)

## Quick check
? What does `*p = 25;` do when `int x = 10; int *p = &x;`?
- Changes the address stored in `p` to `25` ~~ `*p` accesses the *target variable* (`x`), not the address inside `p`.
* Changes the value of `x` to `25` ~~ `p` points to `x`, so `*p = 25` modifies `x`.
- Creates a new variable `25` ~~ No new variable is created.
- Compile error ~~ Valid pointer dereference.
! `*p` means "follow `p` to the variable it points to" — here, `x`.

? What is `int *a, b;` in C?
- Both `a` and `b` are pointers to `int` ~~ The `*` attaches only to `a`.
* `a` is a pointer to `int`, and `b` is a regular `int` ~~ Write `int *a, *b;` if you want two pointers.
- Both `a` and `b` are regular `int`s ~~ `a` has `*`, so `a` is a pointer.
- Syntax error ~~ Valid C, though easy to misread.
! In `int *a, b;`, `*` belongs only to `a`.

? Why should you initialize an unused pointer to `NULL`?
- So `*p` prints `0` ~~ Dereferencing `NULL` still crashes!
* So you can check `if (p != NULL)` before dereferencing, instead of holding a random garbage address ~~ `NULL` is a safe "no target" sentinel.
- To double its size ~~ Pointers are always pointer-sized (8 bytes on 64-bit).
- So `scanf` can read into it without `&` ~~ Unrelated.
! Always initialize unused pointers to `NULL` and check `p != NULL` before `*p`.
