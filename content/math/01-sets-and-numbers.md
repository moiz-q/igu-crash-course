---
id: math-01
title: Sets and number systems
goal: perform set operations (union, intersection, difference, complement) and classify numbers into natural, integer, rational, and real sets
week: 1
minutes: 18
---

Before solving equations, mathematics gives us a language for grouping objects (**sets**) and naming the kinds of numbers we work with (**number systems**).

## Sets and set operations

A **set** is a well-defined collection of distinct elements, written inside curly braces, such as $A = \{1, 2, 3, 4\}$.
- **Element**: $2 \in A$ ("2 is in $A$"), $9 \notin A$ ("9 is not in $A$").
- **Empty set**: $\emptyset$ or $\{\}$ (0 elements).
- **Subset**: $A \subseteq B$ means every element of $A$ is also in $B$. A set with $n$ elements has $2^n$ subsets.

Suppose $U = \{1, 2, 3, 4, 5, 6\}$, $A = \{1, 2, 3, 4\}$, and $B = \{3, 4, 5\}$:

| Operation | Symbol | Meaning | Result |
| --- | --- | --- | --- |
| **Union** | $A \cup B$ | In $A$ **or** $B$ (or both) | $\{1, 2, 3, 4, 5\}$ |
| **Intersection** | $A \cap B$ | In **both** $A$ and $B$ | $\{3, 4\}$ |
| **Difference** | $A \setminus B$ | In $A$ **but not** in $B$ | $\{1, 2\}$ |
| **Complement** | $A'$ | In universal set $U$ **but not** in $A$ | $\{5, 6\}$ |

**Counting formula (Inclusion–Exclusion)**:
$$s(A \cup B) = s(A) + s(B) - s(A \cap B)$$
*(In Turkish math exams, $s(A)$ denotes the number of elements in set $A$.)*

## Number sets ($\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$)

- **Natural numbers ($\mathbb{N}$)**: $\{0, 1, 2, 3, \dots\}$ (Positive integers $\mathbb{Z}^+ = \{1, 2, 3, \dots\}$).
- **Integers ($\mathbb{Z}$)**: $\{\dots, -2, -1, 0, 1, 2, \dots\}$.
- **Rational numbers ($\mathbb{Q}$)**: fractions $\frac{a}{b}$ where $a, b \in \mathbb{Z}$ and $b \ne 0$ (includes terminating and repeating decimals).
- **Irrational numbers ($\mathbb{Q}'$)**: decimals that never terminate and never repeat ($\sqrt{2}, \pi, e$).
- **Real numbers ($\mathbb{R}$)**: all rational and irrational numbers together.

## Try it

Practice set operations and counting problems with the interactive drill:

@widget mathdrill topic=sets

## Common mistakes

- Forgetting to subtract $s(A \cap B)$ when finding $s(A \cup B)$—elements in both sets get counted twice otherwise!
- Thinking $0$ is a positive integer. $0$ is an **even integer** and a **natural number** in Turkish curriculum ($\mathbb{N}$), but it is **neither positive nor negative**.
- Confusing $A \setminus B$ with $B \setminus A$: $\{1,2,3\} \setminus \{3,4\} = \{1,2\}$, whereas $\{3,4\} \setminus \{1,2,3\} = \{4\}$.

## Key terms

- set | a well-defined collection of distinct elements | küme
- union ($A \cup B$) | elements belonging to $A$, $B$, or both | birleşim
- intersection ($A \cap B$) | elements belonging to both $A$ and $B$ | kesişim
- rational number ($\mathbb{Q}$) | any number expressible as a fraction $a/b$ with integers $a, b \ne 0$ | rasyonel sayı

## Quick check

? If $s(A) = 12$, $s(B) = 9$, and $s(A \cap B) = 4$, what is $s(A \cup B)$?
- 21 ~~ forgot to subtract the overlap $s(A \cap B)$
* 17 ~~ $12 + 9 - 4 = 17$
- 15 ~~ subtracted too much
- 25 ~~ added the intersection instead of subtracting
! By inclusion–exclusion, $s(A \cup B) = 12 + 9 - 4 = 17$.

? How many subsets does the set $K = \{a, b, c, d\}$ have?
- 4 ~~ 4 is the number of elements, not subsets
- 8 ~~ $2^3 = 8$ is for 3 elements
* 16 ~~ $2^4 = 16$ subsets (including $\emptyset$ and $K$ itself)
- 12 ~~ $4 \times 3$ is not the subset formula
! A set with $n$ elements has $2^n$ subsets; $2^4 = 16$.

? Which number is **irrational** ($\notin \mathbb{Q}$)?
- $-7$ ~~ integer, so rational ($-7/1$)
- $0.25$ ~~ terminating decimal ($1/4$)
- $\sqrt{9}$ ~~ $\sqrt{9} = 3$, which is an integer
* $\sqrt{5}$ ~~ $5$ is not a perfect square, so $\sqrt{5}$ never terminates or repeats
! $\sqrt{5}$ cannot be written as $a/b$ with integers.
