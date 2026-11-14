---
id: db-05
title: Normalization (Part 2): 2NF and 3NF
goal: eliminate partial dependencies (2NF) and transitive dependencies (3NF) to produce clean tables
week: 4
minutes: 20
---

In Part 1 we reached **1NF** by putting one value per cell. Now we take one messy `EnrollmentsReport` table all the way from **UNF → 1NF → 2NF → 3NF** using the interactive stepper below.

## Second Normal Form (2NF)

A table is in **2NF** when:
1. It is already in **1NF**, AND
2. There are **no partial dependencies**: every non-key column must depend on the **whole** primary key, not just *part* of a composite key.
   - *(Shortcut: if a table's primary key is a single column, it is automatically in 2NF!)*

In our 1NF table with composite PK `(student_id, course_code)`:
- `grade` depends on BOTH `student_id` and `course_code` (good!).
- `student_name`, `dept_id`, `dept_name`, `building` depend **only on `student_id`** (partial dependency!).
- `course_title` depends **only on `course_code`** (partial dependency!).

So we split them out into `Students`, `Courses`, and `Enrollments`.

## Third Normal Form (3NF)

A table is in **3NF** when:
1. It is already in **2NF**, AND
2. There are **no transitive dependencies**: no non-key column may depend on *another non-key column*.
   - In plain words: *"Every non-key column must depend on the key, the whole key, and nothing but the key."*

In `Students(student_id, student_name, dept_id, dept_name, building)`:
- `student_id → dept_id → dept_name, building`.
- `dept_name` and `building` depend on `dept_id` (a non-key column!), not directly on `student_id`. That is a **transitive dependency**.
- Move `dept_id, dept_name, building` into a `Departments` table, leaving only `dept_id` as a Foreign Key in `Students`.

## Worked example: interactive stepper (UNF → 3NF)

Step through all four stages below to watch one messy table become four clean 3NF tables.

```stepper
{
  "title": "Normalizing a university grade sheet (UNF → 3NF)",
  "stages": [
    {
      "name": "UNF (Unnormalized)",
      "note": "Everything is crammed into one table, with comma-separated courses and grades inside single cells.",
      "tables": [
        {
          "name": "GradeSheet",
          "pk": ["student_id"],
          "cols": ["student_id", "student_name", "dept_id", "dept_name", "building", "courses_and_grades"],
          "rows": [
            ["1", "Deniz Aksoy", "D1", "Computer Prog.", "Block A", "CMP153 (85), CMP151 (90)"],
            ["2", "Ece Yildiz", "D1", "Computer Prog.", "Block A", "CMP153 (95)"]
          ]
        }
      ],
      "problem": "Multi-valued cells ('CMP153 (85), CMP151 (90)') violate 1NF and make querying or updating individual grades painful."
    },
    {
      "name": "1NF",
      "note": "Split multi-valued cells into one row per enrollment. Primary key is now composite: (student_id, course_code).",
      "tables": [
        {
          "name": "GradeSheet_1NF",
          "pk": ["student_id", "course_code"],
          "cols": ["student_id", "student_name", "dept_id", "dept_name", "building", "course_code", "course_title", "grade"],
          "rows": [
            ["1", "Deniz Aksoy", "D1", "Computer Prog.", "Block A", "CMP153", "Prog. Basics I", "85"],
            ["1", "Deniz Aksoy", "D1", "Computer Prog.", "Block A", "CMP151", "DBMS I", "90"],
            ["2", "Ece Yildiz", "D1", "Computer Prog.", "Block A", "CMP153", "Prog. Basics I", "95"]
          ]
        }
      ],
      "problem": "Partial dependencies! student_name and dept info depend only on student_id; course_title depends only on course_code — not on the whole key (student_id, course_code)."
    },
    {
      "name": "2NF",
      "note": "Move columns that depend on only part of the composite key into their own tables: Students, Courses and Enrollments.",
      "tables": [
        {
          "name": "Students",
          "pk": ["student_id"],
          "cols": ["student_id", "student_name", "dept_id", "dept_name", "building"],
          "rows": [
            ["1", "Deniz Aksoy", "D1", "Computer Prog.", "Block A"],
            ["2", "Ece Yildiz", "D1", "Computer Prog.", "Block A"]
          ]
        },
        {
          "name": "Courses",
          "pk": ["course_code"],
          "cols": ["course_code", "course_title"],
          "rows": [
            ["CMP153", "Prog. Basics I"],
            ["CMP151", "DBMS I"]
          ]
        },
        {
          "name": "Enrollments",
          "pk": ["student_id", "course_code"],
          "cols": ["student_id", "course_code", "grade"],
          "rows": [
            ["1", "CMP153", "85"],
            ["1", "CMP151", "90"],
            ["2", "CMP153", "95"]
          ]
        }
      ],
      "problem": "Transitive dependency in Students! dept_name and building depend on dept_id (a non-key column), not directly on student_id."
    },
    {
      "name": "3NF (Clean!)",
      "note": "Move dept_name and building into Departments, keeping dept_id as a Foreign Key in Students.",
      "tables": [
        {
          "name": "Departments",
          "pk": ["dept_id"],
          "cols": ["dept_id", "dept_name", "building"],
          "rows": [
            ["D1", "Computer Prog.", "Block A"]
          ]
        },
        {
          "name": "Students",
          "pk": ["student_id"],
          "cols": ["student_id", "student_name", "dept_id"],
          "rows": [
            ["1", "Deniz Aksoy", "D1"],
            ["2", "Ece Yildiz", "D1"]
          ]
        },
        {
          "name": "Courses",
          "pk": ["course_code"],
          "cols": ["course_code", "course_title"],
          "rows": [
            ["CMP153", "Prog. Basics I"],
            ["CMP151", "DBMS I"]
          ]
        },
        {
          "name": "Enrollments",
          "pk": ["student_id", "course_code"],
          "cols": ["student_id", "course_code", "grade"],
          "rows": [
            ["1", "CMP153", "85"],
            ["1", "CMP151", "90"],
            ["2", "CMP153", "95"]
          ]
        }
      ]
    }
  ]
}
```

## Try it

Normalize this `Orders` table (currently in 1NF) to **3NF**:
`OrderItems(<u>order_id</u>, <u>product_id</u>, order_date, customer_id, customer_city, product_name, qty)`

:::reveal Show 2NF and 3NF solution
- **Partial dependencies (fix for 2NF):** `order_date, customer_id, customer_city` depend only on `order_id`; `product_name` depends only on `product_id`.
  - `Orders(<u>order_id</u>, order_date, customer_id, customer_city)`
  - `Products(<u>product_id</u>, product_name)`
  - `OrderItems(<u>order_id</u>, <u>product_id</u>, qty)`
- **Transitive dependency (fix for 3NF):** In `Orders`, `customer_city` depends on `customer_id`, not directly on `order_id`.
  - `Customers(<u>customer_id</u>, customer_city)`
  - `Orders(<u>order_id</u>, order_date, customer_id)`
:::

## Common mistakes
- Thinking a table with a single-column Primary Key can fail 2NF — partial dependency only happens when the Primary Key has 2 or more columns.
- Stopping at 2NF when `zip_code → city` or `dept_id → dept_name` is still sitting inside a table (that is a transitive dependency and violates 3NF).

## Key terms
- partial dependency | a non-key column depending on only part of a composite PK | kısmi bağımlılık
- Second Normal Form (2NF) | in 1NF with no partial dependencies | İkinci Normal Form
- transitive dependency | a non-key column depending on another non-key column | geçişli bağımlılık
- Third Normal Form (3NF) | in 2NF with no transitive dependencies | Üçüncü Normal Form

## Quick check
? A table `Invoices(<u>invoice_id</u>, customer_id, customer_name, total)` has a single-column primary key `invoice_id`. Which normal form does it violate?
- 1NF ~~ Every cell is atomic and `invoice_id` is the PK.
- 2NF ~~ A single-column PK cannot have partial dependencies.
* 3NF ~~ `customer_name` depends on `customer_id` (a non-key column), which is a transitive dependency.
- None — it is already in 3NF ~~ `invoice_id → customer_id → customer_name` violates 3NF.
! Move `customer_id, customer_name` into a `Customers` table to reach 3NF.

? What does **2NF** forbid?
- Foreign keys ~~ Foreign keys are required to link normalized tables.
* Partial dependencies on part of a composite primary key ~~ Every non-key column must depend on the whole primary key.
- Having more than one table ~~ Normalization splits tables intentionally.
- NULL values ~~ 2NF is about key dependencies, not NULLs.
! 2NF eliminates partial dependencies (columns depending on only part of a composite PK).

? In the 3NF slogan *"the key, the whole key, and nothing but the key"*, what does *"nothing but the key"* refer to?
- 1NF ~~ 1NF is about atomic values.
- 2NF ~~ 2NF is *"the whole key"* (no partial dependencies).
* 3NF ~~ 3NF removes transitive dependencies so non-key columns depend *only* on the key.
- SQL `ORDER BY` ~~ `ORDER BY` is for sorting query output.
! 1NF = atomic + key; 2NF = whole key; 3NF = nothing but the key.
