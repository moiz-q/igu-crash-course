---
id: c-10
title: Decision and loop practice: patterns and number problems
goal: write nested-loop star patterns, number algorithms (prime, digit sum, reverse, Fibonacci, GCD) and switch-in-loop menus
week: 10
minutes: 25
---

Week 10 puts `if`, `switch` and loops together on the classic problems every C course tests in labs and written exams.

## 1. Star patterns (nested loops)

The **outer** loop controls the **rows**; the **inner** loop controls **how many `*`s** on that row.

```c run
#include <stdio.h>

int main() {
    int n = 4;
    for (int row = 1; row <= n; row++) {
        for (int col = 1; col <= row; col++) {
            printf("*");
        }
        printf("\n");
    }
    return 0;
}
```

## 2. Digit problems (`% 10` and `/ 10`)

To peel off digits of an integer `n` from right to left:
- `n % 10` gives the **last digit**.
- `n /= 10` removes the **last digit**.

```c run stdin="4729"
#include <stdio.h>

int main() {
    int n, sum = 0, rev = 0;
    scanf("%d", &n);
    while (n > 0) {
        int d = n % 10;
        sum += d;
        rev = rev * 10 + d;
        n /= 10;
    }
    printf("Digit sum = %d, Reverse = %d\n", sum, rev);
    return 0;
}
```

## 3. Prime check, Fibonacci and GCD

- **Prime check:** A number `n >= 2` is prime if no integer `d` from `2` to `n - 1` (or `d * d <= n`) divides `n` evenly (`n % d == 0`).
- **Fibonacci:** `0, 1, 1, 2, 3, 5, 8, ...` — each term is the sum of the previous two (`next = a + b; a = b; b = next;`).
- **GCD (Euclidean algorithm):** Repeat `r = a % b; a = b; b = r;` until `b == 0`; then `a` is the GCD!

## 4. Menu-driven program (`switch` inside `do-while`)

```c run stdin="1 2 0"
#include <stdio.h>

int main() {
    int choice;
    do {
        scanf("%d", &choice);
        switch (choice) {
            case 1: printf("Hello!\n"); break;
            case 2: printf("2 + 2 = 4\n"); break;
            case 0: printf("Bye!\n"); break;
            default: printf("Invalid\n");
        }
    } while (choice != 0);
    return 0;
}
```

## Try it

Solve the pattern and number exercises below.

@widget exercises lesson=c-10

## Common mistakes
- In prime checking, printing `"Prime"` inside the `for` loop on the first non-divisor instead of waiting until the loop finishes (use a `int isPrime = 1;` flag and set `isPrime = 0; break;` if a divisor is found).
- Forgetting `printf("\n");` at the end of each outer-loop row in a star pattern.
- Treating `1` as a prime number (`1` is **not** prime; primes start at `2`).

## Key terms
- nested loop | a loop placed inside the body of another loop | iç içe döngü
- flag variable | an `int` (`0` or `1`) tracking whether a condition was met | bayrak değişkeni
- Euclidean algorithm | fast repeated-remainder method to find the GCD of two numbers | Öklid algoritması

## Quick check
? How do you get the **last digit** of a positive integer `n` in C?
- `n / 10` ~~ `n / 10` removes the last digit and keeps the rest.
* `n % 10` ~~ Remainder upon dividing by 10 is the ones digit.
- `n * 10` ~~ Shifts digits left.
- `n - 10` ~~ Just subtracts 10.
! Use `n % 10` to read the last digit and `n /= 10` to drop it.

? In a prime-number checker for `n`, why is `1` NOT prime?
- Because `1` is odd ~~ `3, 5, 7` are odd and prime.
* By definition, a prime number has **exactly two** positive divisors (`1` and itself), so `n` must be `>= 2` ~~ `1` has only one divisor.
- Because `1 % 2 == 1` ~~ Oddness doesn't disqualify primes.
- Because C cannot divide by 1 ~~ C divides by 1 fine.
! Always check `if (n < 2) isPrime = 0;` first!

? How many `*` characters does this print in total?
```c
for (int i = 1; i <= 3; i++)
    for (int j = 1; j <= i; j++)
        printf("*");
```
- `3` ~~ That would be a single loop.
- `9` ~~ `3 * 3` is for a square (`j <= 3`).
* `6` ~~ Row 1 prints 1, row 2 prints 2, row 3 prints 3: `1 + 2 + 3 = 6`.
- `4` ~~ Count `1 + 2 + 3`.
! Triangular nested loop prints $1 + 2 + 3 = 6$ stars.
