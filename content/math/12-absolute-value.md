---
id: math-12
title: Absolute value equations and inequalities
goal: evaluate absolute value expressions and solve absolute value equations and inequalities
week: 13
minutes: 18
---

The **absolute value** $|x|$ is the distance of $x$ from $0$ on the number line—so it is **never negative** ($|x| \ge 0$).

$$|x| = \begin{cases} x & \text{if } x \ge 0 \\ -x & \text{if } x < 0 \end{cases}$$

Examples: $|5| = 5$, $|-5| = 5$, $|3 - \pi| = \pi - 3$ (because $3 - \pi < 0$, so we negate it to make it positive!).

## Equations & inequalities (for $a > 0$)

| Form | Equivalent rule | Example |
| --- | --- | --- |
| $|u| = a$ | $u = a$ **or** $u = -a$ | $|x - 2| = 5 \implies x = 7$ or $x = -3$ |
| $|u| = -3$ | **No solution** ($\emptyset$) | Distance cannot be negative |
| $|u| < a$ | $-a < u < a$ ("sandwiched") | $|x - 1| < 4 \implies -4 < x - 1 < 4 \implies (-3, 5)$ |
| $|u| > a$ | $u > a$ **or** $u < -a$ ("outside") | $|x| \ge 3 \implies x \le -3$ or $x \ge 3$ |

## Try it

Practice absolute value equations and inequalities:

@widget mathdrill topic=absolute

## Common mistakes

- Thinking $|x - 5| = x + 5$. Absolute value does NOT flip subtraction to addition—it makes the **whole result** non-negative.
- Forgetting that $|u| = \text{negative}$ has **no solution** ($\emptyset$).
- Writing $-3 > x > 5$ for $|x| > 3$ instead of two separate regions ($x < -3$ **or** $x > 3$).

## Key terms

- absolute value | the non-negative distance of a number from zero ($|x|$) | mutlak değer
- distance | $|a - b|$, the non-negative gap between $a$ and $b$ on the number line | uzaklık

## Quick check

? Find the sum of the solutions to $|2x - 4| = 6$:
- $2$ ~~ $x = 5$ and $x = -1$ sum to $4$
* $4$ ~~ $2x - 4 = 6 \implies x = 5$; $2x - 4 = -6 \implies x = -1$; sum $= 5 + (-1) = 4$
- $6$ ~~ added $5 + 1$
- $0$ ~~ forgot the $-4$ shift
! Solve both cases: $x = 5$ and $x = -1$, so $5 + (-1) = 4$.

? How many **integer** values of $x$ satisfy $|x - 2| \le 3$?
- 5 ~~ missed endpoints or counted wrong
- 6 ~~ $-1, 0, 1, 2, 3, 4, 5$ is 7 integers
* 7 ~~ $-3 \le x - 2 \le 3 \implies -1 \le x \le 5$, which has $5 - (-1) + 1 = 7$ integers
- 3 ~~ only checked positive $x$
! $-1 \le x \le 5$ gives integers $\{-1, 0, 1, 2, 3, 4, 5\}$ — 7 integers.

? Simplify $|2 - \sqrt{7}| + |3 - \sqrt{7}|$:
- $5 - 2\sqrt{7}$ ~~ $2 - \sqrt{7} < 0$, so its absolute value is $\sqrt{7} - 2$
* $1$ ~~ $(\sqrt{7} - 2) + (3 - \sqrt{7}) = 1$
- $5$ ~~ $\sqrt{7}$ cancels out!
- $2\sqrt{7} - 1$ ~~ $3 > \sqrt{7}$, so $|3 - \sqrt{7}| = 3 - \sqrt{7}$
! Since $2 < \sqrt{7} < 3$, we get $(\sqrt{7} - 2) + (3 - \sqrt{7}) = 1$.
