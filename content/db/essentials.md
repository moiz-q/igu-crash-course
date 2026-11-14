---
title: Databases and SQL — the essentials
minutes: 25
intro: tables and keys, ER diagrams, normalization, SELECT, JOIN, changing data
---

A database is just **organised tables**, and SQL is the language you use to ask them questions. Seven ideas cover most of this course. The examples run on a small university database right in your browser — press **Run**.

:::idea A database is tables that are linked
Data = raw facts (`"Ayşe", 85`). **Information** = data that means something ("Ayşe passed"). Keeping data in separate files causes **duplicates** and **contradictions**. A **database** stores it once, in **tables**, and a **DBMS** (like SQL Server or SQLite) manages it safely.

A table has **columns** (fields like `name`, `city`) and **rows** (one record each).

[Go deeper: data and databases](#/lesson/db-01)
:::

:::idea Keys connect the tables
- A **primary key (PK)** uniquely identifies each row: `student_id`. No two rows share it, and it can't be empty.
- A **foreign key (FK)** is a column that points to another table's PK. `Enrollments.student_id` → `Students.student_id`.

That's how the database "knows" which student took which course, without copying the student's name everywhere.

[Go deeper: keys and constraints](#/lesson/db-07)
:::

:::idea ER diagrams are the plan
Before building tables, you draw an **Entity–Relationship diagram**: **entities** (things: Student, Course) with **attributes** (their columns), joined by **relationships** with a **cardinality**:

- **1:1** — one person, one passport
- **1:N** — one department, many students
- **M:N** — many students, many courses → needs a **junction table** in the middle (`Enrollments`)

```erd
Students: *student_id, first_name, dept_id
Enrollments: *enrollment_id, student_id, course_id, grade
Courses: *course_id, title
Students 1--N Enrollments
Courses 1--N Enrollments
```

[Go deeper: ER diagrams](#/lesson/db-03)
:::

:::idea Normalization = no repeated facts
If the same fact is written in many rows, sooner or later one copy gets changed and the others don't. **Normalization** splits tables to stop that:

- **1NF:** one value per cell (no "Math, Physics" in one cell).
- **2NF:** every column depends on the **whole** key.
- **3NF:** no column depends on another non-key column (e.g. `dept_name` belongs in `Departments`, not in `Students`).

Short version: *"the key, the whole key, and nothing but the key."*

[Go deeper: normalization](#/lesson/db-04)
:::

:::idea SELECT asks a question
```sql run
SELECT first_name, last_name, city
FROM Students
WHERE city = 'Istanbul'
ORDER BY last_name;
```
Read it like English: *show these columns, from this table, only rows where…, sorted by…*. Useful extras: `LIKE 'A%'` (starts with A), `IN (…)`, `BETWEEN`, `IS NULL`, `DISTINCT`.

**Counting and grouping:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, with `GROUP BY` to get one result per group and `HAVING` to filter the groups.

```sql run
SELECT city, COUNT(*) AS students
FROM Students
GROUP BY city
ORDER BY students DESC;
```

[Go deeper: SELECT](#/lesson/db-09) · [GROUP BY](#/lesson/db-10)
:::

:::idea JOIN puts tables back together
Because data is split across tables, you **JOIN** them on the key that links them:

```sql run
SELECT s.first_name, c.title, e.grade
FROM Enrollments e
JOIN Students s ON e.student_id = s.student_id
JOIN Courses  c ON e.course_id  = c.course_id
ORDER BY e.grade DESC
LIMIT 5;
```
- **INNER JOIN** (just `JOIN`): only rows that match in both tables.
- **LEFT JOIN**: all rows from the left table, even with no match (missing parts become `NULL`).

[Go deeper: JOINs](#/lesson/db-11)
:::

:::idea Four families of SQL commands
| Family | Does | Commands |
| --- | --- | --- |
| **DDL** (definition) | builds the structure | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** (manipulation) | works with the rows | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** (control) | permissions | `GRANT`, `REVOKE`, `DENY` |
| **TCL** (transactions) | all-or-nothing changes | `BEGIN`, `COMMIT`, `ROLLBACK` |

The most dangerous line in SQL: `DELETE FROM Students;` — **without `WHERE` it deletes every row.** Always write the `WHERE` first.

`DELETE` removes rows (can use WHERE) · `TRUNCATE` empties the whole table fast · `DROP` deletes the table itself.

[Go deeper: DDL](#/lesson/db-08) · [INSERT/UPDATE/DELETE](#/lesson/db-12) · [transactions](#/lesson/db-14)
:::

:::remember If you remember only this
- Tables have rows and columns; **PK** identifies a row, **FK** links to another table.
- ER diagram first; M:N needs a junction table.
- Normalize so each fact is stored once (1NF → 2NF → 3NF).
- Clause order: `SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY`.
- `UPDATE` and `DELETE` without `WHERE` change **every** row.
:::

:::tsql
The university uses Microsoft SQL Server. It is almost the same; the main difference you'll notice is `SELECT TOP 5 …` instead of `… LIMIT 5`.
:::

## Quick check

? Which column is the best primary key for a Students table?
- first_name ~~ two students can have the same name
- city ~~ many students share a city
* student_id ~~ unique for every student
- birth_date ~~ not unique
! A PK must be unique and never empty.

? Students and Courses have a many-to-many relationship. What do you need?
- one bigger table ~~ that creates repeated data
* a junction table such as Enrollments ~~ it holds pairs of student_id and course_id
- nothing special ~~ M:N can't be stored directly
- a second database ~~ no
! M:N is resolved with a junction table.

? Which clause filters rows **before** grouping?
* WHERE ~~ WHERE filters rows; HAVING filters groups
- HAVING ~~ that filters groups after GROUP BY
- ORDER BY ~~ that sorts
- SELECT ~~ that chooses columns
! WHERE → rows, HAVING → groups.

? What does `DELETE FROM Courses;` do?
- deletes the Courses table ~~ that's DROP
* deletes every row in Courses ~~ there is no WHERE
- deletes one row ~~ no condition was given
- nothing ~~ it runs
! Always check the WHERE before UPDATE/DELETE.

? An INNER JOIN between Students and Enrollments returns:
- all students, even those with no enrollments ~~ that's LEFT JOIN
* only students that have at least one matching enrollment ~~ only matching rows
- only enrollments with no student ~~ no
- every possible pair of rows ~~ that's a CROSS JOIN
! INNER = matches in both tables.
