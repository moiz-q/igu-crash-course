---
id: c-11
title: Functions and recursion
goal: declare, define and call functions, understand scope and pass-by-value, and write simple recursive functions
week: 11
minutes: 25
---

Putting all your code inside `main` quickly becomes messy. A **function** (*fonksiyon*) is a reusable named block of code that does one specific job.


@widget viz name=c-function

## Prototype, definition and call

1. **Prototype (declaration)** at the top tells the compiler the function's name, return type and parameter types.
2. **Definition** has the `{ ... }` body.
3. **Call** runs the function with actual arguments.

```c run
#include <stdio.h>

int add(int a, int b);          // 1. prototype
void greet(void);               // void = returns nothing

int main() {
    greet();
    int total = add(12, 8);     // 3. call
    printf("Sum = %d\n", total);
    return 0;
}

void greet(void) {              // 2. definition
    printf("Welcome to C functions!\n");
}

int add(int a, int b) {
    return a + b;
}
```

## Scope and pass-by-value

- **Local variable:** declared inside `{ ... }` of a function; exists only while that function runs.
- **Global variable:** declared outside all functions; visible everywhere (use sparingly!).
- **Pass-by-value:** C passes a **copy** of each argument to the function. Changing a parameter inside the function does **not** change the caller's variable!

```c run
#include <stdio.h>

void tryChange(int x) {
    x = 999;   // changes only the local copy!
}

int main() {
    int num = 10;
    tryChange(num);
    printf("num is still %d\n", num);
    return 0;
}
```

## Recursion intro (`fact(n)`)

A **recursive function** calls itself on a smaller input until it hits a **base case** (stopping condition).

```c run
#include <stdio.h>

int fact(int n) {
    if (n <= 1) return 1;        // base case
    return n * fact(n - 1);      // recursive step
}

int main() {
    printf("5! = %d\n", fact(5));
    return 0;
}
```

## Try it

Solve the function and recursion exercises below!

@widget exercises lesson=c-11

## Common mistakes
- Forgetting `return` in a non-`void` function (e.g. `int max(int a, int b)`).
- Putting a semicolon `;` after the header of a function **definition**: `int add(int a, int b); { ... }` — only **prototypes** end with `;`.
- Writing a recursive function without a **base case**, causing stack overflow / infinite recursion.
- Expecting `void swap(int a, int b)` without pointers to swap variables in `main` (pass-by-value only swaps local copies!).

## Key terms
- function prototype | header ending in `;` telling the compiler a function's signature | fonksiyon prototipi
- return type | type of the value sent back by `return` (`void` if none) | dönüş tipi
- scope | region of code where a variable is visible (local vs global) | kapsam
- pass-by-value | passing a copy of a variable's value into a function | değer ile aktarım
- recursion | a function calling itself with a smaller problem and a base case | özyineleme (rekürsif)

## Quick check
? What does `void` mean as a function's return type?
- The function returns `0` ~~ `int` functions return `0`, `void` functions return no value.
* The function does not return any value ~~ Use `return;` (optional) with no expression.
- The function takes no parameters ~~ `void` in the *parameter* list means no parameters; as return type it means no return value.
- The function cannot call `printf` ~~ `void` functions can run any statements, including `printf`.
! `void` as return type means the function returns nothing.

? What does this print?
```c
void bump(int n) { n += 10; }
int main() { int a = 5; bump(a); printf("%d\n", a); return 0; }
```
- `15` ~~ C uses pass-by-value, so `bump` only modifies its own copy `n`.
* `5` ~~ `a` in `main` is unchanged.
- `10` ~~ `a` stays `5`.
- Compile error ~~ Valid C.
! Because C passes arguments by value, changing `n` inside `bump` does not affect `a`.

? What happens if a recursive function has no base case?
- It returns `0` automatically ~~ C never inserts a base case.
* It keeps calling itself until memory (the call stack) runs out ~~ Always write a stopping condition first.
- It runs only once ~~ Without a base case, it never stops calling itself.
- The compiler converts it to a `for` loop ~~ It runs recursively until stack overflow.
! Every recursive function needs a base case that stops the recursion.
