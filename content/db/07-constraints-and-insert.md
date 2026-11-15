---
id: db-07
title: Constraints and entering data
goal: protect table data using PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, DEFAULT and CHECK, and insert rows with INSERT
week: 6
minutes: 20
---

A good database does not trust applications to send clean data — it enforces rules itself using **constraints** (*kısıtlamalar*).


@widget viz name=db-keys

## The 6 core constraints

| Constraint | What it guarantees | Example |
| --- | --- | --- |
| `PRIMARY KEY` | Uniquely identifies each row (unique + not null) | `student_id INT PRIMARY KEY` |
| `FOREIGN KEY` | Value must exist in the referenced parent table | `FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)` |
| `NOT NULL` | Column cannot be left empty (`NULL`) | `first_name NVARCHAR(40) NOT NULL` |
| `UNIQUE` | No two rows can have the same non-null value | `email NVARCHAR(80) UNIQUE` |
| `DEFAULT` | Automatic value if none is provided on `INSERT` | `semester VARCHAR(20) DEFAULT '2026-Fall'` |
| `CHECK` | Every row must satisfy a boolean condition | `CHECK (grade >= 0 AND grade <= 100)` |

:::tsql Auto-incrementing Primary Keys
- In **SQLite:** `student_id INTEGER PRIMARY KEY AUTOINCREMENT`
- In **SQL Server (T-SQL):** `student_id INT PRIMARY KEY IDENTITY(1,1)` (starts at 1, increases by 1 for each new row).
:::

## Entering data: GUI vs `INSERT INTO`

In SSMS you can right-click a table › **Edit Top 200 Rows** to type rows into a grid. In real work and exams, you write `INSERT INTO`:

```sql run
INSERT INTO Departments (dept_name, building)
VALUES ('Artificial Intelligence', 'Block E');

SELECT * FROM Departments;
```

You can also insert several rows in one statement:
```sql
INSERT INTO Departments (dept_name, building) VALUES
('Mechatronics', 'Block F'),
('Data Science', 'Block E');
```

And if a constraint is violated, the database blocks the bad row:
```sql run fails=1
-- This fails because grade 150 violates CHECK (grade >= 0 AND grade <= 100):
INSERT INTO Enrollments (student_id, course_id, grade)
VALUES (1, 10, 150);
```

## Try it

Practice inserting a valid row and see how `DEFAULT` works, then try the challenge below.

@widget challenges lesson=db-07

## Common mistakes
- Putting a value in the `VALUES (...)` list for an `IDENTITY` / `AUTOINCREMENT` primary key column — let the database generate it automatically.
- Inserting a child row (like a `Student` with `dept_id = 99`) before `dept_id = 99` exists in `Departments` — the `FOREIGN KEY` constraint will reject it.
- Writing `NULL` inside quotes (`'NULL'`) — `'NULL'` is the 4-letter word "NULL", not an empty SQL `NULL`.

## Key terms
- constraint | a rule enforced by the database on column values | kısıtlama
- NOT NULL | forbids missing (`NULL`) values in a column | boş geçilemez
- CHECK | enforces a custom condition on column values | kontrol kısıtlaması
- IDENTITY / AUTOINCREMENT | automatically generates sequential primary key numbers | otomatik artan

## Quick check
? Which constraint stops two students from registering the exact same `email` address?
- `NOT NULL` ~~ `NOT NULL` only prevents empty values, not duplicates.
- `CHECK` ~~ `CHECK` tests a condition on a single row's values, not across rows.
* `UNIQUE` ~~ `UNIQUE` ensures no two rows share the same value.
- `DEFAULT` ~~ `DEFAULT` supplies a fallback value when none is given.
! Use `UNIQUE` to forbid duplicate values in a non-primary-key column like `email`.

? What happens if you run `INSERT INTO Enrollments (student_id, course_id, grade) VALUES (1, 10, -5);` when `CHECK (grade >= 0 AND grade <= 100)` is on `grade`?
- The database silently changes `-5` to `0` ~~ Databases reject invalid data rather than guessing a fix.
* The `INSERT` fails with a CHECK constraint error and no row is added ~~ Constraints protect data integrity.
- The row is inserted and flagged as a warning ~~ The statement is aborted.
- `-5` is stored as `NULL` ~~ It is rejected, not converted.
! A `CHECK` constraint rejects any `INSERT` or `UPDATE` that makes the condition false.

? In SQL Server (T-SQL), which keyword automatically numbers a primary key `1, 2, 3, ...`?
- `AUTOINCREMENT` ~~ `AUTOINCREMENT` is SQLite syntax.
* `IDENTITY(1,1)` ~~ `IDENTITY(seed, increment)` is SQL Server's auto-numbering keyword.
- `AUTO_INCREMENT` ~~ `AUTO_INCREMENT` is MySQL syntax.
- `SERIAL` ~~ `SERIAL` is PostgreSQL syntax.
! SQL Server uses `IDENTITY(1,1)`; SQLite uses `AUTOINCREMENT`.
