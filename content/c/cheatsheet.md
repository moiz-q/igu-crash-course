---
title: Algorithms & Programming (C) — Cheat Sheet
---

## 1. Program skeleton

```c
#include <stdio.h>

int main(void) {
    /* statements */
    return 0;
}
```

## 2. Data types & `printf` / `scanf` specifiers

| Type | Typical size | `printf` | `scanf` |
| --- | --- | --- | --- |
| `int` | 4 bytes | `%d` | `%d` (needs `&x`) |
| `long` | 4–8 bytes | `%ld` | `%ld` |
| `float` | 4 bytes | `%f`, `%.2f` | `%f` |
| `double` | 8 bytes | `%f`, `%.2f` | `%lf` |
| `char` | 1 byte | `%c` | `" %c"` (leading space skips `\n`) |
| `char[]` (string) | `len + 1` | `%s` | `%19s` (no `&`) |

## 3. Operators & precedence (high → low)

1. `()` `[]` `->` `.`
2. Unary: `!` `++` `--` `(type)` `&` `*` `-`
3. `*` `/` `%` (integer `/` truncates toward 0; `7 / 2 == 3`, `7 % 2 == 1`)
4. `+` `-`
5. `<` `<=` `>` `>=`
6. `==` `!=` (never use `=` inside `if` by mistake!)
7. `&&` (AND)
8. `||` (OR)
9. `?:` (ternary)
10. `=` `+=` `-=` `*=` `/=` `%=`

## 4. Control flow

```c
if (cond) { ... } else if (cond2) { ... } else { ... }

switch (x) {
    case 1: ...; break;
    default: ...;
}

for (int i = 0; i < n; i++) { ... }   // known count
while (cond) { ... }                   // 0 or more times
do { ... } while (cond);               // at least 1 time (note semicolon!)
```

## 5. Arrays, strings, functions & pointers

- **Arrays**: 0-indexed (`a[0]` .. `a[n-1]`). Passing `a` to a function passes a pointer to `a[0]` (also pass `n`!).
- **Strings**: `char s[20] = "hello";` ends with `'\0'`. `<string.h>`: `strlen(s)`, `strcpy(dst, src)`, `strcmp(a, b) == 0`, `strcat(dst, src)`.
- **Pointers**: `int *p = &x;` → `p` holds address of `x`, `*p` reads/writes `x`.
- **Pass by reference**: `void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }` called as `swap(&x, &y);`.
- **2D array**: `int m[R][C];` → `m[r][c]`.

## 6. Structs & File I/O

```c
struct Student {
    char name[30];
    int id;
    double gpa;
};
struct Student s = {"Ali", 101, 3.45};
struct Student *p = &s;
p->gpa = 3.60;  // same as (*p).gpa
```

```c
FILE *fp = fopen("data.txt", "r"); // "w" write/overwrite, "a" append
if (fp == NULL) return 1;
fprintf(fp, "%d\n", x);
fscanf(fp, "%d", &x);
fclose(fp);
```
