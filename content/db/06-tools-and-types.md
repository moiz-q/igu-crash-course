---
id: db-06
title: Installing tools, creating a database and data types
goal: know how to set up SQL Server Express + SSMS, create a database and choose the right SQL data types
week: 5
minutes: 15
---

From week 5 onward, the course moves from paper diagrams to real SQL. On campus, the university typically uses **Microsoft SQL Server Express** (the free database engine) together with **SSMS (SQL Server Management Studio)** (the graphical tool where you write queries). On this site, you can run SQL directly in the browser without installing anything.

## Setting up SQL Server Express + SSMS (for home practice)

1. Download **SQL Server Express** (free edition) from Microsoft and run the *Basic* installer.
2. Download and install **SSMS** (SQL Server Management Studio).
3. Open SSMS, connect to `localhost\SQLEXPRESS` using *Windows Authentication*, then right-click **Databases › New Database…** (or click **New Query** and run `CREATE DATABASE UniversityDB;`).

:::tsql Creating and selecting a database
In SQL Server, you create a database and switch to it with:
```sql
CREATE DATABASE UniversityDB;
GO
USE UniversityDB;
```
SQLite (the browser playground here) stores one database per file, so `CREATE DATABASE` and `USE` are not needed in SQLite.
:::

## Common SQL data types

Every column in a table must have a **data type** so the database knows what values are allowed and how to sort or calculate them.

| Value kind | SQL Server (T-SQL) | SQLite (here) | Example |
| --- | --- | --- | --- |
| Whole numbers | `INT`, `SMALLINT` | `INTEGER` | `credits = 5`, `enrollment_year = 2026` |
| Exact decimals (money, GPA) | `DECIMAL(4,2)` | `REAL` | `gpa = 3.45`, `salary = 62000.00` |
| Short text (ASCII) | `VARCHAR(50)` | `TEXT` | `'CMP151'` |
| Unicode text (Turkish chars `ğ, ş, ı, ö, ü, ç`) | `NVARCHAR(50)` | `TEXT` | `'Ayşe Yılmaz'` |
| Date | `DATE` | `TEXT` (`'YYYY-MM-DD'`) | `'2026-09-14'` |
| True / False | `BIT` (`0` or `1`) | `INTEGER` (`0` or `1`) | `is_active = 1` |

:::tip Why NVARCHAR matters in Turkey
In SQL Server, `VARCHAR` can corrupt Turkish letters like `ş, ğ, ı, İ` depending on collation. Always use `NVARCHAR` for names, cities and titles in Turkish or multilingual apps.
:::

## Try it

Run this query to inspect the column names and types of the `Students` table in our SQLite database.

```sql run
PRAGMA table_info(Students);
```

## Common mistakes
- Using `INT` for a GPA like `3.85` — `INT` chops off the decimal part and stores `3`.
- Using `FLOAT` for money instead of `DECIMAL(10,2)` — floating-point numbers can produce tiny rounding errors like `19.9900000001`.
- Writing `VARCHAR(5)` for a city name like `'Istanbul'` (8 letters) — it gets rejected or truncated.

## Key terms
- SSMS | SQL Server Management Studio — the desktop IDE for SQL Server | SSMS
- data type | the kind of values a column can store (integer, decimal, text, date) | veri tipi
- NVARCHAR | SQL Server Unicode variable-length text type supporting Turkish characters | NVARCHAR
- DECIMAL(p,s) | exact fixed-point number with `p` total digits and `s` decimal places | DECIMAL

## Quick check
? Which SQL Server data type is best for storing Turkish student names like `Çağla Şahin`?
- `INT` ~~ `INT` only stores whole numbers.
- `VARCHAR(50)` ~~ Non-Unicode `VARCHAR` can lose Turkish characters depending on collation.
* `NVARCHAR(50)` ~~ `NVARCHAR` stores Unicode text safely.
- `BIT` ~~ `BIT` only stores `0` or `1`.
! Use `NVARCHAR` in SQL Server whenever text may contain Turkish or other Unicode characters.

? What does `DECIMAL(5, 2)` allow you to store?
- Up to 5 digits *after* the decimal point ~~ The second number (2) is the digits after the decimal point.
* Up to 5 digits total, with 2 digits after the decimal point (e.g. `123.45`) ~~ Precision = 5, scale = 2.
- Only whole numbers up to 52 ~~ `DECIMAL` stores fractional numbers.
- 5 text characters ~~ `DECIMAL` is numeric, not text.
! In `DECIMAL(p, s)`, `p` is total digits and `s` is digits after the decimal point.

? Which SQLite/SQL statement creates a new database in SQL Server?
- `NEW DATABASE UniversityDB;` ~~ Not valid SQL.
* `CREATE DATABASE UniversityDB;` ~~ `CREATE DATABASE` is the standard DDL statement in SQL Server.
- `INSERT DATABASE UniversityDB;` ~~ `INSERT` adds rows to a table.
- `SELECT DATABASE UniversityDB;` ~~ `SELECT` reads data.
! Use `CREATE DATABASE <name>;` followed by `USE <name>;` in SQL Server.
