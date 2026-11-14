---
id: bridge-05
title: Preview: JDK, Eclipse and your first Java class
goal: understand how to set up Java + Eclipse and write a basic class with fields, a constructor and a method
week: 8
minutes: 20
---

In **Object Oriented Programming (CMP157)**, the university uses **Java** and the **Eclipse IDE**. Instead of writing loose functions and variables, you group data and behaviour together into **classes** and create **objects** from them.

## Installing JDK and Eclipse (before week 1)

1. Install a **JDK (Java Development Kit)** — e.g. Eclipse Temurin (Java 17 or 21 LTS). The JDK includes `javac` (the compiler) and `java` (the runner).
2. Download **Eclipse IDE for Java Developers** from `eclipse.org`.
3. In Eclipse: **File › New › Java Project**, give it a name, then right-click `src` › **New › Class** (tick `public static void main` for your starter class).

## Classes, objects and constructors

A **class** is a blueprint (like a `struct` in C, plus methods). An **object** is one actual instance built from that blueprint using `new`.

```java
public class Student {
    // Fields (data)
    private String name;
    private double gpa;

    // Constructor: runs when you create a new Student
    public Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    // Method (behaviour)
    public void printInfo() {
        System.out.println(name + " — GPA: " + gpa);
    }

    public boolean isHonor() {
        return gpa >= 3.5;
    }

    public static void main(String[] args) {
        Student s1 = new Student("Deniz", 3.65);
        Student s2 = new Student("Kerem", 2.90);

        s1.printInfo();
        System.out.println("Honor? " + s1.isHonor());
        s2.printInfo();
    }
}
```

## Access modifiers at a glance

| Modifier | Who can see it? | Typical use |
| --- | --- | --- |
| `public` | Any class anywhere | Constructors, methods meant for callers |
| `private` | Only inside the same class | Fields (to protect data — **encapsulation**) |
| `protected` | Same package + subclasses | Inheritance (covered later in OOP) |

## Try it

Fill in the blanks for a `Book` class:

_ To create a new `Student` object named `s`, you use the keyword ___. = new ~~ `new` allocates the object and calls its constructor.
_ A ___ has the same name as the class and no return type; it initializes the object's fields. = constructor ~~ Constructors run automatically on `new`.
_ Marking fields `private` so outside code cannot change them directly is called ___. = encapsulation ~~ Encapsulation hides internal state behind public methods.
_ Inside a constructor, `___` refers to the current object being created. = this ~~ `this.name = name;` distinguishes the field from the parameter.

## Common mistakes
- Giving a constructor a return type like `void Student(...)` — that turns it into a normal method, not a constructor.
- Naming the `.java` file differently from the `public class` inside it (`Student.java` must contain `public class Student`).
- Forgetting `new` when creating an object (`Student s1;` only declares a `null` reference).

## Key terms
- class | a blueprint defining fields and methods for objects | sınıf
- object | a concrete instance of a class created with `new` | nesne
- constructor | a special method that initializes a new object | yapıcı metot (constructor)
- encapsulation | hiding `private` fields and exposing controlled `public` methods | kapsülleme

## Quick check
? What happens if you write `Student s; s.printInfo();` without `new Student(...)`?
- It prints empty values ~~ No object was created yet.
* It fails to compile (local variable not initialized) or throws a `NullPointerException` ~~ A reference variable without `new` does not point to any object.
- Java creates a default `Student` automatically ~~ Java only creates objects when you call `new`.
- It calls the constructor twice ~~ No constructor ran.
! You must create an object with `new` before calling methods on it.

? Why are fields usually marked `private` in Java?
- So Java runs faster ~~ Access modifiers are compile-time visibility rules, not speed optimizations.
* To protect the object's data from invalid outside changes ~~ Callers use `public` getter/setter or action methods instead.
- Because `public` fields cannot hold numbers ~~ `public` works with any type.
- So `main` cannot read them ~~ `main` in the same class can read them, and other classes use `public` methods.
! `private` fields + `public` methods is the basis of encapsulation.

? Which of these is a valid constructor header for `class Course`?
- `public void Course(String title)` ~~ Constructors have NO return type, not even `void`.
* `public Course(String title)` ~~ Same name as the class, no return type.
- `public int Course()` ~~ `int` is a return type, making it a method.
- `constructor Course()` ~~ Java does not use a `constructor` keyword.
! A constructor has the exact class name and no return type.
