---
id: math-03
title: Place value, digits, and divisibility rules
goal: expand multi-digit numbers using place value and apply divisibility rules for 2, 3, 4, 5, 8, 9, 10, and 11
week: 3
minutes: 18
---

Two classic Turkish university math topics are **digit/place-value puzzles** (basamak kavramı) and **divisibility rules** (bölünebilme kuralları).

## Place value (Basamak kavramı)

A two-digit number $\overline{ab}$ means $10a + b$ (with $a \in \{1..9\}$, $b \in \{0..9\}$). A three-digit number $\overline{abc}$ means $100a + 10b + c$.

**Example**: If $\overline{ab} + \overline{ba} = 99$, what is $a + b$?
$$(10a + b) + (10b + a) = 11a + 11b = 11(a + b) = 99 \implies a + b = 9$$

## Divisibility rules (with remainders!)

| Divisor | Rule |
| --- | --- |
| **2** | Last digit is even (`0, 2, 4, 6, 8`) |
| **3** | **Sum of digits** is divisible by 3 (and remainder mod 3 equals digit-sum mod 3!) |
| **4** | **Last 2 digits** form a number divisible by 4 |
| **5** | Last digit is `0` or `5` |
| **8** | **Last 3 digits** form a number divisible by 8 |
| **9** | **Sum of digits** is divisible by 9 |
| **10** | Last digit is `0` |
| **11** | Alternating sum from right (`+ - + - ...`) is divisible by 11 |

**Combined rules**: Divisible by **6** = divisible by 2 **and** 3. Divisible by **12** = 3 **and** 4. Divisible by **15** = 3 **and** 5. (Always split into **coprime** factors!)

**Example**: Find $a$ if the 4-digit number $354a$ is divisible by **6**.
- Divisible by 2 → $a \in \{0, 2, 4, 6, 8\}$.
- Divisible by 3 → $3 + 5 + 4 + a = 12 + a$ is a multiple of 3 → $a \in \{0, 3, 6, 9\}$.
- Both true → $a \in \{0, 6\}$.

## Try it

Practice divisibility and remainder problems below:

@widget mathdrill topic=divisibility

## Common mistakes

- Checking divisibility by **12** using 2 and 6 instead of **3 and 4**. You must pick **coprime** factors ($\gcd(3,4)=1$); for example, $18$ is divisible by 2 and 6, yet NOT divisible by 12!
- Thinking $\overline{ab}$ means $a \times b$ in digit problems. $\overline{ab}$ with a bar/digits means $10a + b$.
- Forgetting that the leading digit $a$ of a multi-digit number $\overline{abc}$ cannot be $0$.

## Key terms

- place value | the value of a digit based on its position ($1, 10, 100, \dots$) | basamak değeri
- divisibility | when one integer divides another with remainder 0 | bölünebilme
- coprime | two integers whose greatest common divisor is 1 | aralarında asal

## Quick check

? What is the remainder when `4527` is divided by **9**?
* 0 ~~ $4+5+2+7 = 18$, and $18$ is divisible by $9$, so the remainder is 0
- 2 ~~ sum of digits is 18, not 20
- 4 ~~ sum of digits is 18, not 22
- 7 ~~ 7 is only the units digit (that applies to mod 10, not mod 9)
! For divisibility by 9, the remainder equals the digit sum mod 9: $4+5+2+7 = 18 \equiv 0 \pmod 9$.

? Which digit $a$ makes the 4-digit number `243a` divisible by **4**?
- 0 ~~ `30` is not divisible by 4
* 2 ~~ `32` is divisible by 4 ($4 \times 8 = 32$)
- 4 ~~ `34` is not divisible by 4
- 8 ~~ `38` is not divisible by 4
! A number is divisible by 4 if its last two digits (`3a`) are divisible by 4 (`32` and `36`).

? If $\overline{ab} - \overline{ba} = 36$, what is $a - b$?
- 3 ~~ $9(a-b) = 36 \implies a - b = 4$
* 4 ~~ $(10a+b) - (10b+a) = 9(a-b) = 36 \implies a - b = 4$
- 6 ~~ $9 \times 6 = 54 \ne 36$
- 9 ~~ $9 \times 9 = 81 \ne 36$
! $\overline{ab} - \overline{ba} = 9(a - b)$, so $36 \div 9 = 4$.
