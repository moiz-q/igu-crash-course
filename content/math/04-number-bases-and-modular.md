---
id: math-04
title: Number bases and modular arithmetic
goal: convert integers between base 10 and other bases (2, 8, 16) and compute remainders in modular arithmetic
week: 3
minutes: 18
---

In Computer Programming, you constantly use **base 2 (binary)**, **base 8 (octal)**, **base 16 (hex)**, and the `%` (**modulo**) operator. Here is the math behind them.

## Number bases (Taban aritmetiği)

In **base $b$**, digits range from `0` to `b - 1`, and places are powers of $b$ ($b^0, b^1, b^2, \dots$).

### Base $b$ → Base 10 (expand by powers of $b$)
$$(231)_4 = 2 \cdot 4^2 + 3 \cdot 4^1 + 1 \cdot 4^0 = 32 + 12 + 1 = 45_{10}$$

### Base 10 → Base $b$ (repeated division, read remainders bottom-up!)
Convert $25_{10}$ to base 2:
- $25 \div 2 = 12$ R **`1`**
- $12 \div 2 = 6$ R **`0`**
- $6 \div 2 = 3$ R **`0`**
- $3 \div 2 = 1$ R **`1`**
- $1 \div 2 = 0$ R **`1`**
Read remainders bottom-up: $(11001)_2$.

## Modular arithmetic ($\bmod n$)

$a \equiv r \pmod n$ means $a$ and $r$ leave the **same remainder** when divided by $n$ ($n > 1$).
- Example: $17 \equiv 2 \pmod 5$ because $17 = 3 \times 5 + 2$.
- **Clock / cycle problems**: What day is 100 days after Monday? $100 \div 7 = 14$ R **2** → 2 days after Monday = **Wednesday**.
- **Shortcut for large powers**: Reduce the base mod $n$ first, or find the repeating cycle!
  - Find $2^{10} \pmod 7$: $2^3 = 8 \equiv 1 \pmod 7$. So $2^{10} = (2^3)^3 \cdot 2^1 \equiv 1^3 \cdot 2 = 2 \pmod 7$.

## Try it

Practice both number bases and modular arithmetic:

@widget mathdrill topic=bases

@widget mathdrill topic=modular

## Common mistakes

- Reading the division remainders **top-down** instead of **bottom-up** when converting from base 10 to base $b$.
- Writing a digit $\ge b$ inside a base-$b$ number (for example, `(142)_4` is invalid because base 4 only allows digits `0, 1, 2, 3`).
- Forgetting that remainders in modular arithmetic are always chosen in $0 \le r < n$.

## Key terms

- base (radix) | the number of unique digits in a positional number system (e.g., 2, 10, 16) | sayı tabanı
- modulo ($\bmod$) | operation giving the remainder after integer division | modüler aritmetik (mod)
- congruent ($a \equiv b \pmod n$) | having the same remainder when divided by $n$ | denktir

## Quick check

? Convert $(10110)_2$ to base 10:
- 18 ~~ $16 + 2 = 18$ (missed the $4$ bit)
* 22 ~~ $1\cdot 16 + 0\cdot 8 + 1\cdot 4 + 1\cdot 2 + 0\cdot 1 = 22$
- 24 ~~ $16 + 8$
- 26 ~~ $16 + 8 + 2$
! $(10110)_2 = 16 + 4 + 2 = 22$.

? What is $(34)_{5}$ in base 10?
- 14 ~~ $3 \cdot 5 + 4 = 19$, not 14
* 19 ~~ $3 \cdot 5^1 + 4 \cdot 5^0 = 15 + 4 = 19$
- 24 ~~ $4 \cdot 5 + 4$
- 34 ~~ that would be base 10
! $(34)_5 = 3 \times 5 + 4 = 19$.

? What is $3^{100} \pmod 4$?
- 0 ~~ 3 and 4 are coprime, so remainder is never 0
* 1 ~~ $3 \equiv -1 \pmod 4$, and $(-1)^{100} = 1$
- 2 ~~ powers of 3 are odd, never $\equiv 2 \pmod 4$
- 3 ~~ $3^1 \equiv 3$, $3^2 = 9 \equiv 1$; even exponent gives 1
! Since $3 \equiv -1 \pmod 4$, any even power $3^{100} \equiv (-1)^{100} = 1 \pmod 4$.
