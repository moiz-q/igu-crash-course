---
id: db-08
title: DDL queries: CREATE, ALTER, DROP and TRUNCATE
goal: create, modify and remove database tables and columns using DDL statements
week: 8–9
minutes: 20
---

SQL commands are grouped by job. **DDL (Data Definition Language)** builds and changes the *structure* of the database (tables, columns, constraints) — not the rows inside.

## The four DDL commands

| Command | Purpose | Effect on table |
| --- | --- | --- |
| `CREATE TABLE` | Builds a new table | Creates structure + constraints |
| `ALTER TABLE` | Adds, changes or drops columns/constraints | Keeps existing rows |
| `DROP TABLE` | Deletes the entire table and its data | Structure + rows gone |
| `TRUNCATE TABLE` | Deletes **all rows** fast, keeps the empty table | Structure stays, rows gone |

## `CREATE TABLE` and `ALTER TABLE`

```sql run
CREATE TABLE Clubs (
    club_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    club_name TEXT NOT NULL UNIQUE,
    room      TEXT DEFAULT 'Student Center'
);

ALTER TABLE Clubs ADD COLUMN budget REAL DEFAULT 0;

INSERT INTO Clubs (club_name) VALUES ('Coding Club');
SELECT * FROM Clubs;
```

:::tsql ALTER TABLE and TRUNCATE in SQL Server
- Adding a column in SQL Server omits the word `COLUMN`: `ALTER TABLE Clubs ADD budget DECIMAL(10,2) DEFAULT 0;`
- Dropping a column: `ALTER TABLE Clubs DROP COLUMN budget;`
- `TRUNCATE TABLE Clubs;` works in SQL Server (resets `IDENTITY` counter too!), whereas SQLite does not have `TRUNCATE` (use `DELETE FROM Clubs;` in SQLite).
:::

## `DELETE` vs `TRUNCATE` vs `DROP` (classic exam question!)

| Feature | `DELETE FROM T` | `TRUNCATE TABLE T` | `DROP TABLE T` |
| --- | --- | --- | --- |
| Language group | DML | DDL | DDL |
| Can use `WHERE`? | **Yes** | No (all rows) | No (whole table) |
| Keeps table structure? | Yes | Yes | **No** (table is gone) |
| Resets `IDENTITY`? | No | Yes | N/A |
| Rollback in transaction? | Yes | Yes in SQL Server (logged minimally) | Yes in SQL Server DDL |

## Try it

Solve the DDL challenges below.

@widget challenges lesson=db-08

## Common mistakes
- Running `DROP TABLE` when you only wanted to empty the rows (`TRUNCATE TABLE` or `DELETE FROM`).
- Trying to `DROP TABLE Departments` while `Students` still has a `FOREIGN KEY` pointing to it — you must drop or alter the child table first.
- Writing `ALTER TABLE ... ADD COLUMN` in SQL Server (SQL Server uses `ADD col type` without `COLUMN`).

## Key terms
- DDL | Data Definition Language (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`) | Veri Tanımlama Dili
- CREATE TABLE | defines a new table, its columns and constraints | tablo oluşturma
- ALTER TABLE | modifies an existing table's columns or constraints | tablo değiştirme
- DROP TABLE | permanently removes a table and all its rows | tablo silme

## Quick check
? Which command removes **all rows** from `Logs` while keeping the table structure and resetting `IDENTITY` in SQL Server?
- `DELETE FROM Logs;` ~~ `DELETE` does not reset the `IDENTITY` counter.
- `DROP TABLE Logs;` ~~ `DROP TABLE` removes the table structure itself.
* `TRUNCATE TABLE Logs;` ~~ `TRUNCATE` empties the table, keeps its columns, and resets `IDENTITY`.
- `ALTER TABLE Logs EMPTY;` ~~ `EMPTY` is not valid SQL.
! `TRUNCATE TABLE` is a DDL command that removes all rows and resets `IDENTITY`, keeping the table definition.

? Which command adds a `phone` column to an existing `Students` table?
- `UPDATE Students ADD phone TEXT;` ~~ `UPDATE` modifies row values, not table columns.
* `ALTER TABLE Students ADD COLUMN phone TEXT;` ~~ `ALTER TABLE ... ADD` modifies the table structure.
- `INSERT INTO Students COLUMN phone;` ~~ `INSERT` adds rows, not columns.
- `CREATE COLUMN phone ON Students;` ~~ Not valid SQL.
! Use `ALTER TABLE` to add, modify or drop columns.

? Which statement is **DML**, not **DDL**?
- `CREATE TABLE` ~~ DDL.
- `ALTER TABLE` ~~ DDL.
- `DROP TABLE` ~~ DDL.
* `DELETE FROM` ~~ `DELETE` manipulates rows (DML), whereas `CREATE`/`ALTER`/`DROP`/`TRUNCATE` change structure (DDL).
! Remember: DDL = structure (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`); DML = data (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
