---
id: math-06
title: Exponents and exponential equations
goal: simplify expressions using the laws of exponents and solve basic exponential equations
week: 5
minutes: 18
---

Exponents express repeated multiplication compactly: $a^n = \underbrace{a \cdot a \cdots a}_{n \text{ times}}$.

## Core laws of exponents ($a \ne 0$)

| Rule | Formula | Example |
| --- | --- | --- |
| **Product (same base)** | $a^m \cdot a^n = a^{m+n}$ | $2^3 \cdot 2^4 = 2^7 = 128$ |
| **Quotient (same base)** | $\frac{a^m}{a^n} = a^{m-n}$ | $\frac{5^6}{5^2} = 5^4 = 625$ |
| **Power of a power** | $(a^m)^n = a^{m \cdot n}$ | $(2^3)^2 = 2^6 = 64$ |
| **Zero exponent** | $a^0 = 1$ ($a \ne 0$) | $7^0 = 1$ |
| **Negative exponent** | $a^{-n} = \frac{1}{a^n}$ | $2^{-3} = \frac{1}{8}$, $(\frac{2}{3})^{-2} = (\frac{3}{2})^2 = \frac{9}{4}$ |
| **Same exponent** | $a^n \cdot b^n = (ab)^n$ | $2^5 \cdot 5^5 = 10^5$ |

## Solving exponential equations

Rewrite both sides with the **same base** ($a^x = a^y \implies x = y$ for $a > 0, a \ne 1$):
$$4^{x+1} = 8^x \implies (2^2)^{x+1} = (2^3)^x \implies 2^{2x+2} = 2^{3x} \implies 2x + 2 = 3x \implies x = 2$$

## Try it

Practice exponent laws and equations with the drill:

@widget mathdrill topic=exponents

## Common mistakes

- Thinking $2^{-3}$ is negative ($-8$). A negative exponent means **reciprocal** ($\frac{1}{2^3} = \frac{1}{8}$), NOT a negative number!
- Confusing $-3^2 = -(3^2) = -9$ with $(-3)^2 = (-3)(-3) = +9$.
- Adding exponents when adding terms: $2^3 + 2^3 = 2 \cdot 2^3 = 2^4$, **never** $2^6$!

## Key terms

- base | the number being multiplied repeatedly in $a^n$ | taban
- exponent (power) | $n$ in $a^n$, telling how many times the base is multiplied | üs (kuvvet)
- reciprocal | flipping a fraction/number ($a^{-1} = 1/a$) | tersi

## Quick check

? Simplify $\frac{2^5 \cdot 4^2}{8^2}$:
- $2$ ~~ $2^5 \cdot 2^4 / 2^6 = 2^3$, not $2^1$
- $4$ ~~ $2^2 = 4$
* $8$ ~~ $2^5 \cdot (2^2)^2 / (2^3)^2 = 2^5 \cdot 2^4 / 2^6 = 2^{9-6} = 2^3 = 8$
- $16$ ~~ $2^4 = 16$
! Convert 4 and 8 to base 2: $\frac{2^5 \cdot 2^4}{2^6} = 2^3 = 8$.

? What is $(\frac{3}{2})^{-2}$?
- $-\frac{9}{4}$ ~~ negative exponent flips the fraction; it does not make it negative
- $\frac{9}{4}$ ~~ flipped? Wait: $(\frac{3}{2})^{-2} = (\frac{2}{3})^2 = \frac{4}{9}$!
* $\frac{4}{9}$ ~~ flip $\frac{3}{2}$ to $\frac{2}{3}$, then square: $\frac{4}{9}$
- $-\frac{4}{9}$ ~~ positive base stays positive
! A negative exponent inverts the fraction: $(\frac{3}{2})^{-2} = (\frac{2}{3})^2 = \frac{4}{9}$.

? Solve $9^{x-1} = 27^2$:
- $x = 3$ ~~ $3^{2x-2} = 3^6 \implies 2x = 8 \implies x = 4$
* $x = 4$ ~~ $(3^2)^{x-1} = (3^3)^2 \implies 2x - 2 = 6 \implies x = 4$
- $x = 5$ ~~ $2(5)-2 = 8 \ne 6$
- $x = 2$ ~~ $2(2)-2 = 2 \ne 6$
! Express both sides in base 3: $2x - 2 = 6 \implies x = 4$.
