---
title: Programming in C — the essentials
minutes: 20
intro: variables, input/output, if, loops, functions, arrays, pointers
---

Programming is giving a computer **exact steps**. Eight pictures, eight ideas.

:::idea From code to program
@widget viz name=c-pipeline
Plan the steps first — a **flowchart** draws them with these shapes:
@widget viz name=c-symbols
[Go deeper](#/lesson/c-02)
:::

:::idea Every program has the same skeleton
@widget viz name=c-skeleton
[Go deeper](#/lesson/c-05)
:::

:::idea Variables are labelled boxes
@widget viz name=c-variables
[Go deeper](#/lesson/c-05)
:::

:::idea scanf reads, printf shows
@widget viz name=c-io
Format codes: `%d` int · `%f` float · `%lf` double (scanf) · `%c` char · `%s` text. **Never forget the `&` in scanf.**
```c run stdin="20"
#include <stdio.h>
int main() {
    int age;
    printf("How old are you? ");
    scanf("%d", &age);
    printf("Next year you'll be %d.\n", age + 1);
    return 0;
}
```
[Go deeper](#/lesson/c-06)
:::

:::idea if chooses a path
@widget viz name=c-ifelse
`==` compares, `=` stores — mixing them up is the classic exam bug. [Go deeper](#/lesson/c-08)
:::

:::idea Loops repeat
```flow
s  start  Start
a  proc  i = 1
c  dec  i <= 5 ?  yes:p no:z
p  io  print i
k  proc  i = i + 1  ->c
z  end  End
```
`for (int i = 1; i <= 5; i++)` = exactly this picture. Press **Run**:
```c run
#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++)
        printf("%d ", i);
    return 0;
}
```
[Go deeper](#/lesson/c-09)
:::

:::idea Functions are machines
@widget viz name=c-function
[Go deeper](#/lesson/c-11)
:::

:::idea Arrays and strings are rows of boxes
@widget viz name=c-array
@widget viz name=c-strings
[Go deeper: arrays](#/lesson/c-12) · [strings](#/lesson/c-15)
:::

:::idea Pointers hold addresses
@widget viz name=c-pointer
That's why `scanf("%d", &x)` can fill `x`. [Go deeper](#/lesson/c-13)
:::

:::remember If you remember only this
- `#include <stdio.h>` · `int main() { … return 0; }` · `;` after every statement
- `int` / `double` / `char` — int ÷ int drops the decimals
- `scanf` needs `&` · `==` compares, `=` stores
- arrays start at `[0]` · `&` = where? · `*` = what's there?
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
