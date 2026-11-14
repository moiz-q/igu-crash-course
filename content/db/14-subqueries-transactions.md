---
id: db-14
title: Subqueries and transactions (ACID)
goal: write subqueries in WHERE and FROM (with IN and EXISTS) and explain BEGIN, COMMIT, ROLLBACK and ACID
week: 14
minutes: 25
---

## Subqueries (nested queries)

A **subquery** is a `SELECT` inside parentheses `( ... )` used inside another query.

1. **Scalar subquery in `WHERE`:** returns a single value (e.g. an average).
```sql run
-- Students whose GPA is above the overall average GPA
SELECT first_name, last_name, gpa
FROM Students
WHERE gpa > (SELECT AVG(gpa) FROM Students)
ORDER BY gpa DESC;
```

2. **`IN` and `EXISTS`:** test whether a value is in a subquery's list, or whether any matching row exists.
```sql run
-- Students who have at least one enrollment with grade >= 90
SELECT first_name, last_name
FROM Students s
WHERE EXISTS (
    SELECT 1 FROM Enrollments e
    WHERE e.student_id = s.student_id AND e.grade >= 90
);
```

3. **Subquery in `FROM` (derived table):** treat a query result like a temporary table.
```sql run
SELECT ROUND(AVG(course_avg), 2) AS avg_of_course_avgs
FROM (
    SELECT course_id, AVG(grade) AS course_avg
    FROM Enrollments
    WHERE grade IS NOT NULL
    GROUP BY course_id
);
```

## Transactions (`BEGIN`, `COMMIT`, `ROLLBACK`)

A **transaction** (*işlem*) groups multiple SQL statements into **one all-or-nothing unit** — like transferring 500 TL from Account A to Account B (subtract from A AND add to B).

- `BEGIN TRANSACTION` (SQLite: `BEGIN`, SQL Server: `BEGIN TRAN`): starts a transaction.
- `COMMIT`: saves all changes permanently.
- `ROLLBACK`: undoes every change since `BEGIN`, leaving the database as if nothing happened.

```sql run
BEGIN;
UPDATE Instructors SET salary = salary + 5000 WHERE instructor_id = 1;
-- Oops, changed our mind! Undo it:
ROLLBACK;

SELECT instructor_id, first_name, salary FROM Instructors WHERE instructor_id = 1;
```

## ACID properties in plain words

| Letter | Property | Meaning |
| --- | --- | --- |
| **A** | **Atomicity** (*Bölünmezlik*) | All-or-nothing: either every step in the transaction succeeds, or all of them roll back. |
| **C** | **Consistency** (*Tutarlılık*) | Every transaction leaves the database valid (all constraints, PKs, FKs and balances hold). |
| **I** | **Isolation** (*Yalıtım*) | Concurrent transactions do not interfere with each other's half-finished work. |
| **D** | **Durability** (*Kalıcılık*) | Once `COMMIT` succeeds, the data survives a power cut or crash. |

## Try it

Solve the subquery challenges below.

@widget challenges lesson=db-14

## Common mistakes
- Using `=` with a subquery that returns more than 1 row (`WHERE dept_id = (SELECT dept_id FROM ...)` crashes if the subquery returns 2+ rows — use `IN` instead).
- Forgetting `ROLLBACK` or `COMMIT` in SSMS after `BEGIN TRAN` — an open transaction holds locks and blocks other users!

## Key terms
- subquery | a `SELECT` query nested inside another SQL statement | alt sorgu
- transaction | a group of SQL steps executed as one all-or-nothing unit | işlem (transaction)
- COMMIT | permanently saves all changes made in the current transaction | onaylama (COMMIT)
- ROLLBACK | undoes all changes made since `BEGIN` | geri alma (ROLLBACK)
- ACID | Atomicity, Consistency, Isolation, Durability | ACID özellikleri

## Quick check
? A subquery inside `WHERE dept_id = (SELECT ...)` returns 3 rows. What happens?
- SQL picks the first row ~~ SQL raises an error instead of guessing.
* The query fails because `=` expects a single scalar value ~~ Use `IN (...)` when a subquery can return multiple rows.
- SQL averages the 3 rows ~~ It does not aggregate automatically.
- It returns all rows of the table ~~ It raises a multi-row subquery error.
! Use `=` only for scalar (1-row, 1-column) subqueries; use `IN` or `EXISTS` for multi-row subqueries.

? Which ACID property guarantees *"either all steps of the bank transfer happen, or none of them happen"*?
* Atomicity ~~ Atomicity means indivisible ("all or nothing").
- Consistency ~~ Consistency means constraints and rules remain valid.
- Isolation ~~ Isolation keeps concurrent transactions separated.
- Durability ~~ Durability means committed data survives crashes.
! Atomicity = all or nothing.

? You ran `BEGIN TRAN; DELETE FROM Enrollments;` and immediately realize you forgot `WHERE`. How do you restore the rows?
- `COMMIT;` ~~ `COMMIT` makes the deletion permanent!
* `ROLLBACK;` ~~ `ROLLBACK` undoes everything since `BEGIN TRAN`.
- `REVOKE;` ~~ `REVOKE` is a DCL permission command.
- `TRUNCATE TABLE Enrollments;` ~~ `TRUNCATE` also empties the table.
! `ROLLBACK` cancels all uncommitted changes back to `BEGIN`.
