---
id: bridge-06
title: Preview: SQL functions, views and stored procedures
goal: use built-in string/date/math SQL functions, create a view, and understand what a stored procedure does
week: 8
minutes: 20
---

**Database Management Systems II (CMP152)** (7 ECTS) starts by reviewing ER diagrams and normalization, then moves straight into **SQL functions, views, transactions and stored procedures** (in T-SQL / SQL Server).

## Built-in SQL functions

You can transform column values right inside `SELECT`:
- **String:** `UPPER(s)`, `LOWER(s)`, `LENGTH(s)`, `SUBSTR(s, start, len)`
- **Math:** `ROUND(x, n)`, `ABS(x)`
- **Date:** `date('now')`, `strftime('%Y', birth_date)`

```sql run
SELECT
    UPPER(last_name) || ', ' || first_name AS full_name,
    LENGTH(email) AS email_len,
    ROUND(gpa, 1) AS rounded_gpa,
    strftime('%Y', birth_date) AS birth_year
FROM Students
WHERE gpa IS NOT NULL
ORDER BY gpa DESC
LIMIT 8;
```

:::tsql SQL Server (T-SQL) equivalents
- `LENGTH(s)` → `LEN(s)`
- `SUBSTR(s, 1, 3)` → `SUBSTRING(s, 1, 3)`
- `a || b` (string concat) → `a + b` or `CONCAT(a, b)`
- `date('now')` → `GETDATE()`
- `strftime('%Y', birth_date)` → `YEAR(birth_date)`
- `LIMIT 8` → `SELECT TOP 8 ...`
:::

## Views (`CREATE VIEW`)

A **view** is a saved `SELECT` query with a name. You can query it like a table, without duplicating data.

```sql run
CREATE VIEW IF NOT EXISTS HonorStudents AS
SELECT s.student_id, s.first_name, s.last_name, d.dept_name, s.gpa
FROM Students s
JOIN Departments d ON s.dept_id = d.dept_id
WHERE s.gpa >= 3.50;

SELECT first_name, last_name, dept_name, gpa
FROM HonorStudents
ORDER BY gpa DESC;
```

## Stored procedures (SQL Server / T-SQL)

SQLite does not have stored procedures, so you will write these in SQL Server in semester 2. A **stored procedure** is a saved block of SQL statements (often with parameters) that lives in the database and runs when called with `EXEC`:

```sql
-- T-SQL (SQL Server)
CREATE PROCEDURE GetStudentsByCity
    @City NVARCHAR(50)
AS
BEGIN
    SELECT first_name, last_name, gpa
    FROM Students
    WHERE city = @City
    ORDER BY last_name;
END;

-- Run it later:
EXEC GetStudentsByCity @City = 'Istanbul';
```

## Try it

Edit the query below to list each course's `course_code`, its `title` in uppercase, and the average `grade` rounded to 1 decimal place (`ROUND(AVG(grade), 1)`).

```sql run
SELECT
    c.course_code,
    UPPER(c.title) AS course_title,
    ROUND(AVG(e.grade), 1) AS avg_grade
FROM Courses c
JOIN Enrollments e ON c.course_id = e.course_id
WHERE e.grade IS NOT NULL
GROUP BY c.course_id, c.course_code, c.title
ORDER BY avg_grade DESC;
```

## Common mistakes
- Putting a view's `ORDER BY` inside `CREATE VIEW` in SQL Server without `TOP` (SQL Server forbids `ORDER BY` inside a view definition unless `TOP` is used — put `ORDER BY` when selecting from the view).
- Forgetting that `NULL` values pass through string/math functions as `NULL` (e.g. `LENGTH(NULL)` is `NULL`).
- Confusing a **view** (a virtual table from a `SELECT`) with a **stored procedure** (a callable program of SQL statements with parameters).

## Key terms
- scalar function | a function that runs on each row and returns one value (e.g. `UPPER`, `ROUND`) | skaler fonksiyon
- view | a saved `SELECT` query queried like a table | görünüm (view)
- stored procedure | a named, parameterized SQL script saved in the database | saklı yordam (stored procedure)

## Quick check
? Does `CREATE VIEW` copy the table's rows into a second table on disk?
- Yes, it duplicates all rows ~~ A standard view stores only the `SELECT` definition, not a copy of the data.
* No, it stores the query and reads live data from the underlying tables ~~ Updating a base table updates what the view shows.
- Only if `WHERE` is used ~~ `WHERE` just filters the query.
- Yes, until you run `DROP TABLE` ~~ You drop a view with `DROP VIEW`.
! A view is a virtual table: it stores the query, not a separate copy of the rows.

? Which T-SQL function gives the current date and time in SQL Server?
- `date('now')` ~~ That is SQLite syntax.
* `GETDATE()` ~~ `GETDATE()` is SQL Server's current date/time function.
- `LENGTH()` ~~ `LENGTH` measures string length in SQLite.
- `TODAY()` ~~ Not a built-in SQL Server function.
! In SQL Server (T-SQL), use `GETDATE()` (and `YEAR(d)` / `MONTH(d)` to extract parts).

? How do you run a stored procedure named `GetStudentsByCity` in SQL Server?
- `SELECT * FROM GetStudentsByCity;` ~~ `SELECT * FROM` is for tables and views.
* `EXEC GetStudentsByCity @City = 'Istanbul';` ~~ Stored procedures are invoked with `EXEC` (or `EXECUTE`).
- `RUN GetStudentsByCity;` ~~ `RUN` is not a SQL keyword.
- `CALL VIEW GetStudentsByCity;` ~~ Wrong keywords.
! Stored procedures in T-SQL are executed with `EXEC`.
