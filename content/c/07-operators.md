---
id: c-07
title: Operators and expressions
goal: use arithmetic, assignment, increment/decrement, relational and logical operators and predict operator precedence
week: 6
minutes: 25
---

Operators are the symbols that do math, compare values, and combine conditions. Written midterm exams love "predict the output" questions on **integer division** and **`++`/`--`**!

## 1. Arithmetic operators and integer division

`+`, `-`, `*`, `/`, `%` (modulo = remainder of integer division, e.g. `17 % 5 == 2`).

:::warn Integer division trap!
In C, **`int / int` ALWAYS produces an `int`** — the decimal part is chopped off (truncated toward zero)!
- `7 / 2` is **`3`**, NOT `3.5`!
- `double x = 7 / 2;` still gives `3.0`, because `7 / 2` happened as integers *before* assigning to `x`!
- To get `3.5`, make at least one side floating-point: **`(double)7 / 2`** or **`7 / 2.0`**.
:::

## 2. Assignment and `++` / `--` (prefix vs postfix)

Compound assignment: `x += 5;` means `x = x + 5;` (same for `-=`, `*=`, `/=`, `%=`).

Increment `++` adds 1; decrement `--` subtracts 1. Watch **where** the `++` sits:
- **Prefix (`++i`):** add 1 **first**, *then* use the new value.
- **Postfix (`i++`):** use the **current** value *first*, *then* add 1.

```c run
#include <stdio.h>

int main() {
    int i = 5;
    int a = i++;   // a gets 5, then i becomes 6
    int b = ++i;   // i becomes 7, then b gets 7
    printf("i=%d a=%d b=%d\n", i, a, b);

    printf("7/2 = %d, 7/2.0 = %.1f, 17%%5 = %d\n", 7 / 2, 7 / 2.0, 17 % 5);
    return 0;
}
```

## 3. Relational and logical operators

Relational operators return `1` (true) or `0` (false): `==`, `!=`, `<`, `>`, `<=`, `>=`.
Logical operators combine conditions:
- `&&` (**AND**): true only if *both* sides are true.
- `||` (**OR**): true if *at least one* side is true.
- `!` (**NOT**): flips true (`1`) ↔ false (`0`).

*(Short-circuiting: in `a && b`, if `a` is false, `b` is not even evaluated. In `a || b`, if `a` is true, `b` is skipped.)*

## 4. Operator precedence (highest → lowest)

1. `( )`
2. Unary: `!`, `++`, `--`, unary `-`, `(type)` cast
3. `*`, `/`, `%`
4. `+`, `-`
5. `<`, `<=`, `>`, `>=`
6. `==`, `!=`
7. `&&`
8. `||`
9. `=`, `+=`, `-=`, etc.

## Try it

Work through the predict-the-output, bug-hunt and coding exercises below!

@widget exercises lesson=c-07

## Common mistakes
- Writing `=` (assignment) instead of `==` (comparison) inside `if (x = 5)` — that sets `x` to 5 and is always true!
- Writing `1 <= x <= 10` in C — C evaluates `(1 <= x)` as `0` or `1`, then compares that to `10` (always true!). Always write `x >= 1 && x <= 10`.
- Using `%` with `float` or `double` — `%` only works on integers (`int`).
- Forgetting `(double)` cast when dividing two `int` variables for an average.

## Key terms
- integer division | division of two integers that truncates any remainder | tam sayı bölmesi
- modulo (%) | returns the remainder of integer division | mod (kalan) operatörü
- type casting | converting a value to another type, e.g. `(double)a / b` | tür dönüşümü
- short-circuit evaluation | skipping the right side of `&&` or `||` once the result is already known | kısa devre değerlendirme

## Quick check
? What does `printf("%.1f\n", (float)(9 / 2));` print?
- `4.5` ~~ `9 / 2` is evaluated *inside* parentheses as `int / int = 4` before the `(float)` cast!
* `4.0` ~~ `9 / 2` gives integer `4`, then `(float)4` prints as `4.0`.
- `5.0` ~~ Integer division truncates toward zero; it never rounds up.
- `4` ~~ `%.1f` prints one decimal place.
! Parentheses force `9 / 2` to happen as integer division first (`4`), then cast to `4.0`.

? After `int x = 3; int y = x++ * 2;`, what are `x` and `y`?
- `x = 4, y = 8` ~~ `x++` is postfix, so `y` uses the old value `3`.
* `x = 4, y = 6` ~~ `y` gets `3 * 2 = 6`, and `x` increments to `4`.
- `x = 3, y = 6` ~~ `x` still increments to `4`.
- `x = 4, y = 7` ~~ `x` increments by 1 after the multiplication.
! Postfix `x++` returns the old value (`3`) for the expression, then increments `x` to `4`.

? How do you write "$x$ is between 10 and 20 inclusive" in C?
- `10 <= x <= 20` ~~ In C, `(10 <= x)` becomes `0` or `1`, which is always `<= 20`!
* `x >= 10 && x <= 20` ~~ Both comparisons must be combined with `&&`.
- `x >= 10 || x <= 20` ~~ Every number is either `>= 10` or `<= 20`!
- `10 <= x & x <= 20` ~~ `&` is bitwise AND; logical AND is `&&`.
! Always split chained inequalities using `&&`.
