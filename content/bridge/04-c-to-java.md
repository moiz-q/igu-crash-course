---
id: bridge-04
title: Preview: From C to Java
goal: translate basic C programs (types, I/O, conditions, loops, arrays, functions) into Java
week: 8
minutes: 20
---

**Object Oriented Programming (CMP157)** in semester 2 uses **Java** (7 ECTS). Good news: Java copied much of its syntax from C, so `if`, `else`, `switch`, `for`, `while`, operators and braces `{ }` work almost identically.

## Side by side: C vs Java

| Feature | C | Java |
| --- | --- | --- |
| Entry point | `int main()` | `public static void main(String[] args)` inside a `class` |
| Print to screen | `printf("Hi %d\n", x);` | `System.out.println("Hi " + x);` |
| Read from keyboard | `scanf("%d", &x);` | `Scanner sc = new Scanner(System.in); int x = sc.nextInt();` |
| Strings | `char s[20];` with `<string.h>` | Built-in `String s = "Ali";` (and `s.equals("Ali")`) |
| Booleans | `0` (false) / non-zero (true) | Dedicated `boolean` (`true` / `false`) |
| Functions | Standalone functions | **Methods** inside a `class` |

## Worked example: same program in C and Java

In C:
```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int nums[3] = {10, 20, 30};
    for (int i = 0; i < 3; i++) {
        printf("%d\n", add(nums[i], 5));
    }
    return 0;
}
```

In Java:
```java
public class Main {
    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int[] nums = {10, 20, 30};
        for (int i = 0; i < nums.length; i++) {
            System.out.println(add(nums[i], 5));
        }
    }
}
```

Notice two handy improvements in Java:
1. Java arrays know their own length (`nums.length`), so you don't need a separate `n` variable.
2. Java strings are real objects (`String`), so you join them with `+` and compare them with `.equals(...)` (never `==`).

## Try it

Check your understanding of the C → Java differences:

_ In Java, every `main` method must sit inside a ___. = class ~~ Java has no standalone functions outside classes.
_ To get the number of elements in a Java array `arr`, write ___. = arr.length ~~ No parentheses on array `.length`.
_ To compare two Java `String` variables `a` and `b` for equal text, write ___. = a.equals(b) | b.equals(a) ~~ `==` checks whether two references point to the same object, not text equality.
_ In Java, a `boolean` variable can only hold `true` or ___. = false ~~ Unlike C, Java `if (1)` does not compile; conditions must be `boolean`.

## Common mistakes
- Comparing Java `String` values with `==` instead of `.equals(...)`.
- Writing `if (x)` where `x` is an `int` — Java requires an explicit `boolean` condition like `if (x != 0)`.
- Writing `arr.length()` with parentheses on an array (`length` is a field on arrays, whereas `length()` is a method on `String`).

## Key terms
- method | a function defined inside a Java class | metot (yöntem)
- String | Java's built-in text type (immutable object, not a char array) | metin türü
- Scanner | Java utility class (`java.util.Scanner`) for reading keyboard input | tarayıcı sınıfı
- boolean | a Java data type with only `true` and `false` | mantıksal tür

## Quick check
? Which Java statement prints `Score: 90` followed by a new line?
- `printf("Score: %d\n", 90);` ~~ `printf` is C (Java uses `System.out.printf` or `System.out.println`).
* `System.out.println("Score: " + 90);` ~~ `println` prints the text and moves to a new line.
- `System.in.println("Score: " + 90);` ~~ `System.in` is for input, not output.
- `print("Score: " + 90);` ~~ Java has no global `print` function.
! `System.out.println(...)` is Java's standard line-printing call.

? What happens if you write `int x = 5; if (x) { ... }` in Java?
- It runs the `if` body because 5 is non-zero ~~ That is C behaviour, not Java.
* It fails to compile because `if` requires a `boolean` ~~ Java does not treat integers as true/false.
- It skips the `if` body ~~ It does not compile at all.
- It converts `x` to `"5"` ~~ No automatic conversion to boolean happens.
! Java `if` conditions must evaluate to `boolean` (`true` or `false`).

? How do you read an `int` from `Scanner sc` in Java?
- `sc.scanf("%d")` ~~ `scanf` is C, not a `Scanner` method.
* `sc.nextInt()` ~~ `nextInt()` reads the next integer token.
- `sc.readInt()` ~~ That is not a `Scanner` method name.
- `sc.get()` ~~ That is not a `Scanner` method.
! `Scanner` provides `nextInt()`, `nextDouble()`, `next()`, and `nextLine()`.
