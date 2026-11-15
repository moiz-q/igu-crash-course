---
id: math-05
title: Primes, prime factorization, GCD, and LCM
goal: factor integers into primes, count positive divisors, and compute GCD and LCM
week: 4
minutes: 18
---

Prime numbers are the building blocks of all integers—and **GCD** and **LCM** show up in fraction arithmetic, scheduling problems, and cryptography.


@widget viz name=math-gcd

## Prime numbers and factorization

A **prime number** is an integer $> 1$ with only two positive divisors: $1$ and itself (`2, 3, 5, 7, 11, 13, 17, 19...`).
- **`1` is NOT prime.**
- **`2` is the only even prime.**

**Prime factorization** of $72$:
$$72 = 8 \times 9 = 2^3 \cdot 3^2$$

**Number of positive divisors**: Add $1$ to each exponent and multiply!
For $72 = 2^3 \cdot 3^2$: $(3 + 1)(2 + 1) = 4 \times 3 = \mathbf{12}$ positive divisors.

## GCD (EBOB) and LCM (EKOK)

Suppose $A = 2^3 \cdot 3^2 \cdot 5^1 = 360$ and $B = 2^2 \cdot 3^3 = 108$:

- **GCD / EBOB** (Greatest Common Divisor): take **common** primes with the **smallest** exponent:
  $$\gcd(360, 108) = 2^2 \cdot 3^2 = 4 \times 9 = \mathbf{36}$$
- **LCM / EKOK** (Least Common Multiple): take **all** primes appearing in either number with the **largest** exponent:
  $$\operatorname{lcm}(360, 108) = 2^3 \cdot 3^3 \cdot 5^1 = 8 \times 27 \times 5 = \mathbf{1080}$$

**Golden identity** for any two positive integers $A$ and $B$:
$$\gcd(A, B) \times \operatorname{lcm}(A, B) = A \times B$$

## Factorials and trailing zeros

$n! = n \cdot (n-1) \cdots 2 \cdot 1$, and $0! = 1$. For example $5! = 120$. Useful trick: $\frac{7!}{5!} = 7 \cdot 6 = 42$ — cancel the common part.

**How many zeros at the end of $n!$?** Each final zero comes from a factor $10 = 2 \cdot 5$. There are always more 2s than 5s, so count the 5s:

$$\text{zeros} = \left\lfloor \frac{n}{5} \right\rfloor + \left\lfloor \frac{n}{25} \right\rfloor + \left\lfloor \frac{n}{125} \right\rfloor + \cdots$$

*Example:* $100!$ → $20 + 4 = 24$ trailing zeros.

## GCD by the Euclidean algorithm

For big numbers, factorizing is slow. Euclid's method: divide the larger number by the smaller, then divide the divisor by the remainder, and repeat until the remainder is 0. The **last non-zero remainder** is the GCD.

*Example:* GCD(252, 198): $252 = 1 \cdot 198 + 54$, $198 = 3 \cdot 54 + 36$, $54 = 1 \cdot 36 + 18$, $36 = 2 \cdot 18 + 0$. GCD = **18**. Then $\text{LCM} = \frac{252 \cdot 198}{18} = 2772$, because $\text{GCD} \cdot \text{LCM} = a \cdot b$.

## Try it

Practice primes, divisor counts, GCD, and LCM:

@widget mathdrill topic=primes

@widget mathdrill topic=gcdlcm

## Common mistakes

- Treating `1` as a prime number. By definition, primes must have **exactly two** distinct positive divisors (`1` only has one).
- Mixing up **GCD** (uses **minimum** exponents of common primes) and **LCM** (uses **maximum** exponents of all primes).
- Forgetting to include primes that appear in only one number when computing **LCM** (like $5^1$ above).

## Key terms

- prime number | an integer greater than 1 whose only positive divisors are 1 and itself | asal sayı
- GCD (EBOB) | Greatest Common Divisor — largest integer dividing both numbers | en büyük ortak bölen (EBOB)
- LCM (EKOK) | Least Common Multiple — smallest positive multiple of both numbers | en küçük ortak kat (EKOK)

## Quick check

? How many **positive divisors** does $60 = 2^2 \cdot 3^1 \cdot 5^1$ have?
- 6 ~~ multiplied exponents $2 \cdot 1 \cdot 1$ instead of adding 1
- 8 ~~ missed one factor
* 12 ~~ $(2+1)(1+1)(1+1) = 3 \times 2 \times 2 = 12$
- 15 ~~ incorrect
! Add 1 to each prime exponent and multiply: $3 \cdot 2 \cdot 2 = 12$.

? What are $\gcd(24, 36)$ and $\operatorname{lcm}(24, 36)$?
- GCD = 6, LCM = 144 ~~ 12 also divides both 24 and 36
* GCD = 12, LCM = 72 ~~ $24 = 2^3 \cdot 3$, $36 = 2^2 \cdot 3^2$ → GCD $= 2^2\cdot 3 = 12$, LCM $= 2^3 \cdot 3^2 = 72$
- GCD = 12, LCM = 144 ~~ 72 is smaller than 144 and divisible by both
- GCD = 4, LCM = 72 ~~ 12 is larger than 4
! $\gcd(24,36) = 12$ and $\operatorname{lcm}(24,36) = 72$ (check: $12 \times 72 = 864 = 24 \times 36$).

? Two buses leave a station together at 08:00. Bus A returns every 15 minutes and Bus B every 20 minutes. When do they next leave together?
- 08:35 ~~ 35 is not a multiple of 15 or 20
- 08:45 ~~ 45 is not a multiple of 20
* 09:00 ~~ $\operatorname{lcm}(15, 20) = 60$ minutes after 08:00
- 09:20 ~~ 80 minutes is not a multiple of 15
! $\operatorname{lcm}(15, 20) = 60$ minutes, so 08:00 + 60 min = 09:00.
