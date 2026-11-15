---
id: db-12
title: DML queries: INSERT, UPDATE and DELETE
goal: add, modify and remove rows safely with INSERT, UPDATE and DELETE (and avoid the missing-WHERE disaster)
week: 11
minutes: 15
---

Besides reading data with `SELECT`, DML gives you three commands that **change** rows: `INSERT`, `UPDATE`, and `DELETE`.


@widget viz name=db-delete

## `INSERT`, `UPDATE`, `DELETE`

```sql run
-- 1. INSERT a new student
INSERT INTO Students (first_name, last_name, city, birth_date, dept_id, enrollment_year, gpa)
VALUES ('Tuna', 'Kaya', 'Istanbul', '2006-05-10', 1, 2026, 3.10);

-- 2. UPDATE that student's GPA
UPDATE Students
SET gpa = 3.35
WHERE first_name = 'Tuna' AND last_name = 'Kaya';

-- 3. DELETE that student again
DELETE FROM Students
WHERE first_name = 'Tuna' AND last_name = 'Kaya';

SELECT COUNT(*) AS student_count FROM Students;
```

:::warn The most famous SQL mistake: forgetting `WHERE`!
If you run:
```sql
UPDATE Students SET gpa = 0.0;
-- or:
DELETE FROM Students;
```
**Every single row in the table is overwritten or deleted!** Always write (and test!) your `WHERE` condition with a `SELECT` first, and wrap risky changes in a transaction (`BEGIN` / `ROLLBACK` / `COMMIT`).
:::

## Try it

Solve the `INSERT`, `UPDATE` and `DELETE` challenges below.

@widget challenges lesson=db-12

## Common mistakes
- Running `UPDATE` or `DELETE` without a `WHERE` clause (modifying or wiping the whole table).
- Trying to `DELETE` a parent row (e.g. a Department) while child rows (`Students` or `Courses`) still reference it via a `FOREIGN KEY`.
- Writing `UPDATE Students SET gpa = 3.5 AND city = 'Ankara'` — `SET` uses **commas**, not `AND` (`SET gpa = 3.5, city = 'Ankara'`).

## Key terms
- INSERT INTO | adds one or more new rows to a table | veri ekleme
- UPDATE ... SET | modifies existing row values matching `WHERE` | veri güncelleme
- DELETE FROM | removes existing rows matching `WHERE` | veri silme

## Quick check
? What happens if you run `UPDATE Instructors SET salary = salary * 1.10;` with no `WHERE` clause?
- SQL refuses to run it ~~ SQL executes it without asking!
- Only the first row is updated ~~ All rows are updated.
* Every instructor's salary is increased by 10% ~~ Without `WHERE`, `UPDATE` applies to every row in the table.
- Nothing changes ~~ Without `WHERE`, all rows match.
! Never omit `WHERE` in `UPDATE` or `DELETE` unless you truly intend to change every row.

? Which syntax is valid for updating two columns at once?
- `UPDATE Students SET city = 'Izmir' AND gpa = 3.5 WHERE student_id = 5;` ~~ `AND` is for conditions in `WHERE`, not assignments in `SET`.
* `UPDATE Students SET city = 'Izmir', gpa = 3.5 WHERE student_id = 5;` ~~ Separate column assignments in `SET` with a comma.
- `UPDATE Students (city, gpa) VALUES ('Izmir', 3.5) WHERE student_id = 5;` ~~ `VALUES` is for `INSERT`, not `UPDATE`.
- `MODIFY Students SET city = 'Izmir', gpa = 3.5;` ~~ `MODIFY` is not the command.
! In `UPDATE ... SET`, separate `col = val` pairs with commas.

? What is a safe habit before running a `DELETE FROM Students WHERE ...` on a real database?
- Run `DROP TABLE` first ~~ That deletes the whole table!
* Run `SELECT * FROM Students WHERE ...` first to verify which rows match ~~ Confirm the exact rows before deleting them.
- Always omit `WHERE` ~~ Omitting `WHERE` deletes every row.
- Use `TRUNCATE` instead ~~ `TRUNCATE` deletes all rows unconditionally.
! Test your `WHERE` clause with `SELECT` first, and use transactions (`BEGIN` / `ROLLBACK` / `COMMIT`) when editing live data.
