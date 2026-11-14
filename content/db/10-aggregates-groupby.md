---
id: db-10
title: DML queries: Aggregates, GROUP BY and HAVING
goal: summarize rows with COUNT, SUM, AVG, MIN, MAX, group them with GROUP BY and filter groups with HAVING
week: 10
minutes: 20
---

Instead of listing individual rows, you often want summaries: *How many students live in each city? What is the average grade per course?* That is what **aggregate functions** and `GROUP BY` do.

## The 5 aggregate functions

- `COUNT(*)`: counts all rows (including rows with `NULL`s).
- `COUNT(col)`: counts non-`NULL` values in `col`.
- `SUM(col)`, `AVG(col)`, `MIN(col)`, `MAX(col)`: ignore `NULL` values automatically.

```sql run
SELECT
    COUNT(*) AS total_students,
    COUNT(gpa) AS students_with_gpa,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    MAX(gpa) AS highest_gpa
FROM Students;
```

## Grouping with `GROUP BY` and filtering groups with `HAVING`

`GROUP BY` splits rows into buckets (e.g. one bucket per `city`), then runs the aggregate function on each bucket.

- **`WHERE`** filters **rows BEFORE** grouping.
- **`HAVING`** filters **groups AFTER** grouping (using aggregate results like `COUNT(*) >= 3`).

```sql run
SELECT city, COUNT(*) AS student_count, ROUND(AVG(gpa), 2) AS avg_gpa
FROM Students
GROUP BY city
HAVING COUNT(*) >= 2
ORDER BY student_count DESC;
```

Remember the full execution order of a `SELECT` query:
`FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`.

## Try it

Solve the aggregation challenges below.

@widget challenges lesson=db-10

## Common mistakes
- Putting an aggregate like `WHERE COUNT(*) > 2` in `WHERE` — `WHERE` runs before grouping! Use `HAVING COUNT(*) > 2`.
- Selecting a non-aggregated column that is not listed in `GROUP BY` (SQL Server rejects this with an error).
- Confusing `COUNT(*)` (counts every row) with `COUNT(email)` (skips rows where `email IS NULL`).

## Key terms
- aggregate function | a function that combines many rows into one summary value (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) | kümeleme fonksiyonu
- GROUP BY | groups rows with matching values so aggregates run per group | gruplama
- HAVING | filters groups *after* `GROUP BY` and aggregate calculation | grup koşulu (HAVING)

## Quick check
? What is the difference between `COUNT(*)` and `COUNT(email)` on `Students`?
- No difference ~~ They give different numbers whenever `email` has `NULL` values.
* `COUNT(*)` counts all rows; `COUNT(email)` counts only rows where `email` is NOT `NULL` ~~ Aggregate functions on a column skip `NULL`s.
- `COUNT(email)` counts unique emails ~~ For unique values, use `COUNT(DISTINCT email)`.
- `COUNT(*)` only counts numeric columns ~~ `COUNT(*)` counts whole rows.
! `COUNT(*)` counts every row; `COUNT(column)` ignores `NULL`s in that column.

? Which clause is valid for keeping only departments whose average instructor salary is above 60,000?
- `WHERE AVG(salary) > 60000` ~~ Aggregate functions cannot be used in `WHERE`.
* `HAVING AVG(salary) > 60000` ~~ `HAVING` filters groups after `GROUP BY`.
- `GROUP BY AVG(salary) > 60000` ~~ `GROUP BY` takes column names, not conditions.
- `ORDER BY AVG(salary) > 60000` ~~ `ORDER BY` sorts, it does not filter.
! Use `WHERE` to filter individual rows before grouping, and `HAVING` to filter groups after `GROUP BY`.

? In `SELECT city, COUNT(*) FROM Students WHERE enrollment_year = 2026 GROUP BY city HAVING COUNT(*) >= 3`, what runs first?
- `HAVING` ~~ `HAVING` runs after `GROUP BY`.
- `GROUP BY` ~~ `WHERE` filters rows before `GROUP BY` runs.
* `WHERE enrollment_year = 2026` ~~ `FROM` and `WHERE` filter individual rows before grouping.
- `SELECT` ~~ `SELECT` projects the final columns after filtering and grouping.
! Execution order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY`.
