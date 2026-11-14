---
id: db-09
title: DML queries: SELECT, filtering and sorting
goal: retrieve, filter and sort rows using SELECT, WHERE, DISTINCT, LIKE, IN, BETWEEN, IS NULL and ORDER BY
week: 10
minutes: 25
---

Most of your day-to-day SQL work is **DML (Data Manipulation Language)** — especially `SELECT`, which reads data without changing it.

## Clause order in `SELECT`

You write a `SELECT` query in this fixed order:
```
SELECT columns
FROM table
WHERE condition
ORDER BY column [ASC | DESC]
LIMIT n;          -- (in SQL Server: SELECT TOP n ...)
```

```sql run
SELECT DISTINCT city
FROM Students
ORDER BY city ASC;
```

`DISTINCT` removes duplicate rows from the output.

## Filtering with `WHERE`

| Operator | Meaning | Example |
| --- | --- | --- |
| `=`, `<>` (or `!=`), `<`, `>`, `<=`, `>=` | Standard comparisons | `WHERE gpa >= 3.5` |
| `AND`, `OR`, `NOT` | Combine conditions (`AND` binds tighter than `OR`) | `WHERE city = 'Istanbul' AND gpa >= 3.0` |
| `BETWEEN a AND b` | Inclusive range (`>= a AND <= b`) | `WHERE enrollment_year BETWEEN 2025 AND 2026` |
| `IN (v1, v2, ...)` | Matches any value in the list | `WHERE city IN ('Ankara', 'Izmir')` |
| `LIKE 'pattern'` | Pattern match: `%` = any chars, `_` = 1 char | `WHERE last_name LIKE 'A%'` (starts with A) |
| `IS NULL` / `IS NOT NULL` | Tests for missing (`NULL`) values | `WHERE email IS NULL` |

:::warn Never write `= NULL`!
`NULL` means *"unknown"*. Comparing `email = NULL` is always **unknown** (false in `WHERE`), so it returns 0 rows! Always write `email IS NULL` or `email IS NOT NULL`.
:::

:::tsql TOP vs LIMIT
SQLite uses `LIMIT 5` at the end. **SQL Server (T-SQL)** puts `TOP 5` right after `SELECT`:
`SELECT TOP 5 first_name, gpa FROM Students ORDER BY gpa DESC;`
:::

## Try it

Practice writing `SELECT` queries against the sample university database — every challenge checks your result automatically.

@widget challenges lesson=db-09

## Common mistakes
- Writing `WHERE email = NULL` instead of `WHERE email IS NULL`.
- Combining `AND` and `OR` without parentheses: `WHERE city = 'Istanbul' OR city = 'Ankara' AND gpa > 3.5` runs `AND` first! Use parentheses: `WHERE (city = 'Istanbul' OR city = 'Ankara') AND gpa > 3.5`.
- Using `=` instead of `LIKE` with `%` (`WHERE first_name = 'A%'` looks for the literal `%` sign).

## Key terms
- DML | Data Manipulation Language (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) | Veri İşleme Dili
- DISTINCT | removes duplicate rows from a `SELECT` result | benzersiz (DISTINCT)
- LIKE | matches text patterns using `%` (zero or more chars) and `_` (one char) | desen eşleştirme
- NULL | represents a missing or unknown value (test with `IS NULL`) | boş/bilinmeyen değer

## Quick check
? Which `WHERE` clause finds students whose `gpa` is missing?
- `WHERE gpa = NULL` ~~ `= NULL` never matches anything in SQL.
- `WHERE gpa = ''` ~~ `''` is an empty text string, not `NULL`.
* `WHERE gpa IS NULL` ~~ Always use `IS NULL` or `IS NOT NULL` to test for `NULL`.
- `WHERE gpa == 0` ~~ `0` is a real number, not a missing value, and SQL uses `=`.
! `NULL` is unknown, so `= NULL` never returns true — always use `IS NULL`.

? What does `WHERE first_name LIKE '_a%'` match?
- Names starting with `a` ~~ `_` requires one character *before* `a`.
* Names whose **second** letter is `a` (e.g. `Kaan`, `Hanna`, `Tarik`) ~~ `_` matches 1 character, then `a`, then `%` matches the rest.
- Names ending with `a` ~~ `%a` matches names ending with `a`.
- Names containing `a` anywhere ~~ `%a%` matches `a` anywhere.
! `_` matches exactly one character; `%` matches zero or more characters.

? How do you return only the top 3 highest-paid instructors in **SQL Server (T-SQL)**?
- `SELECT first_name, salary FROM Instructors ORDER BY salary DESC LIMIT 3;` ~~ `LIMIT` is SQLite/MySQL/PostgreSQL, not SQL Server.
* `SELECT TOP 3 first_name, salary FROM Instructors ORDER BY salary DESC;` ~~ SQL Server uses `TOP n` after `SELECT`.
- `SELECT FIRST 3 first_name, salary FROM Instructors;` ~~ `FIRST` is not SQL Server syntax.
- `SELECT first_name, salary FROM Instructors TOP 3;` ~~ `TOP 3` goes right after `SELECT`.
! In SQL Server, use `SELECT TOP 3 ... ORDER BY ...`.
