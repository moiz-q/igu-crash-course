---
title: Programming in C — the essentials
minutes: 25
intro: variables, input/output, if, loops, functions, arrays, pointers
---

Programming is just **giving a computer very exact steps**. You only need eight ideas to understand most of this course. Read each one, look at the tiny example, and move on.

:::idea A program is a list of exact steps
A computer can't guess. An **algorithm** is a step-by-step plan, like a recipe. A **flowchart** draws the same plan with boxes: an oval for start/end, a parallelogram for input/output, a rectangle for a calculation, a diamond for a yes/no question.

C code is written by people, then a **compiler** turns it into a program the computer can run.

[Go deeper: algorithms and flowcharts](#/lesson/c-02)
:::

:::idea Every C program has the same skeleton
```c
#include <stdio.h>   // lets us use printf and scanf

int main() {         // the program starts here
    printf("Hello!\n");
    return 0;        // "finished OK"
}
```
You will copy this shape thousands of times. Every statement ends with `;`.

[Go deeper: intro to C](#/lesson/c-05)
:::

:::idea Variables are labelled boxes
A **variable** stores one value. You must say what **type** of value it holds:

| Type | Holds | Example |
| --- | --- | --- |
| `int` | whole numbers | `int age = 19;` |
| `float` / `double` | decimals | `double price = 4.50;` |
| `char` | one character | `char grade = 'A';` |

**Watch out:** `7 / 2` is `3` with `int`s (the decimal part is thrown away). Use `7.0 / 2` to get `3.5`.

[Go deeper: data types](#/lesson/c-05) · [operators](#/lesson/c-07)
:::

:::idea printf shows, scanf reads
```c run stdin="20"
#include <stdio.h>
int main() {
    int age;
    printf("How old are you? ");
    scanf("%d", &age);              // & = "store it in age"
    printf("Next year you'll be %d.\n", age + 1);
    return 0;
}
```
The **format codes** say what type to print/read: `%d` int, `%f` float, `%lf` double (in scanf), `%c` char, `%s` text. Forgetting the `&` in `scanf` is the #1 beginner bug.

[Go deeper: printf and scanf](#/lesson/c-06)
:::

:::idea if decides, loops repeat
**if** runs code only when a condition is true. **Loops** repeat code.

```c run
#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {     // start; keep going while; step
        if (i % 2 == 0)                 // % = remainder → even number?
            printf("%d is even\n", i);
        else
            printf("%d is odd\n", i);
    }
    return 0;
}
```
Use `==` to **compare** and `=` to **store** — mixing them up is a classic exam mistake. `for` is for counting; `while` is for "repeat until something happens".

[Go deeper: decisions](#/lesson/c-08) · [loops](#/lesson/c-09)
:::

:::idea Functions are mini-programs with a name
A **function** does one job. You give it inputs (**parameters**) and it can give back one result (**return**).

```c
int square(int x) {      // takes an int, gives back an int
    return x * x;
}
// in main:  printf("%d", square(4));   → 16
```
Functions keep code short and reusable. `void` means "returns nothing".

[Go deeper: functions](#/lesson/c-11)
:::

:::idea Arrays are a row of boxes
An **array** stores many values of the same type under one name. Counting starts at **0**.

```c
int marks[5] = {70, 85, 90, 60, 75};
// marks[0] is 70, marks[4] is 75, marks[5] does NOT exist!
```
You almost always walk through an array with a `for` loop: `for (int i = 0; i < 5; i++)`. A **string** is just an array of `char` that ends with `'\0'`.

[Go deeper: arrays](#/lesson/c-12) · [strings](#/lesson/c-15)
:::

:::idea A pointer is an address
Every variable lives at an **address** in memory. A **pointer** stores that address.

- `&x` = "the address of x"
- `*p` = "the value at the address in p"

```c
int x = 5;
int *p = &x;   // p points to x
*p = 9;        // changes x to 9
```
This is how `scanf("%d", &x)` can change `x`, and how a function can change a variable in `main`. Use the memory visualizer in the full lesson to *see* it.

[Go deeper: pointers](#/lesson/c-13)
:::

:::remember If you remember only this
- Skeleton: `#include <stdio.h>`, `int main() { … return 0; }`, `;` after every statement.
- `int` / `double` / `char`; integer division drops decimals.
- `printf` with `%d %f %c %s`; `scanf` needs `&`.
- `==` compares, `=` stores. `for` counts, `while` waits.
- Arrays start at index 0. Pointers hold addresses: `&` gets one, `*` follows one.
:::

## Quick check

? What does `printf("%d", 7 / 2);` print?
- 3.5 ~~ both numbers are int, so the decimal part is dropped
* 3 ~~ integer division
- 4 ~~ C doesn't round up here
- 3.0 ~~ %d prints an int
! int / int gives an int.

? Which line correctly reads an integer into `n`?
- `scanf("%d", n);` ~~ the & is missing
* `scanf("%d", &n);` ~~ & gives scanf the address of n
- `scanf(n);` ~~ needs a format string
- `printf("%d", &n);` ~~ printf shows, it doesn't read
! scanf needs the address: `&n`.

? `int a[4] = {3, 6, 9, 12};` — what is `a[1]`?
- 3 ~~ that's a[0]
* 6 ~~ indexes start at 0
- 9 ~~ that's a[2]
- error ~~ a[1] exists
! First element = index 0.

? What does `if (x = 5)` do?
- compares x with 5 ~~ that needs ==
* stores 5 in x (and the condition is always true) ~~ the classic = vs == bug
- causes a compile error ~~ it compiles, which is why it's dangerous
- does nothing ~~ it changes x
! Compare with `==`.

? `int x = 1; int *p = &x; *p = 4;` What is x now?
- 1 ~~ *p changed it
* 4 ~~ p points to x, so *p = 4 changes x
- the address of x ~~ x stores a number, not an address
- an error ~~ this is valid C
! `*p` means "the variable p points to".
