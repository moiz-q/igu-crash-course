---
id: bridge-07
title: Preview: Functions and graphs (Math II)
goal: evaluate functions, find domain and range, and sketch linear and quadratic graphs
week: 8
minutes: 20
---

**Mathematics II (MTH154)** moves from algebra into **functions, logarithms, trigonometry, limits and calculus**. Everything starts with the idea of a **function**.

## What is a function?

A **function** $f$ is a rule that gives **exactly one** output $f(x)$ for each allowed input $x$.
- **Domain (*tanım kümesi*):** all allowed input values $x$.
- **Range (*görüntü kümesi*):** all actual output values $f(x)$.

For example, if $f(x) = 2x + 3$, then:
$$f(4) = 2(4) + 3 = 11$$

Two restrictions to watch for when finding the domain of real functions:
1. You **cannot divide by zero**: in $g(x) = \frac{1}{x - 5}$, $x \neq 5$, so the domain is $\mathbb{R} \setminus \{5\}$.
2. You **cannot take an even root of a negative number**: in $h(x) = \sqrt{x - 2}$, we need $x - 2 \ge 0$, so $x \ge 2$, i.e. $[2, \infty)$.

## Linear and quadratic graphs

- **Linear:** $f(x) = mx + b$ is a straight line with **slope** $m$ and **y-intercept** $(0, b)$.
- **Quadratic:** $f(x) = ax^2 + bx + c$ is a **parabola**. It opens upward if $a > 0$ and downward if $a < 0$. Its vertex (*tepe noktası*) is at $x = -\frac{b}{2a}$.

## Composition and inverse functions

- **Composition:** $(f \circ g)(x) = f(g(x))$ — apply $g$ first, then plug the result into $f$.
  - If $f(x) = x^2$ and $g(x) = x + 1$, then $f(g(3)) = f(4) = 16$.
- **Inverse:** $f^{-1}(x)$ undoes $f$. To find it, write $y = f(x)$, swap $x$ and $y$, and solve for $y$.
  - For $f(x) = 2x - 6$: swap to get $x = 2y - 6 \implies y = \frac{x + 6}{2}$, so $f^{-1}(x) = \frac{x + 6}{2}$.

## Try it

Work out each question, then open the answer to check.

1. Find the domain of $f(x) = \frac{\sqrt{x + 1}}{x - 3}$.
:::reveal Show answer
We need $x + 1 \ge 0 \implies x \ge -1$, AND $x - 3 \neq 0 \implies x \neq 3$.
So the domain is $[-1, \infty) \setminus \{3\}$.
:::

2. Given $f(x) = 3x - 2$ and $g(x) = x^2 + 1$, find $(f \circ g)(2)$.
:::reveal Show answer
First $g(2) = 2^2 + 1 = 5$. Then $f(5) = 3(5) - 2 = 13$.
:::

3. Find $f^{-1}(x)$ for $f(x) = \frac{x - 4}{5}$.
:::reveal Show answer
Write $y = \frac{x - 4}{5}$, swap $x$ and $y$: $x = \frac{y - 4}{5} \implies 5x = y - 4 \implies y = 5x + 4$. So $f^{-1}(x) = 5x + 4$.
:::

## Common mistakes
- Writing $f^{-1}(x) = \frac{1}{f(x)}$ — the superscript $-1$ on a function means **inverse function**, not reciprocal!
- Computing $(f \circ g)(x)$ in the wrong order: $f(g(x))$ applies $g$ first, then $f$.
- Forgetting to exclude zeros of the denominator from the domain.

## Key terms
- function | a rule assigning each input $x$ exactly one output $f(x)$ | fonksiyon
- domain | the set of all valid input values $x$ | tanım kümesi
- range | the set of all output values $f(x)$ | görüntü kümesi
- inverse function | the function $f^{-1}$ that reverses $f$: $f^{-1}(f(x)) = x$ | ters fonksiyon

## Quick check
? If $f(x) = x^2 - 3x$, what is $f(-2)$?
- $-2$ ~~ Check the sign of $(-2)^2$ and $-3(-2)$.
- $2$ ~~ $(-2)^2 = +4$ and $-3(-2) = +6$, not $-2$.
* $10$ ~~ $(-2)^2 - 3(-2) = 4 + 6 = 10$.
- $-10$ ~~ Both terms are positive when $x = -2$.
! Substitute $-2$ carefully with parentheses: $(-2)^2 - 3(-2) = 4 + 6 = 10$.

? What is the domain of $f(x) = \sqrt{6 - 2x}$?
- $[3, \infty)$ ~~ For $x = 4$, $6 - 8 = -2 < 0$, which is not allowed.
* $(-\infty, 3]$ ~~ We need $6 - 2x \ge 0 \implies 6 \ge 2x \implies x \le 3$.
- $\mathbb{R} \setminus \{3\}$ ~~ $x = 3$ gives $\sqrt{0} = 0$, which is valid; values above 3 fail.
- $(-\infty, 3)$ ~~ $x = 3$ is allowed because $\sqrt{0} = 0$.
! For a square root, set the inside $\ge 0$: $6 - 2x \ge 0 \implies x \le 3$.

? If $f(x) = 4x + 8$, what is $f^{-1}(x)$?
- $\frac{1}{4x + 8}$ ~~ That is the reciprocal, not the inverse function.
* $\frac{x - 8}{4}$ ~~ Swap $x = 4y + 8 \implies y = \frac{x - 8}{4}$.
- $4x - 8$ ~~ You must divide by 4 as well as subtract 8.
- $\frac{x}{4} + 8$ ~~ Subtract 8 before dividing by 4.
! Swap $x$ and $y$ and solve: $x = 4y + 8 \implies y = (x - 8)/4$.
