---
id: bridge-08
title: Preview: Logarithms (Math II)
goal: convert between exponential and logarithmic form and apply the basic logarithm rules
week: 8
minutes: 20
---

A **logarithm** answers one question: *"What power must I raise the base to, to get this number?"* It is the inverse of an exponential function.

## Definition

For $a > 0$, $a \neq 1$, and $x > 0$:
$$\log_a(x) = y \iff a^y = x$$

Examples:
- $\log_2(8) = 3$ because $2^3 = 8$.
- $\log_{10}(100) = 2$ because $10^2 = 100$. (Base 10 is often written simply as $\log x$.)
- $\log_5(1) = 0$ because $5^0 = 1$.
- $\log_3\left(\frac{1}{9}\right) = -2$ because $3^{-2} = \frac{1}{9}$.

## The 4 key logarithm rules

1. **Product rule:** $\log_a(x \cdot y) = \log_a x + \log_a y$
2. **Quotient rule:** $\log_a\left(\frac{x}{y}\right) = \log_a x - \log_a y$
3. **Power rule:** $\log_a(x^k) = k \cdot \log_a x$
4. **Change of base:** $\log_a b = \frac{\log_c b}{\log_c a}$ (especially $\log_a b = \frac{1}{\log_b a}$)

**Worked example:** Simplify $\log_2(12) + \log_2(4) - \log_2(6)$.
- Combine using product and quotient rules: $\log_2\left(\frac{12 \cdot 4}{6}\right) = \log_2(8) = 3$.

## Try it

Solve these, then reveal the solutions:

1. Evaluate $\log_3(81) + \log_2\left(\frac{1}{8}\right)$.
:::reveal Show answer
$3^4 = 81 \implies \log_3(81) = 4$. And $2^{-3} = \frac{1}{8} \implies \log_2\left(\frac{1}{8}\right) = -3$.
Total: $4 + (-3) = 1$.
:::

2. Solve for $x$: $\log_2(x - 1) = 4$.
:::reveal Show answer
Rewrite in exponential form: $x - 1 = 2^4 = 16 \implies x = 17$. (Check: $17 - 1 = 16 > 0$, valid!)
:::

## Common mistakes
- Thinking $\log_a(x + y) = \log_a x + \log_a y$ — addition inside a log does **not** split! Only multiplication inside splits into addition outside.
- Forgetting that the argument of a logarithm must be strictly positive ($x > 0$); always check solutions to log equations.
- Confusing $\log_a(1) = 0$ with $\log_a(a) = 1$.

## Key terms
- logarithm | the exponent needed to reach a number from a given base | logaritma
- base | the number $a$ being raised to a power in $\log_a(x)$ | taban
- natural logarithm | $\ln(x) = \log_e(x)$ where $e \approx 2.718$ | doğal logaritma

## Quick check
? What is $\log_4(64)$?
- $2$ ~~ $4^2 = 16$, not $64$.
* $3$ ~~ $4^3 = 64$, so $\log_4(64) = 3$.
- $4$ ~~ $4^4 = 256$.
- $16$ ~~ $64 / 4 = 16$, not the exponent.
! Ask: 4 to what power equals 64? $4^3 = 64$, so the answer is 3.

? Which expression equals $\log_5(25x^3)$?
* $2 + 3\log_5(x)$ ~~ $\log_5(25) + \log_5(x^3) = 2 + 3\log_5(x)$.
- $2 \cdot 3\log_5(x)$ ~~ Product inside a log becomes addition, not multiplication.
- $5 + 3\log_5(x)$ ~~ $\log_5(25) = 2$, not $5$.
- $25 + 3\log_5(x)$ ~~ $\log_5(25) = 2$, not $25$.
! Split the product into a sum, evaluate $\log_5(25) = 2$, and bring the exponent 3 to the front.

? Solve for $x$: $\log_3(x) = -2$.
- $-6$ ~~ A logarithm is an exponent, not multiplication.
- $-9$ ~~ $3^{-2}$ is positive, not negative.
* $\frac{1}{9}$ ~~ $x = 3^{-2} = \frac{1}{3^2} = \frac{1}{9}$.
- $9$ ~~ $3^2 = 9$, whereas the exponent here is $-2$.
! Convert to exponential form: $x = 3^{-2} = \frac{1}{9}$.
