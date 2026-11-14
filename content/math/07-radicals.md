---
id: math-07
title: Radicals and rationalizing denominators
goal: simplify radical expressions, convert between radicals and fractional exponents, and rationalize denominators
week: 6
minutes: 18
---

A **radical** $\sqrt[n]{a}$ is the inverse of raising to the $n$-th power. Every radical can also be written as a **fractional exponent**:
$$\sqrt[n]{a^m} = a^{m/n} \quad (\text{e.g., } \sqrt{x} = x^{1/2},\; \sqrt[3]{8} = 8^{1/3} = 2)$$

## Core radical rules (for $a, b \ge 0$)

- **Simplify**: pull out perfect squares: $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$.
- **Add / Subtract**: only combine **like radicals**: $3\sqrt{2} + 5\sqrt{2} = 8\sqrt{2}$ (never $\sqrt{2} + \sqrt{3} = \sqrt{5}$!).
- **Multiply / Divide**: $\sqrt{a} \cdot \sqrt{b} = \sqrt{ab}$ and $\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}}$.
- **Even-root rule**: $\sqrt{x^2} = |x|$ (always non-negative!). For example, $\sqrt{(-5)^2} = \sqrt{25} = 5 = |-5|$.

## Rationalizing denominators

Multiply top and bottom by the radical (or its **conjugate**):
- Single radical: $\frac{6}{\sqrt{3}} = \frac{6\sqrt{3}}{3} = 2\sqrt{3}$.
- Binomial denominator (conjugate of $\sqrt{a} + \sqrt{b}$ is $\sqrt{a} - \sqrt{b}$):
  $$\frac{4}{\sqrt{5} - \sqrt{3}} \cdot \frac{\sqrt{5} + \sqrt{3}}{\sqrt{5} + \sqrt{3}} = \frac{4(\sqrt{5} + \sqrt{3})}{5 - 3} = 2(\sqrt{5} + \sqrt{3})$$

## Try it

Practice simplifying and rationalizing radicals:

@widget mathdrill topic=radicals

## Common mistakes

- Writing $\sqrt{a + b} = \sqrt{a} + \sqrt{b}$. Check with $a=9, b=16$: $\sqrt{9+16} = \sqrt{25} = 5$, NOT $3 + 4 = 7$!
- Writing $\sqrt{(-4)^2} = -4$. The principal square root $\sqrt{\cdot}$ is always $\ge 0$, so $\sqrt{(-4)^2} = |-4| = 4$.
- Forgetting to multiply the numerator too when rationalizing a denominator.

## Key terms

- radical | an expression containing a root symbol $\sqrt[n]{\phantom{x}}$ | köklü ifade
- principal root | the non-negative even root of a positive number | asal kök
- conjugate | changing the sign between two terms ($\sqrt{a} + \sqrt{b}$ ↔ $\sqrt{a} - \sqrt{b}$) | eşlenik

## Quick check

? Simplify $\sqrt{50} + \sqrt{18} - \sqrt{8}$:
- $\sqrt{60}$ ~~ cannot add numbers inside different square roots
* $6\sqrt{2}$ ~~ $5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2} = 6\sqrt{2}$
- $8\sqrt{2}$ ~~ forgot to subtract $\sqrt{8} = 2\sqrt{2}$
- $10\sqrt{2}$ ~~ $5+3+2 = 10$ added instead of subtracting
! Factor out perfect squares: $5\sqrt{2} + 3\sqrt{2} - 2\sqrt{2} = 6\sqrt{2}$.

? Rationalize $\frac{10}{\sqrt{5}}$:
- $\sqrt{5}$ ~~ $10/5 = 2$, not $1$
* $2\sqrt{5}$ ~~ $\frac{10\sqrt{5}}{5} = 2\sqrt{5}$
- $5\sqrt{5}$ ~~ divided wrong
- $10\sqrt{5}$ ~~ forgot to divide by 5
! Multiply numerator and denominator by $\sqrt{5}$: $\frac{10\sqrt{5}}{5} = 2\sqrt{5}$.

? What is $\sqrt{(-3)^2} + \sqrt[3]{-8}$?
- $-5$ ~~ $\sqrt{(-3)^2} = +3$, not $-3$
* $1$ ~~ $|-3| + (-2) = 3 - 2 = 1$
- $5$ ~~ $\sqrt[3]{-8} = -2$, not $+2$
- $-1$ ~~ $3 + (-2) = +1$
! Even roots give $|{-3}| = 3$; odd roots keep the sign: $\sqrt[3]{-8} = -2$, so $3 + (-2) = 1$.
