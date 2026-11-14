---
title: DBMS I — Final Mock Exam (All Topics)
minutes: 120
---

## Question 1 (15 pts) — `DELETE` vs `TRUNCATE` vs `DROP`

Explain the differences between `DELETE FROM Students`, `TRUNCATE TABLE Students`, and `DROP TABLE Students` in terms of: (a) SQL group (DML/DDL), (b) `WHERE` support, (c) table structure, and (d) `IDENTITY` counter in SQL Server.

:::reveal Show model answer
- **`DELETE FROM Students`:** DML; supports `WHERE` to remove specific rows; keeps the table structure; does **not** reset `IDENTITY`.
- **`TRUNCATE TABLE Students`:** DDL; cannot use `WHERE` (removes all rows fast); keeps the empty table structure; **resets** `IDENTITY` back to seed.
- **`DROP TABLE Students`:** DDL; no `WHERE`; deletes **both** all rows and the table structure itself.
:::

:::rubric Question 1 marking checklist
- Correctly classifies DML (`DELETE`) vs DDL (`TRUNCATE`, `DROP`)
- Mentions `WHERE` support, table structure retention, and `IDENTITY` reset
:::

## Question 2 (20 pts) — Normalization to 3NF

Take `Invoice(<u>inv_no</u>, <u>prod_id</u>, inv_date, cust_id, cust_city, prod_name, unit_price, qty)` (already in 1NF) to **3NF**.

:::reveal Show model answer
- **2NF:**
  - `Invoices(<u>inv_no</u>, inv_date, cust_id, cust_city)`
  - `Products(<u>prod_id</u>, prod_name, unit_price)`
  - `InvoiceLines(<u>inv_no</u>, <u>prod_id</u>, qty)`
- **3NF:**
  - `Customers(<u>cust_id</u>, cust_city)`
  - `Invoices(<u>inv_no</u>, inv_date, cust_id)`
  - `Products(<u>prod_id</u>, prod_name, unit_price)`
  - `InvoiceLines(<u>inv_no</u>, <u>prod_id</u>, qty)`
:::

:::rubric Question 2 marking checklist
- Removes partial dependencies on `inv_no` and `prod_id` (2NF)
- Removes transitive dependency `inv_no → cust_id → cust_city` (3NF)
:::

## Question 3 (35 pts) — Writing SQL queries

Using the university schema (`Departments`, `Instructors`, `Students`, `Courses`, `Enrollments`):

1. List `first_name`, `last_name` and `gpa` of students in `'Istanbul'` with `gpa >= 3.5` or `gpa IS NULL`, ordered by `last_name`.
2. List each `dept_name` and the number of students in it (including departments with 0 students).
3. List `first_name`, `last_name` of students who have **never** enrolled in any course (using `LEFT JOIN` or `NOT EXISTS`).
4. Using a subquery, list `first_name`, `last_name` and `salary` of instructors who earn more than the average instructor salary.

:::reveal Show model answer
```sql
-- 1.
SELECT first_name, last_name, gpa
FROM Students
WHERE city = 'Istanbul' AND (gpa >= 3.5 OR gpa IS NULL)
ORDER BY last_name;

-- 2.
SELECT d.dept_name, COUNT(s.student_id) AS student_count
FROM Departments d
LEFT JOIN Students s ON d.dept_id = s.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY student_count DESC;

-- 3.
SELECT s.first_name, s.last_name
FROM Students s
LEFT JOIN Enrollments e ON s.student_id = e.student_id
WHERE e.enrollment_id IS NULL;

-- 4.
SELECT first_name, last_name, salary
FROM Instructors
WHERE salary > (SELECT AVG(salary) FROM Instructors)
ORDER BY salary DESC;
```
:::

:::rubric Question 3 marking checklist
- Query 1 uses parentheses around `OR` and uses `IS NULL` (not `= NULL`)
- Query 2 uses `LEFT JOIN` and `COUNT(s.student_id)` (not `COUNT(*)`)
- Query 3 correctly finds unmatched students via `LEFT JOIN ... IS NULL` or `NOT EXISTS`
- Query 4 compares `salary > (SELECT AVG(salary) FROM Instructors)`
:::

## Question 4 (15 pts) — DCL & Least Privilege

Write T-SQL statements to:
1. Give `clerk_role` permission to `SELECT` and `UPDATE` on `Students`.
2. Ensure user `intern_ali` (who is in `clerk_role`) can **never** `UPDATE` `Students`.

:::reveal Show model answer
```sql
GRANT SELECT, UPDATE ON Students TO clerk_role;
DENY UPDATE ON Students TO intern_ali;
```
(`DENY` overrides the `GRANT` inherited from `clerk_role`.)
:::

:::rubric Question 4 marking checklist
- Uses `GRANT SELECT, UPDATE ON Students TO clerk_role`
- Uses `DENY UPDATE ON Students TO intern_ali` (not `REVOKE`)
:::

## Question 5 (15 pts) — Transactions (ACID) & Backup

1. Explain what **Atomicity** and **Durability** mean in ACID.
2. You have a Sunday Full backup and daily Differential backups (Mon–Thu). The server fails on Friday. Which backups do you restore, and in what order?

:::reveal Show model answer
1. **Atomicity:** all steps in a transaction succeed together, or all are rolled back on failure. **Durability:** once `COMMIT` succeeds, changes are permanently saved and survive crashes.
2. Restore **Sunday's Full** backup first, then **Thursday's Differential** backup (since differential backups are cumulative since the last full backup).
:::

:::rubric Question 5 marking checklist
- Defines Atomicity (all-or-nothing) and Durability (survives crashes after COMMIT)
- Restores Sunday Full + Thursday Differential only (in that order)
:::
