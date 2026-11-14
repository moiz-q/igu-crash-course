---
id: c-04
title: Classic flowchart examples
goal: read and draw flowcharts for sums, max/min, grade letters, factorial and loops
week: 3
minutes: 25
---

Week 3 of the syllabus focuses on classic flowchart problems that appear directly on written exams. Study each pattern below: **sequence**, **branching**, and **loops** (arrows pointing back up!).

## 1. Sum of two numbers

```flow
s   start  Start
r   io     Read a, b
p   proc   sum = a + b
o   io     Print sum
x   end    End
```

## 2. Larger of two numbers

```flow
s   start  Start
r   io     Read a, b
d   dec    a > b ?  yes:pa  no:pb
pa  io     Print a  ->x
pb  io     Print b  @right
x   end    End
```

## 3. Largest of three numbers (`a, b, c`)

Notice the clean pattern: start by assuming `max = a`, then check `b` and `c` in sequence!

```flow
s   start  Start
r   io     Read a, b, c
p0  proc   max = a
d1  dec    b > max ?  yes:u1  no:d2
u1  proc   max = b  @right  ->d2
d2  dec    c > max ?  yes:u2  no:o
u2  proc   max = c  @right  ->o
o   io     Print max
x   end    End
```

## 4. Sum of `1 .. N` (looping flowchart)

Watch how the arrow jumps **back up** to `d` until `i <= N` becomes false:

```flow
s   start  Start
r   io     Read N
p0  proc   sum = 0, i = 1
d   dec    i <= N ?  yes:body  no:out
body proc  sum = sum + i; i = i + 1  ->d
out io     Print sum  @right
x   end    End
```

## 5. Factorial `N!` ($1 \times 2 \times \dots \times N$)

Exact same loop shape — just start `fact = 1` and multiply instead of adding!

```flow
s   start  Start
r   io     Read N
p0  proc   fact = 1, i = 1
d   dec    i <= N ?  yes:body  no:out
body proc  fact = fact * i; i = i + 1  ->d
out io     Print fact  @right
x   end    End
```

## Try it

Take paper and a pen and draw the flowchart for each problem below, then open the model flowchart to compare.

### Task A: Grade letter from score (`>= 90` A, `>= 70` B, `>= 50` C, else F)

:::reveal Show model flowchart (Grade letter)
```flow
s   start  Start
r   io     Read score
d1  dec    score >= 90 ?  yes:ga  no:d2
ga  io     Print "A"  @right  ->x
d2  dec    score >= 70 ?  yes:gb  no:d3
gb  io     Print "B"  @right  ->x
d3  dec    score >= 50 ?  yes:gc  no:gf
gc  io     Print "C"  @right  ->x
gf  io     Print "F"
x   end    End
```
:::

### Task B: Maximum in a list of `N` numbers

:::reveal Show model flowchart (Max in a list)
```flow
s   start  Start
r0  io     Read N, first num -> max
p0  proc   i = 2
d1  dec    i <= N ?  yes:r1  no:out
r1  io     Read x
d2  dec    x > max ?  yes:up  no:inc
up  proc   max = x  @right  ->inc
inc proc   i = i + 1  ->d1
out io     Print max  @right
x   end    End
```
:::

## Common mistakes
- Initializing `fact = 0` instead of `fact = 1` — multiplying by `0` makes the answer always `0`!
- Initializing `max = 0` when finding the maximum of a list — if all input numbers are negative (e.g. `-5, -2, -9`), `0` would wrongly win! Always initialize `max` to the **first number**.
- Forgetting `i = i + 1` inside a loop flowchart, creating an infinite loop.

## Key terms
- loop | repeating a block of steps while a condition stays true | döngü
- counter variable | a variable (like `i`) that tracks how many times a loop has run | sayaç değişkeni
- accumulator | a variable (like `sum` or `fact`) that builds up a total step by step | biriktirici değişken

## Quick check
? In the `1 .. N` sum flowchart, what happens if you forget `i = i + 1`?
- It prints `N` ~~ It never reaches the `Print` step.
* The condition `i <= N` stays true forever (infinite loop) ~~ `i` remains `1` on every step.
- It computes `N!` ~~ Multiplying computes `N!`, not forgetting the increment.
- It stops after 1 step ~~ Without incrementing `i`, the loop never ends.
! Every loop needs an update step (`i = i + 1`) that moves toward the exit condition.

? When finding the **largest** number in a list of `N` user-entered numbers, what should `max` be initialized to?
- Always `0` ~~ Fails if all numbers are negative!
- Always `100` ~~ Fails if all numbers are smaller than 100!
* The **first** number read from the user ~~ Guaranteed to be a real value from the list.
- `N` ~~ `N` is the count of numbers, not one of the values.
! Initialize `max` (and `min`) to the first element of the list.

? In the factorial flowchart, what must `fact` start at before the loop?
- `0` ~~ `0 * 1 * 2 ... = 0`.
* `1` ~~ `1` is the identity element for multiplication (and `0! = 1`).
- `N` ~~ Starting at `N` and multiplying `1..N` would compute `N * N!`.
- `-1` ~~ Would make the result negative.
! Always initialize a sum accumulator to `0` and a product/factorial accumulator to `1`.
