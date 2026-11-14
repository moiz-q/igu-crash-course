---
id: db-04
title: Normalization (Part 1): Anomalies and 1NF
goal: spot insert, update and delete anomalies, identify functional dependencies and convert an unnormalized table to 1NF
week: 4
minutes: 15
---

Suppose someone puts all student, course and department facts into one giant spreadsheet-like table. Why is that a bad idea? Because of **anomalies** (*anormallikler*) — bugs that happen when you add, change or delete data.

## The three anomalies

Look at this unnormalized `CourseSheet` table:

| student_id | student_name | dept_name | building | courses |
| --- | --- | --- | --- | --- |
| 1 | Deniz Aksoy | Computer Prog. | Block A | CMP153, CMP151 |
| 2 | Ece Yildiz | Computer Prog. | Block A | CMP153, MTH153 |

1. **Insert anomaly (*ekleme anormalliği*):** You cannot add a new department (`Graphic Design` in `Block C`) until at least one student enrolls in it.
2. **Update anomaly (*güncelleme anormalliği*):** If `Computer Prog.` moves from `Block A` to `Block E`, you must update *every* row for every student in that department. Missing one row creates inconsistent data.
3. **Delete anomaly (*silme anormalliği*):** If `Ece Yildiz` drops out and you delete her row, you might accidentally lose the last record that `MTH153` existed!

## Functional dependency

A column `B` is **functionally dependent** on `A` (written `A → B`) if knowing `A` tells you *exactly one* value of `B`.
- `student_id → student_name` (knowing the student's ID gives one name).
- `dept_id → dept_name, building` (knowing the department ID gives its name and building).

## First Normal Form (1NF)

A table is in **1NF** when:
1. Every cell holds **one atomic (single) value** — no comma-separated lists like `CMP153, CMP151`, and no repeating columns like `course1, course2`.
2. Each row is unique (there is a **Primary Key**).

To fix `CourseSheet` into **1NF**, we split the multi-valued `courses` column into separate rows and make `(student_id, course_code)` the composite primary key:

| <u>student_id</u> | student_name | dept_name | building | <u>course_code</u> |
| --- | --- | --- | --- | --- |
| 1 | Deniz Aksoy | Computer Prog. | Block A | CMP153 |
| 1 | Deniz Aksoy | Computer Prog. | Block A | CMP151 |
| 2 | Ece Yildiz | Computer Prog. | Block A | CMP153 |
| 2 | Ece Yildiz | Computer Prog. | Block A | MTH153 |

1NF fixes the comma-separated list, but `student_name`, `dept_name` and `building` still repeat! We fix that in the next lesson with **2NF** and **3NF**.

## Try it

Look at this unnormalized table of student phone numbers:

| student_id | name | phones |
| --- | --- | --- |
| 10 | Defne | 0532-111, 0555-222 |
| 11 | Arda | 0544-333 |

How would you put it into **1NF**? Think for a minute, then check the answer.

:::reveal Show 1NF solution
Give each phone number its own row (or move phones to a `StudentPhones(student_id, phone)` table with composite PK `(student_id, phone)`):

| <u>student_id</u> | name | <u>phone</u> |
| --- | --- | --- |
| 10 | Defne | 0532-111 |
| 10 | Defne | 0555-222 |
| 11 | Arda | 0544-333 |
:::

## Common mistakes
- Leaving two values in one cell separated by a comma (`"CMP153, CMP151"`) and calling the table 1NF.
- Adding columns `phone1, phone2, phone3` instead of rows — repeating groups also violate 1NF.

## Key terms
- normalization | organizing tables to reduce redundancy and prevent anomalies | normalizasyon
- anomaly | an unwanted side effect when inserting, updating or deleting data | anormallik
- functional dependency | `A → B`: each value of `A` determines a single value of `B` | işlevsel bağımlılık
- First Normal Form (1NF) | every cell has one atomic value and every row has a primary key | Birinci Normal Form

## Quick check
? Which rule MUST a table satisfy to be in **First Normal Form (1NF)**?
- No foreign keys are allowed ~~ Relational tables in 1NF, 2NF and 3NF use foreign keys freely.
* Every cell contains a single atomic value (no lists or repeating groups) and rows are uniquely identified ~~ Atomicity and a primary key define 1NF.
- Every table must have at most 3 columns ~~ There is no column-count limit.
- All numbers must be integers ~~ Any data type is allowed.
! 1NF requires atomic (single) values per cell, no repeating groups, and a primary key.

? You cannot record a new `Course` in the database until at least one student enrolls in it. Which anomaly is this?
* Insert anomaly ~~ You are blocked from inserting valid data because unrelated data is missing.
- Update anomaly ~~ Update anomalies happen when editing repeated values.
- Delete anomaly ~~ Delete anomalies happen when removing a row destroys unrelated facts.
- Redundancy ~~ Redundancy is duplicate storage, not the inability to insert.
! An insert anomaly occurs when you cannot add one fact without also having another unrelated fact.

? What does the notation `student_id → city` mean?
- `city` uniquely identifies `student_id` ~~ Many students live in the same city, so `city` does not determine `student_id`.
* Knowing `student_id` determines a single `city` ~~ `city` is functionally dependent on `student_id`.
- `student_id` is greater than `city` ~~ `→` means functional dependency, not comparison.
- `student_id` is a foreign key to `city` ~~ `→` denotes functional dependency.
! `A → B` means each value of `A` maps to at most one value of `B`.
