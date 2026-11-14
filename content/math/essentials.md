---
title: Mathematics I — the essentials
minutes: 25
intro: numbers, divisibility, exponents and roots, factoring, equations, percentages
---

This is **high-school basic maths, not calculus**. The exam is multiple choice, so what matters is knowing the few rules that unlock each question type. Six ideas cover most of it.

:::idea Kinds of numbers and divisibility
$\mathbb{N}$ natural (0, 1, 2…) ⊂ $\mathbb{Z}$ integers (… −1, 0, 1 …) ⊂ $\mathbb{Q}$ fractions ⊂ $\mathbb{R}$ real numbers. Numbers like $\sqrt{2}$ and $\pi$ are **irrational**.

Quick divisibility tests: **2** last digit even · **3** digit sum divisible by 3 · **4** last two digits · **5** ends in 0 or 5 · **9** digit sum divisible by 9 · **10** ends in 0.

Example: 4,512 → digit sum 12 → divisible by 3, not by 9.

[Go deeper: divisibility](#/lesson/math-03)
:::

:::idea GCD and LCM
Break numbers into **prime factors**. $12 = 2^2 \cdot 3$, $18 = 2 \cdot 3^2$.

- **GCD** (EBOB) = common primes, **smallest** powers: $2 \cdot 3 = 6$.
- **LCM** (EKOK) = all primes, **largest** powers: $2^2 \cdot 3^2 = 36$.

GCD questions sound like "cut into **equal pieces**, as **large** as possible". LCM questions sound like "when do they **meet again**?"

[Go deeper: GCD and LCM](#/lesson/math-05)
:::

:::idea Exponents and roots
| Rule | Example |
| --- | --- |
| $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^4 = 2^7$ |
| $a^m / a^n = a^{m-n}$ | $5^6 / 5^4 = 5^2$ |
| $(a^m)^n = a^{mn}$ | $(3^2)^3 = 3^6$ |
| $a^0 = 1$, $a^{-n} = \frac{1}{a^n}$ | $2^{-3} = \frac{1}{8}$ |
| $\sqrt{a \cdot b} = \sqrt{a}\sqrt{b}$ | $\sqrt{50} = 5\sqrt{2}$ |

Same base → add/subtract the exponents. To solve $2^{x} = 32$, write $32 = 2^5$, so $x = 5$.

[Go deeper: exponents](#/lesson/math-06) · [radicals](#/lesson/math-07)
:::

:::idea Factoring: three patterns
- **Take out what's common:** $6x + 9 = 3(2x + 3)$
- **Difference of squares:** $a^2 - b^2 = (a-b)(a+b)$ → $x^2 - 25 = (x-5)(x+5)$
- **Trinomial:** find two numbers that **multiply** to $c$ and **add** to $b$: $x^2 + 5x + 6 = (x+2)(x+3)$

Factoring is the key to simplifying fractions and solving quadratics.

[Go deeper: factoring](#/lesson/math-08)
:::

:::idea Solving equations and inequalities
- **Linear:** do the same thing to both sides. $3x + 4 = 19 \Rightarrow 3x = 15 \Rightarrow x = 5$.
- **Quadratic** $ax^2 + bx + c = 0$: factor, or use $x = \frac{-b \pm \sqrt{\Delta}}{2a}$ with $\Delta = b^2 - 4ac$. $\Delta > 0$ two roots, $= 0$ one, $< 0$ none. Sum of roots $= -b/a$, product $= c/a$.
- **Inequalities:** like equations, **but multiplying or dividing by a negative flips the sign**: $-2x > 6 \Rightarrow x < -3$.
- **Absolute value** = distance from 0: $|x - 3| = 5 \Rightarrow x = 8$ or $x = -2$.

[Go deeper: quadratics](#/lesson/math-10) · [inequalities](#/lesson/math-11) · [absolute value](#/lesson/math-12)
:::

:::idea Ratio and percentages
- **Percent of:** 20% of 150 = $150 \cdot 0.20 = 30$.
- **Increase / decrease by p%:** multiply by $(1 + p/100)$ or $(1 - p/100)$. 200 TL + 15% = $200 \cdot 1.15 = 230$ TL.
- **Profit %** is always calculated on the **cost** price.
- **Direct proportion:** more → more (price of 3 books vs 6 books). **Inverse:** more → less (more workers → fewer days; workers × days stays the same).

[Go deeper: ratio and percentages](#/lesson/math-13)
:::

:::remember If you remember only this
- Divisibility by 3 and 9: add the digits.
- GCD = smallest powers (equal pieces); LCM = largest powers (meeting again).
- Same base: multiply → add exponents. $a^0 = 1$, negative exponent = fraction.
- $a^2 - b^2 = (a-b)(a+b)$; $\Delta = b^2 - 4ac$.
- Multiply/divide an inequality by a negative → flip the sign.
:::

Practise with the [random question generator](#/tool/math-mixed) — it never runs out and shows every step.

## Quick check

? Which number is divisible by 9?
- 1,234 ~~ digit sum 10
* 4,527 ~~ digit sum 18
- 5,000 ~~ digit sum 5
- 7,771 ~~ digit sum 22
! Digit sum divisible by 9 → number divisible by 9.

? What is the LCM of 4 and 6?
- 2 ~~ that's the GCD
- 24 ~~ a common multiple, but not the smallest
* 12 ~~ $2^2 \cdot 3$
- 10 ~~ not a multiple of 4
! LCM = smallest number both divide into.

? Simplify $3^5 \cdot 3^{-2}$.
- $3^{-10}$ ~~ multiply → add the exponents, don't multiply them
* $27$ ~~ $3^{5-2} = 3^3$
- $9$ ~~ that's $3^2$
- $3^7$ ~~ $5 + (-2) = 3$
! Add exponents when multiplying the same base.

? Factor $x^2 - 7x + 10$.
* $(x-2)(x-5)$ ~~ $-2 \cdot -5 = 10$ and $-2 + (-5) = -7$
- $(x+2)(x+5)$ ~~ the sum would be +7
- $(x-1)(x-10)$ ~~ the sum would be −11
- $(x-2)(x+5)$ ~~ the product would be −10
! Product $c$, sum $b$.

? Solve $-3x + 1 > 7$.
- $x > -2$ ~~ the sign must flip when dividing by −3
* $x < -2$ ~~ $-3x > 6$, divide by −3 and flip
- $x > 2$ ~~ wrong sign and value
- $x < 2$ ~~ wrong value
! Dividing by a negative flips the inequality.
