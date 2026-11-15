---
title: Databases and SQL — the essentials
minutes: 20
intro: tables and keys, ER diagrams, normalization, SELECT, JOIN, changing data
---

A database is **linked tables**; SQL asks them questions. Seven pictures cover most of the course.

:::idea A table = columns × rows
@widget viz name=db-table
[Go deeper](#/lesson/db-01)
:::

:::idea Keys link the tables
@widget viz name=db-keys
[Go deeper](#/lesson/db-07)
:::

:::idea ER diagrams are the plan
```erd
Students: *student_id, first_name, dept_id
Enrollments: *enrollment_id, student_id, course_id, grade
Courses: *course_id, title
Students 1--N Enrollments
Courses 1--N Enrollments
```
**1:N** = one department, many students. **M:N** (students ↔ courses) always needs a table in the middle. [Go deeper](#/lesson/db-03)
:::

:::idea Normalization: store each fact once
@widget viz name=db-normalize
1NF one value per cell · 2NF depends on the whole key · 3NF nothing but the key. [Go deeper](#/lesson/db-04)
:::

:::idea SELECT asks a question
@widget viz name=db-order
```sql run
SELECT city, COUNT(*) AS students
FROM Students
WHERE enrollment_year >= 2024
GROUP BY city
ORDER BY students DESC;
```
[Go deeper](#/lesson/db-09)
:::

:::idea JOIN glues tables back together
@widget venn types=inner,left
```sql run
SELECT s.first_name, c.title, e.grade
FROM Enrollments e
JOIN Students s ON e.student_id = s.student_id
JOIN Courses  c ON e.course_id  = c.course_id
LIMIT 5;
```
[Go deeper](#/lesson/db-11)
:::

:::idea Four families of commands
@widget viz name=db-families
@widget viz name=db-delete
[Go deeper](#/lesson/db-12)
:::

:::remember If you remember only this
- PK = unique row id · FK = points to another table's PK
- M:N needs a junction table · normalize = each fact once
- write `SELECT…FROM…WHERE…GROUP BY…HAVING…ORDER BY`
- `UPDATE` / `DELETE` without `WHERE` hit **every** row
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
