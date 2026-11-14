---
id: bridge-02
title: Preview: C structs
goal: group related variables into a struct, use arrays of structs and pass structs to functions
week: 8
minutes: 20
---

In semester 1 you stored a student's name in one array and their grade in another. A **struct** (*structure*) lets you bundle different types of data for one thing — like a student's id, name and GPA — into a single custom type.

## Defining and using a struct

You declare the shape of the struct once, usually at the top of the file. Adding `typedef` lets you write `Student` instead of `struct Student` every time.

```c run
#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[30];
    double gpa;
} Student;

int main() {
    Student s1 = {101, "Deniz", 3.45};
    Student s2;
    s2.id = 102;
    strcpy(s2.name, "Ece");
    s2.gpa = 3.80;

    printf("%d: %s (GPA %.2f)\n", s1.id, s1.name, s1.gpa);
    printf("%d: %s (GPA %.2f)\n", s2.id, s2.name, s2.gpa);
    return 0;
}
```

Use the dot operator `.` to read or change a field (`s1.gpa`). Notice that `s2.name` is a `char` array, so we copy text into it with `strcpy` rather than `=`.

## Arrays of structs and nested structs

You can make an array of structs just like an array of `int`, and you can put one struct inside another (**nested struct**).

```c run
#include <stdio.h>

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    char name[20];
    Date birth;
    int grade;
} Student;

void printStudent(Student s) {
    printf("%s | born %02d/%02d/%d | grade %d\n",
           s.name, s.birth.day, s.birth.month, s.birth.year, s.grade);
}

int main() {
    Student cls[2] = {
        {"Kerem", {12, 4, 2006}, 82},
        {"Merve", {19, 7, 2005}, 91}
    };
    for (int i = 0; i < 2; i++) {
        printStudent(cls[i]);
    }
    return 0;
}
```

When you pass a struct to a function by value (`void printStudent(Student s)`), the function receives a copy. To modify the original struct inside a function, pass its address (`Student *p`) and use `p->grade` (which is shorthand for `(*p).grade`).

## Try it

Edit the program below to add a 3rd student, compute the average grade of all 3 students, and print it with 1 decimal place.

```c run
#include <stdio.h>

typedef struct {
    char name[20];
    int grade;
} Student;

int main() {
    Student list[3] = {
        {"Deniz", 80},
        {"Ece", 92},
        {"Bora", 74}
    };
    int sum = 0;
    for (int i = 0; i < 3; i++) {
        sum += list[i].grade;
    }
    printf("Average: %.1f\n", sum / 3.0);
    return 0;
}
```

## Common mistakes
- Forgetting the semicolon `;` after the closing brace `}` of a `struct` definition.
- Trying to assign a string to a struct field with `s.name = "Ali"` instead of `strcpy(s.name, "Ali")`.
- Passing a struct by value when you meant to change its fields inside the function — pass a pointer `Student *p` and use `->`.

## Key terms
- struct | a composite type grouping fields of different types | yapı
- typedef | creates a shorter alias name for a type | tür takma adı
- member (field) | one variable inside a struct, accessed with `.` | üye (alan)
- arrow operator (->) | accesses a struct field through a pointer | ok operatörü

## Quick check
? What is missing at the end of `struct Point { int x; int y; }`?
- A colon `:` ~~ C does not end struct definitions with a colon.
* A semicolon `;` ~~ Every struct definition in C must end with `;`.
- A comma `,` ~~ Commas separate variables, not the end of a definition.
- Nothing is missing ~~ Without `;`, the compiler treats the next token as a variable name.
! A struct definition always ends with `};`.

? If `p` is a `Student *` pointer, how do you access the `gpa` field?
- `p.gpa` ~~ Dot `.` works on a struct value, not on a pointer.
* `p->gpa` ~~ The arrow operator `->` dereferences the pointer and reads the field.
- `*p.gpa` ~~ Dot binds tighter than `*`, so `*p.gpa` tries to dereference `gpa`.
- `p&gpa` ~~ `&` is the address-of operator, not member access.
! Use `->` on a pointer to a struct (`p->gpa` is the same as `(*p).gpa`).

? Which function copies `"Nisa"` into `s.name` after `s` is already declared?
- `s.name = "Nisa";` ~~ Arrays in C cannot be assigned with `=`.
* `strcpy(s.name, "Nisa");` ~~ `strcpy` from `<string.h>` copies characters into a char array.
- `strcmp(s.name, "Nisa");` ~~ `strcmp` compares two strings; it does not copy.
- `strlen(s.name, "Nisa");` ~~ `strlen` takes one string and returns its length.
! Use `strcpy` (from `<string.h>`) to copy a string into a struct's `char` array.
