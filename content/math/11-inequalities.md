---
id: math-11
title: Inequalities and interval notation
goal: solve first-degree and sign-table inequalities and express solution sets in interval notation
week: 12
minutes: 18
---

An **inequality** uses `<`, `>`, `≤`, or `≥` instead of `=`. Most rules match solving equations—with **one critical twist**.


@widget viz name=math-ineq

## The golden rule of inequalities

**Multiplying or dividing both sides by a negative number FLIPS the inequality sign!**
$$-2x < 10 \implies x > -5$$

## Interval notation

| Inequality | Interval | Meaning |
| --- | --- | --- |
| $a < x < b$ | $(a, b)$ | Open (endpoints **excluded**) |
| $a \le x \le b$ | $[a, b]$ | Closed (endpoints **included**) |
| $x \ge 3$ | $[3, \infty)$ | Always use `)` next to $\pm\infty$ |

## Quadratic / rational inequalities (sign table)

Solve $(x - 1)(x - 4) \le 0$:
1. Find roots: $x = 1$ and $x = 4$.
2. Place roots on a number line: intervals $(-\infty, 1)$, $(1, 4)$, $(4, \infty)$.
3. Leading sign is positive ($+x^2$), so signs alternate from the right: **`+`**, **`-`**, **`+`**.
4. We want $\le 0$ (`-` or `0`), so the solution is **$[1, 4]$**.

*(For fractions like $\frac{x-1}{x-4} \le 0$, denominator roots like $x = 4$ can **never** be included with `[` because division by zero is undefined!)*

## Try it

Practice linear and sign-table inequalities:

@widget mathdrill topic=inequalities

## Common mistakes

- Forgetting to **flip** `<` to `>` when dividing by a negative coefficient (like $-3x \ge 12 \implies x \le -4$).
- Including a denominator root in a `<=` or `>=` solution (`[4]` instead of `(4)`).
- Writing `[3, ∞]`—infinity is never a reachable number, so always write `)` or `(` next to $\infty$ and $-\infty$.

## Key terms

- inequality | a mathematical comparison using $<, >, \le, \ge$ | eşitsizlik
- interval notation | compact notation using `(` `)` for open and `[` `]` for closed bounds | aralık gösterimi
- sign table | a number-line table showing where a factored expression is `+`, `-`, or `0` | işaret tablosu

## Quick check

? Solve $5 - 3x \ge 17$:
- $x \ge -4$ ~~ forgot to flip the sign when dividing by $-3$
* $x \le -4$ ~~ $-3x \ge 12 \implies x \le -4$, i.e. $(-\infty, -4]$
- $x \le 4$ ~~ sign error on $17 - 5 = 12$
- $x \ge 4$ ~~ both sign and flip errors
! Subtract 5 to get $-3x \ge 12$, then divide by $-3$ and flip: $x \le -4$.

? What is the solution set of $x^2 - 9 < 0$?
- $(-\infty, -3) \cup (3, \infty)$ ~~ that is where $x^2 - 9 > 0$
* $(-3, 3)$ ~~ $(x - 3)(x + 3) < 0$ is negative between the roots $-3$ and $3$
- $[-3, 3]$ ~~ strict `<` excludes the endpoints
- $(0, 3)$ ~~ missed negative numbers like $-2$
! $x^2 < 9$ holds strictly between $-3$ and $3$: $(-3, 3)$.

? Solve $\frac{x - 2}{x - 5} \le 0$:
- $[2, 5]$ ~~ $x = 5$ makes the denominator zero, so it must be excluded!
* $[2, 5)$ ~~ $x = 2$ gives $0$ (included), while $x = 5$ is undefined (excluded)
- $(2, 5)$ ~~ $x = 2$ satisfies $\le 0$
- $(-\infty, 2] \cup (5, \infty)$ ~~ that is where the fraction is $\ge 0$
! Sign is `-` on $(2, 5)$; include numerator root $2$, exclude denominator root $5$: $[2, 5)$.
