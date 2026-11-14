---
id: math-10
title: Second-degree (quadratic) equations
goal: solve quadratic equations by factoring or the quadratic formula, classify roots with the discriminant, and apply Vieta's formulas
week: 11
minutes: 22
---

A **quadratic equation** has the standard form $ax^2 + bx + c = 0$ ($a \ne 0$).

## Method 1: Factoring
Solve $x^2 - 7x + 12 = 0$:
$$(x - 3)(x - 4) = 0 \implies x_1 = 3,\; x_2 = 4$$

## Method 2: Quadratic formula & Discriminant ($\Delta$)

When factoring isn't obvious, compute the **discriminant** $\Delta = b^2 - 4ac$:
- $\Delta > 0$: **2 distinct real roots**
- $\Delta = 0$: **1 repeated real root** (double root, $x_1 = x_2 = -\frac{b}{2a}$)
- $\Delta < 0$: **no real roots** ($\emptyset$ in $\mathbb{R}$)

$$x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}$$

## Vieta's formulas (Kök–katsayı ilişkileri)

Without even finding $x_1$ and $x_2$, for $ax^2 + bx + c = 0$:
- **Sum of roots**: $x_1 + x_2 = -\frac{b}{a}$
- **Product of roots**: $x_1 \cdot x_2 = \frac{c}{a}$

**Example**: For $2x^2 - 6x + 5 = 0$, $x_1 + x_2 = -\frac{-6}{2} = 3$ and $x_1 x_2 = \frac{5}{2}$.

## Try it

Practice quadratic equations, discriminants, and Vieta's formulas:

@widget mathdrill topic=quadratic

## Common mistakes

- Forgetting the minus sign in $x_1 + x_2 = -\frac{b}{a}$ (writing $+\frac{b}{a}$).
- Dividing only $-b$ or only $\sqrt{\Delta}$ by $2a$ in the quadratic formula—the **entire** numerator $-b \pm \sqrt{\Delta}$ is divided by $2a$.
- Setting factors equal to a nonzero number: if $(x - 2)(x - 3) = 6$, you CANNOT say $x - 2 = 6$! Always move everything to one side so the RHS is **0**.

## Key terms

- quadratic equation | a polynomial equation of degree 2: $ax^2 + bx + c = 0$ | ikinci dereceden denklem
- discriminant ($\Delta$) | $b^2 - 4ac$, which determines how many real roots exist | diskriminant
- Vieta's formulas | $x_1 + x_2 = -b/a$ and $x_1 x_2 = c/a$ | kök-katsayı bağıntıları

## Quick check

? For which value of $m$ does $x^2 - 6x + m = 0$ have **equal (repeated) real roots**?
- $m = 6$ ~~ $\Delta = 36 - 24 = 12 > 0$ (two distinct roots)
* $m = 9$ ~~ $\Delta = (-6)^2 - 4(1)(m) = 36 - 4m = 0 \implies m = 9$
- $m = 12$ ~~ $\Delta = 36 - 48 < 0$ (no real roots)
- $m = -9$ ~~ $\Delta = 36 + 36 > 0$
! Repeated real roots occur when $\Delta = b^2 - 4ac = 0$.

? If $x_1$ and $x_2$ are the roots of $x^2 - 5x + 3 = 0$, what is $x_1 + x_2 + x_1 x_2$?
- $-2$ ~~ forgot the minus in $-b/a$
- $2$ ~~ $5 - 3 = 2$
* $8$ ~~ $x_1 + x_2 = -(-5)/1 = 5$ and $x_1 x_2 = 3/1 = 3$, so $5 + 3 = 8$
- $15$ ~~ $5 \times 3$, not $5 + 3$
! By Vieta's formulas, sum $= 5$ and product $= 3$, so $5 + 3 = 8$.

? Solve $2x^2 - 5x - 3 = 0$:
- $x = 3, \frac{1}{2}$ ~~ check $1/2$: $2(1/4) - 5/2 - 3 \ne 0$
* $x = 3, -\frac{1}{2}$ ~~ $(2x + 1)(x - 3) = 0 \implies x = -1/2$ or $x = 3$
- $x = -3, \frac{1}{2}$ ~~ sign error
- $x = -3, -\frac{1}{2}$ ~~ product would be $+3/2$
! Factor as $(2x + 1)(x - 3) = 0$, giving $x = -\frac{1}{2}$ and $x = 3$.
