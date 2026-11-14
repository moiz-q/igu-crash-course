---
title: Database Management Systems I (SQL) — Cheat Sheet
---

## 1. SQL command groups

| Group | Meaning | Commands |
| --- | --- | --- |
| **DDL** | Structure (tables, columns) | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data (rows) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | Permissions | `GRANT`, `REVOKE`, `DENY` |
| **TCL** | Transactions | `BEGIN` (`BEGIN TRAN`), `COMMIT`, `ROLLBACK` |

## 2. `SELECT` clause order (memorize this!)

```sql
SELECT DISTINCT cols        -- 5. pick columns / expressions
FROM table1 t1              -- 1. starting table
JOIN table2 t2 ON ...       -- 2. combine related tables
WHERE row_condition         -- 3. filter individual rows (no aggregates!)
GROUP BY group_cols         -- 4. form buckets
HAVING group_condition      -- 4b. filter buckets (aggregates allowed)
ORDER BY col ASC | DESC     -- 6. sort output
LIMIT n;                    -- 7. (SQL Server: SELECT TOP n ...)
```

## 3. JOIN types

@widget venn types=inner,left,right

- `INNER JOIN`: only matching rows in both tables.
- `LEFT JOIN`: all left rows + matching right rows (`NULL` if no match).
- `RIGHT JOIN`: all right rows + matching left rows (`NULL` if no match).

## 4. Table constraints

| Constraint | Purpose |
| --- | --- |
| `PRIMARY KEY` | Unique + `NOT NULL`; identifies each row |
| `FOREIGN KEY` | Must match an existing PK in the parent table |
| `NOT NULL` | Column cannot be empty (`NULL`) |
| `UNIQUE` | No duplicate non-NULL values |
| `DEFAULT val` | Value used if omitted on `INSERT` |
| `CHECK (cond)` | Row must satisfy `cond` |

## 5. Normalization in one line each

- **1NF:** Every cell has **one atomic value** (no lists, no repeating columns) and the table has a Primary Key.
- **2NF:** In 1NF + **no partial dependencies** (every non-key column depends on the *whole* PK).
- **3NF:** In 2NF + **no transitive dependencies** (no non-key column depends on another non-key column).

## 6. `DELETE` vs `TRUNCATE` vs `DROP`

| Feature | `DELETE FROM T` | `TRUNCATE TABLE T` | `DROP TABLE T` |
| --- | --- | --- | --- |
| Group | DML | DDL | DDL |
| `WHERE` allowed? | Yes | No (all rows) | No (whole table) |
| Keeps structure? | Yes | Yes | **No** |
| Resets `IDENTITY`? | No | Yes | N/A |

## 7. SQLite (this site) vs SQL Server (T-SQL)

| Feature | SQLite | SQL Server (T-SQL) |
| --- | --- | --- |
| Limit rows | `SELECT ... LIMIT 5` | `SELECT TOP 5 ...` |
| Auto-number PK | `INTEGER PRIMARY KEY AUTOINCREMENT` | `INT PRIMARY KEY IDENTITY(1,1)` |
| Current date | `date('now')` | `GETDATE()` |
| Unicode text | `TEXT` | `NVARCHAR(n)` |
| String length | `LENGTH(s)` | `LEN(s)` |
| Start transaction | `BEGIN;` | `BEGIN TRAN;` |
| Empty all rows | `DELETE FROM T;` | `TRUNCATE TABLE T;` |
