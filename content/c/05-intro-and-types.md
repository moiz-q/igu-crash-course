---
id: c-05
title: Intro to C and data types
goal: write a basic C program, compile it with gcc, and choose between int, float, double and char
week: 4
minutes: 20
---

Every C program has the same basic skeleton. Once you learn it, you can focus on solving problems.


@widget viz name=c-skeleton
@widget viz name=c-variables

## Anatomy of a C program

```c run
#include <stdio.h>   // gives us printf and scanf

/* Every C program starts running inside main() */
int main() {
    int age = 19;
    printf("Age is %d\n", age);
    return 0;        // 0 tells the OS the program finished without errors
}
```

- `#include <stdio.h>` loads the **Standard Input/Output** library (`printf`, `scanf`).
- `int main() { ... }` is the entry point — execution always starts at `main`.
- Every statement ends with a semicolon `;`.
- **Comments:** `// single-line` and `/* multi-line */` are ignored by the compiler.
- **Compiling on your computer with gcc:** `gcc hello.c -o hello` then `./hello` (or `hello.exe` on Windows).

## Variables and the 4 core data types

A **variable** (*değişken*) is a named box in RAM that holds one value of a specific **data type** (*veri tipi*).

| Type | Stores | Typical size (`sizeof`) | Example |
| --- | --- | --- | --- |
| `int` | Whole numbers (positive, negative, 0) | 4 bytes | `int count = -12;` |
| `float` | Decimal numbers (~6–7 digits precision) | 4 bytes | `float gpa = 3.45f;` |
| `double` | High-precision decimals (~15 digits) | 8 bytes | `double pi = 3.1415926535;` |
| `char` | A single character (in single quotes `' '`) | 1 byte | `char grade = 'A';` |

**Variable naming rules:**
- Use letters, digits and `_` only (never spaces, `-`, or Turkish characters like `ş, ğ`).
- **Cannot start with a digit** (`1num` is invalid; `num1` is valid).
- Cannot be a C keyword (`int`, `return`, `if`).
- C is **case-sensitive** (`Age` and `age` are two different variables).

**Declaration vs initialization:**
- Declaration: `int x;` (box created, value is **uninitialized garbage** — never read it before assigning!).
- Initialization: `int x = 10;` (created with a known starting value).

```c run
#include <stdio.h>

int main() {
    int year = 2026;
    float price = 49.90f;
    double exact = 3.14159265;
    char letter = 'C';

    printf("year=%d, price=%.2f, exact=%.6f, letter=%c\n", year, price, exact, letter);
    printf("Sizes (bytes): int=%d float=%d double=%d char=%d\n",
           (int)sizeof(int), (int)sizeof(float), (int)sizeof(double), (int)sizeof(char));
    return 0;
}
```

## Try it

Solve the exercises for this lesson below (start with easy, then try medium and exam-level).

@widget exercises lesson=c-05

## Common mistakes
- Forgetting the semicolon `;` at the end of a statement.
- Using double quotes `"A"` for a `char` instead of single quotes `'A'` (`"A"` is a string, `'A'` is a `char`).
- Reading a declared variable before giving it a value (`int x; printf("%d", x);` prints garbage!).
- Starting a variable name with a number like `2nd_score`.

## Key terms
- #include <stdio.h> | preprocessor directive loading standard I/O functions | standart G/Ç başlığı
- variable | a named memory location holding a value of a given type | değişken
- initialization | giving a variable its first value when declaring it | ilk değer atama
- sizeof | operator that returns the memory size of a type/variable in bytes | boyut operatörü

## Quick check
? Which variable name is **valid** in C?
- `1student` ~~ Variable names cannot start with a digit.
- `student-age` ~~ Hyphens `-` are subtraction, not allowed in names.
- `return` ~~ `return` is a reserved C keyword.
* `student_age_1` ~~ Starts with a letter and uses only letters, digits and `_`.
! C identifiers use letters, digits and `_`, and cannot start with a digit or be a keyword.

? Which data type is best for storing a single letter `'K'`?
- `int` ~~ `int` is for whole numbers (though `char` is a small integer underneath).
- `float` ~~ `float` is for decimal numbers.
* `char` ~~ `char` holds a single character in 1 byte.
- `double` ~~ `double` is for high-precision decimals.
! Use `char` with single quotes `'K'` for a single character.

? What happens if you forget `;` at the end of `int x = 5` in C?
- The program still runs normally ~~ C requires `;` to terminate every statement.
* The compiler stops with a syntax error ~~ C compilers refuse to build code with missing semicolons.
- `x` becomes `0` ~~ It will not compile at all.
- Only a warning is printed ~~ Missing `;` is a hard compile error.
! Every statement in C must end with `;`.
