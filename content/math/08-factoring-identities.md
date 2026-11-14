---
id: math-08
title: Factoring and algebraic identities
goal: expand and factor expressions using standard identities, common factors, grouping, and quadratic trinomials
week: 8
minutes: 20
---

Factoring turns a sum into a product—which is essential for simplifying fractions and solving quadratic equations.

## Must-know identities (Özdeşlikler)

| Name | Formula | Example |
| --- | --- | --- |
| **Square of a sum** | $(a + b)^2 = a^2 + 2ab + b^2$ | $(x + 3)^2 = x^2 + 6x + 9$ |
| **Square of a difference** | $(a - b)^2 = a^2 - 2ab + b^2$ | $(2x - 1)^2 = 4x^2 - 4x + 1$ |
| **Difference of squares** | $a^2 - b^2 = (a - b)(a + b)$ | $x^2 - 25 = (x - 5)(x + 5)$ |
| **Difference of cubes** | $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$ | $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$ |
| **Sum of cubes** | $a^3 + b^3 = (a + b)(a^2 - ab + b^2)$ | $x^3 + 27 = (x + 3)(x^2 - 3x + 9)$ |

## Factoring toolkit (in order!)

1. **Common factor first**: $6x^3 - 9x^2 = 3x^2(2x - 3)$.
2. **Grouping (4 terms)**: $ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)$.
3. **Trinomial $x^2 + bx + c$**: find two numbers that **multiply to $c$** and **add to $b$**.
   - Example: $x^2 - 5x + 6 = (x - 2)(x - 3)$ because $(-2)(-3) = 6$ and $(-2) + (-3) = -5$.

## Simplifying rational expressions

A **rational expression** is a fraction with polynomials, like $\frac{x^2 - 9}{x^2 + 5x + 6}$. To simplify: **factor the top and the bottom, then cancel common factors** (never cancel single terms!).

$$\frac{x^2 - 9}{x^2 + 5x + 6} = \frac{(x-3)(x+3)}{(x+2)(x+3)} = \frac{x-3}{x+2}, \quad x \neq -3, -2$$

✗ Wrong: $\frac{x+3}{x} = 3$ — you cannot cancel the $x$ inside a sum. Only **factors** (things that multiply) cancel.

## Try it

Practice algebraic identities and factoring:

@widget mathdrill topic=factoring

## Common mistakes

- Writing $(a + b)^2 = a^2 + b^2$ and forgetting the middle term **$+2ab$**.
- Thinking $a^2 + b^2$ factors into $(a + b)(a + b)$ over real numbers—**sum of squares** does not factor over $\mathbb{R}$!
- Trying to cancel terms before factoring: in $\frac{x^2 - 9}{x - 3}$, factor top first to $\frac{(x-3)(x+3)}{x-3} = x + 3$ ($x \ne 3$).

## Key terms

- identity | an equation true for all values of the variables | özdeşlik
- factoring | rewriting a sum/difference as a product of factors | çarpanlara ayırma
- difference of squares | $a^2 - b^2 = (a - b)(a + b)$ | iki kare farkı

## Quick check

? Simplify $\frac{x^2 - 16}{x^2 + 8x + 16}$ (for $x \ne \pm 4$):
- $\frac{x-4}{x+4}$ ~~ $(x-4)(x+4) / (x+4)^2 = \frac{x-4}{x+4}$ — correct!
* $\frac{x-4}{x+4}$ ~~ top factors as $(x-4)(x+4)$ and bottom as $(x+4)^2$; cancel one $(x+4)$
- $\frac{x+4}{x-4}$ ~~ inverted
- $1$ ~~ $-16$ and $+16$ do not cancel
! Factor numerator $(x-4)(x+4)$ and denominator $(x+4)^2$, then cancel $(x+4)$.

? If $a + b = 7$ and $ab = 10$, what is $a^2 + b^2$?
- 49 ~~ $49$ is $(a+b)^2$, forgot to subtract $2ab$
* 29 ~~ $a^2 + b^2 = (a+b)^2 - 2ab = 49 - 20 = 29$
- 39 ~~ subtracted $ab$ instead of $2ab$
- 69 ~~ added $2ab$ instead of subtracting
! $(a+b)^2 = a^2 + 2ab + b^2 \implies a^2 + b^2 = 7^2 - 2(10) = 29$.

? Factor $x^2 + 2x - 15$:
- $(x + 5)(x + 3)$ ~~ gives $+15$, not $-15$
* $(x + 5)(x - 3)$ ~~ $5 \cdot (-3) = -15$ and $5 + (-3) = +2$
- $(x - 5)(x + 3)$ ~~ gives $-2x$ in the middle
- $(x - 5)(x - 3)$ ~~ gives $+15$ and $-8x$
! Look for two numbers multiplying to $-15$ and adding to $+2$: $+5$ and $-3$.
