---
id: math-09
title: First-degree equations and systems
goal: solve first-degree linear equations in one variable and 2x2 systems of linear equations
week: 9
minutes: 18
---

A **first-degree (linear) equation** has variables only to the power $1$: $ax + b = 0$ ($a \ne 0$).

## Solving one-variable linear equations

1. Clear fractions (multiply both sides by the common denominator).
2. Expand parentheses.
3. Move variable terms to one side and constants to the other.
4. Divide by the coefficient of $x$.

**Example**: Solve $\frac{x - 1}{2} + \frac{x + 2}{3} = 4$.
Multiply every term by $6$:
$$3(x - 1) + 2(x + 2) = 24 \implies 3x - 3 + 2x + 4 = 24 \implies 5x + 1 = 24 \implies x = \frac{23}{5}$$

**Special cases**:
- $0 \cdot x = 0$ → **Infinitely many solutions** ($\mathbb{R}$).
- $0 \cdot x = 5$ → **No solution** ($\emptyset$).

## Systems of 2 linear equations

Solve by **elimination** (add/subtract equations to cancel a variable) or **substitution**:
$$\begin{cases} 2x + y = 11 \\ x - y = 1 \end{cases}$$
Add both equations: $3x = 12 \implies x = 4$. Substitute back: $4 - y = 1 \implies y = 3$. Solution: $(4, 3)$.

## Try it

Practice first-degree equations and linear systems:

@widget mathdrill topic=linear

## Common mistakes

- Multiplying only the fractions by the LCD and forgetting to multiply the right-hand side (`4` → `24` above).
- Distributing a minus sign wrong: $-(x - 3) = -x + 3$, NOT $-x - 3$.
- Answering with only $x$ when a system asks for $x + y$ or $(x, y)$.

## Key terms

- linear equation | an equation of degree 1 ($ax + b = 0$) | birinci dereceden denklem
- elimination method | adding or subtracting equations to cancel one variable | yok etme yöntemi
- solution set | the set of all values satisfying an equation | çözüm kümesi

## Quick check

? Solve $3(2x - 1) - 2(x + 4) = 5$:
- $x = 2$ ~~ $6x - 3 - 2x - 8 = 4x - 11 = 5 \implies 4x = 16 \implies x = 4$
* $x = 4$ ~~ $4x - 11 = 5 \implies 4x = 16 \implies x = 4$
- $x = 3$ ~~ check: $3(5) - 2(7) = 1 \ne 5$
- $x = -4$ ~~ sign error
! Expand carefully: $6x - 3 - 2x - 8 = 5 \implies 4x = 16 \implies x = 4$.

? If $3x + 2y = 19$ and $x - 2y = 1$, what is $x \cdot y$?
- 10 ~~ $x = 5, y = 2$ gives $10$? Wait: $3(5)+2(2)=19$ and $5-2(2)=1$ → $5 \cdot 2 = 10$!
* 10 ~~ add equations: $4x = 20 \implies x = 5$, then $5 - 2y = 1 \implies y = 2$, so $xy = 10$
- 12 ~~ $x=4, y=3$ does not satisfy $x-2y=1$
- 7 ~~ $7$ is $x+y$, not $x \cdot y$
! Adding cancels $2y$: $4x = 20 \implies x = 5$, $y = 2$, so $x \cdot y = 10$.

? For which $k$ does $(k - 2)x = 5$ have **no solution** ($\emptyset$)?
- $k = 0$ ~~ gives $-2x = 5 \implies x = -5/2$
* $k = 2$ ~~ gives $0 \cdot x = 5$, which is impossible
- $k = 5$ ~~ gives $3x = 5$
- $k = -2$ ~~ gives $-4x = 5$
! $0 \cdot x = \text{nonzero}$ has no solution, so $k - 2 = 0 \implies k = 2$.
