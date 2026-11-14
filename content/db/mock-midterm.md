---
title: DBMS I — Midterm Mock Exam (Weeks 1–6)
minutes: 90
---

## Question 1 (15 pts) — Data, DBMS and architectures

1. Explain the difference between **data** and **information** using your own short example.
2. Name **three** problems of flat file systems that a DBMS solves.
3. What are the three levels of the **ANSI-SPARC** architecture, and what does each level describe?

:::reveal Show model answer
1. **Data** is raw, unprocessed facts (e.g. `82, 90, 74`). **Information** is data given context and meaning (e.g. *"The class average in CMP151 is 82.0"*).
2. Any three of: **data redundancy** (duplicate copies), **data inconsistency** (copies disagree), **data isolation**, **lack of concurrency control**, **weak security**.
3. **External level** (customized user views), **Conceptual level** (the complete logical schema of all tables, types and relationships), **Internal level** (how data is physically stored on disk in files and indexes).
:::

:::rubric Question 1 marking checklist
- Contrasts raw facts vs processed/meaningful output with an example
- Lists 3 genuine flat-file problems
- Names External, Conceptual and Internal levels accurately
:::

## Question 2 (25 pts) — ER diagram design

A university clinic needs a database:
- Doctors have an ID, full name, specialty and phone. Each doctor belongs to one clinic branch (branch ID, name, city).
- Patients have an ID, full name and birth date.
- Patients book appointments with doctors; each appointment records the date/time and a diagnosis note.

List the **entities**, **attributes**, **Primary Keys (PK)**, **Foreign Keys (FK)** and **cardinalities** (1:1, 1:N, M:N).

:::reveal Show model answer
- **Branches** (`*branch_id` PK, `branch_name`, `city`)
- **Doctors** (`*doctor_id` PK, `full_name`, `specialty`, `phone`, `branch_id` FK → Branches)
- **Patients** (`*patient_id` PK, `full_name`, `birth_date`)
- **Appointments** (`*appt_id` PK, `patient_id` FK → Patients, `doctor_id` FK → Doctors, `appt_datetime`, `diagnosis`)
- **Cardinalities:** `Branches` **1:N** `Doctors`; `Patients` **M:N** `Doctors`, resolved via `Appointments` (`Patients` 1:N `Appointments`, `Doctors` 1:N `Appointments`).
:::

:::rubric Question 2 marking checklist
- Identifies all 4 entities (Branches, Doctors, Patients, Appointments)
- Marks PKs and puts `branch_id` FK in Doctors (on the N side)
- Resolves the M:N between Patients and Doctors with Appointments
:::

## Question 3 (35 pts) — Normalization (UNF → 3NF)

Normalize this table to **1NF**, **2NF**, and **3NF**:
`ProjectLog(emp_id, emp_name, dept_id, dept_name, projects)` where `projects` holds `"P1: Web (10h), P2: Mobile (5h)"`.

:::reveal Show model answer
- **1NF** (atomic cells, composite PK `(emp_id, proj_id)`):
  `ProjectLog_1NF(<u>emp_id</u>, <u>proj_id</u>, proj_name, hours, emp_name, dept_id, dept_name)`
- **2NF** (remove partial dependencies on `emp_id` and `proj_id`):
  - `Employees(<u>emp_id</u>, emp_name, dept_id, dept_name)`
  - `Projects(<u>proj_id</u>, proj_name)`
  - `Assignments(<u>emp_id</u>, <u>proj_id</u>, hours)`
- **3NF** (remove transitive dependency `emp_id → dept_id → dept_name` in `Employees`):
  - `Departments(<u>dept_id</u>, dept_name)`
  - `Employees(<u>emp_id</u>, emp_name, dept_id)` (FK → Departments)
  - `Projects(<u>proj_id</u>, proj_name)`
  - `Assignments(<u>emp_id</u>, <u>proj_id</u>, hours)`
:::

:::rubric Question 3 marking checklist
- 1NF splits multi-valued `projects` into rows with composite PK `(emp_id, proj_id)`
- 2NF separates `Employees`, `Projects`, and `Assignments`
- 3NF moves `dept_name` to `Departments` to remove the transitive dependency
:::

## Question 4 (25 pts) — `CREATE TABLE` with constraints (T-SQL or SQLite)

Write a `CREATE TABLE Books (...)` statement with:
- `book_id` as an auto-incrementing Primary Key,
- `isbn` as required (`NOT NULL`) and `UNIQUE` text,
- `title` as required Unicode text (up to 100 chars in T-SQL),
- `pages` as an integer that must be `> 0`,
- `status` as text defaulting to `'Available'`.

Then write one valid `INSERT INTO Books` statement.

:::reveal Show model answer
```sql
-- SQL Server (T-SQL):
CREATE TABLE Books (
    book_id INT PRIMARY KEY IDENTITY(1,1),
    isbn    VARCHAR(20) NOT NULL UNIQUE,
    title   NVARCHAR(100) NOT NULL,
    pages   INT CHECK (pages > 0),
    status  NVARCHAR(20) DEFAULT 'Available'
);

INSERT INTO Books (isbn, title, pages)
VALUES ('978-0-13-110362-7', 'C Programming', 272);
```
*(In SQLite, replace `INT PRIMARY KEY IDENTITY(1,1)` with `INTEGER PRIMARY KEY AUTOINCREMENT` and `NVARCHAR`/`VARCHAR` with `TEXT`.)*
:::

:::rubric Question 4 marking checklist
- Auto-incrementing `PRIMARY KEY` on `book_id`
- `NOT NULL` and `UNIQUE` on `isbn`, `NOT NULL` on `title`
- `CHECK (pages > 0)` and `DEFAULT 'Available'`
- Valid `INSERT INTO` omitting `book_id` (and optionally `status`)
:::
