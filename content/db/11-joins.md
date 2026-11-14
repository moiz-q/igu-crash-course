---
id: db-11
title: DML queries: JOINs (INNER, LEFT, RIGHT)
goal: combine rows from two or more related tables using INNER JOIN, LEFT JOIN and RIGHT JOIN
week: 11
minutes: 25
---

In a normalized database, facts live in separate tables: student names in `Students`, department names in `Departments`, enrollments in `Enrollments`. A **JOIN** stitches rows back together using matching key columns (usually `FK = PK`).

## JOIN types at a glance

@widget venn types=inner,left,right

- **`INNER JOIN`** (or just `JOIN`): returns **only** rows that have a match in **both** tables. Students with 0 enrollments disappear!
- **`LEFT JOIN`** (`LEFT OUTER JOIN`): returns **all** rows from the **left** table, plus matching rows from the right table (or `NULL` when there is no match).
- **`RIGHT JOIN`** (`RIGHT OUTER JOIN`): returns **all** rows from the **right** table, plus matching rows from the left (or `NULL`).

## Worked examples

An `INNER JOIN` across `Students`, `Enrollments` and `Courses`:
```sql run
SELECT s.first_name, s.last_name, c.course_code, e.grade
FROM Students s
INNER JOIN Enrollments e ON s.student_id = e.student_id
INNER JOIN Courses c     ON e.course_id  = c.course_id
ORDER BY s.last_name, c.course_code
LIMIT 12;
```

A `LEFT JOIN` to find students who have **not** enrolled in any course yet (`e.enrollment_id IS NULL`):
```sql run
SELECT s.student_id, s.first_name, s.last_name
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;
```

And `RIGHT JOIN` in SQL Server (T-SQL) — note that swapping the tables in a `LEFT JOIN` gives the exact same result:
```sql
-- SQL Server (T-SQL): all courses, even ones with 0 enrollments
SELECT c.course_code, c.title, e.student_id
FROM Enrollments e
RIGHT JOIN Courses c ON e.course_id = c.course_id;

-- Equivalent LEFT JOIN (works in every SQL version):
SELECT c.course_code, c.title, e.student_id
FROM Courses c
LEFT JOIN Enrollments e ON c.course_id = e.student_id;
```

## Try it

Solve the JOIN challenges below.

@widget challenges lesson=db-11

## Common mistakes
- Forgetting the `ON` condition (writing `FROM Students JOIN Departments` without `ON` produces a Cartesian product — every student paired with every department!).
- Writing `WHERE e.grade >= 80` after a `LEFT JOIN` — that turns the `LEFT JOIN` back into an `INNER JOIN` because `NULL >= 80` is false! Put right-table filters in the `ON` clause if you want to keep unmatched left rows.
- Ambiguous column names: if both `Students` and `Departments` have `dept_id`, always qualify it as `s.dept_id`.

## Key terms
- INNER JOIN | returns only rows with matching keys in both tables | iç birleştirme
- LEFT JOIN | returns all left-table rows plus matches (or `NULL`) from the right | sol dış birleştirme
- RIGHT JOIN | returns all right-table rows plus matches (or `NULL`) from the left | sağ dış birleştirme
- table alias | a short nickname like `Students s` to keep queries readable | tablo takma adı

## Quick check
? You want a list of **all courses**, including courses that have **zero** enrolled students. Which join from `Courses` to `Enrollments` should you use?
- `INNER JOIN` ~~ `INNER JOIN` drops courses with zero enrollments.
* `LEFT JOIN` (with `Courses` on the left) ~~ `LEFT JOIN` keeps every row from `Courses` even if `Enrollments` has no match.
- `CROSS JOIN` ~~ `CROSS JOIN` pairs every course with every enrollment.
- `UNION` ~~ `UNION` stacks rows vertically rather than joining columns horizontally.
! `Courses LEFT JOIN Enrollments ON ...` keeps all courses, filling enrollment columns with `NULL` when nobody enrolled.

? What happens in `SELECT s.first_name, e.grade FROM Students s LEFT JOIN Enrollments e ON s.student_id = e.student_id` for a student with no enrollments?
- The student is omitted ~~ `INNER JOIN` omits them; `LEFT JOIN` keeps them.
* The student appears once with `grade` equal to `NULL` ~~ Unmatched right-table columns become `NULL`.
- The query throws an error ~~ Missing matches are normal in outer joins.
- `grade` becomes `0` ~~ SQL uses `NULL` (unknown/missing), never `0`.
! Unmatched rows in a `LEFT JOIN` appear with `NULL` in all columns from the right table.

? If `Students` has 24 rows and `Departments` has 5 rows, what happens if you forget the `ON` clause in `SELECT * FROM Students CROSS JOIN Departments`?
- 24 rows ~~ That only happens if each student matches 1 department via `ON`.
- 29 rows ~~ Joins multiply, they don't add.
* 120 rows ($24 \times 5$) ~~ Without a join condition, every row of A pairs with every row of B.
- 5 rows ~~ Only if `Departments` were filtered.
! Always double-check your `ON a.key = b.key` condition to avoid an accidental Cartesian product.
