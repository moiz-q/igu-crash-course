---
id: db-03
title: Data modeling and ER diagrams
goal: read and design Entity-Relationship (ER) diagrams with entities, attributes, keys and cardinalities (1:1, 1:N, M:N)
week: 3
minutes: 25
---

Before you write a single `CREATE TABLE`, you design the database on paper. Database design moves through three stages:
1. **Conceptual design:** Identify the real-world things (**entities**) and how they relate, independent of any software. This produces an **ER diagram**.
2. **Logical design:** Turn the ER diagram into tables, columns, primary keys and foreign keys (and normalize them).
3. **Physical design:** Choose exact data types (e.g. `INT`, `VARCHAR(50)`), indexes and storage in a specific DBMS like SQL Server.

## Entities, attributes and keys

- **Entity (*varlık*):** A thing we store data about, such as `Students`, `Courses`, or `Departments`. An entity becomes a **table**.
- **Attribute (*nitelik*):** A property of an entity, such as `first_name`, `city`, or `credits`. Attributes become **columns**.
- **Primary Key (PK, *birincil anahtar*):** A column (or group of columns) that **uniquely identifies** every row in a table, e.g. `student_id`. Never NULL, never duplicated.
- **Foreign Key (FK, *yabancı anahtar*):** A column in one table that points to the Primary Key of another table to create a link, e.g. `Students.dept_id` → `Departments.dept_id`.

## Cardinality: 1:1, 1:N and M:N

**Cardinality** (*kardinalite*) states how many rows of one entity can link to how many rows of another:
- **1:1 (One-to-One):** One person has one passport; one passport belongs to one person.
- **1:N (One-to-Many):** One department has many students, while each student belongs to one department. Put the FK (`dept_id`) on the **N (many)** side (`Students`).
- **M:N (Many-to-Many):** One student takes many courses, AND one course has many students. **Relational databases cannot store M:N directly between two tables!** You resolve an M:N relationship by adding a **junction table** (bridge table) in the middle — here, `Enrollments` — with FKs to both tables.

## Worked example: our university ER diagram

```erd
Departments: *dept_id, dept_name, building
Instructors: *instructor_id, first_name, last_name, dept_id (FK)
Students: *student_id, first_name, last_name, city, dept_id (FK)
Courses: *course_id, course_code, title, credits, dept_id (FK), instructor_id (FK)
Enrollments: *enrollment_id, student_id (FK), course_id (FK), semester, grade

Departments 1--N Students : belongs to
Departments 1--N Courses : offers
Students 1--N Enrollments : registers
Courses 1--N Enrollments : has
Instructors 1--N Courses : teaches
```

Notice how `Students` and `Courses` have an **M:N** relationship, resolved by `Enrollments` (1:N from `Students` and 1:N from `Courses`).

## Try it

Read each short scenario, write down the entities, attributes, PKs, FKs and relationships on paper, then open the model answer to check.

### Scenario 1: Library
A library has books (with ISBN, title, year) and members (member ID, name, phone). A member can borrow many books over time, and a book copy can be borrowed by many members over time; each loan records the borrow date and return date.

:::reveal Show model ERD (Library)
- **Books** (`*book_id`, `isbn`, `title`, `pub_year`)
- **Members** (`*member_id`, `full_name`, `phone`)
- **Loans** (`*loan_id`, `member_id` FK → Members, `book_id` FK → Books, `borrow_date`, `return_date`)
- Relationships: `Members` **1:N** `Loans`, `Books` **1:N** `Loans` (resolving the **M:N** between Members and Books).
:::

### Scenario 2: Hospital
A hospital has departments (e.g. Cardiology) and doctors. Each doctor works in one department. Patients book appointments with doctors; each appointment has a date, time and notes.

:::reveal Show model ERD (Hospital)
- **Departments** (`*dept_id`, `dept_name`)
- **Doctors** (`*doctor_id`, `full_name`, `specialty`, `dept_id` FK → Departments)
- **Patients** (`*patient_id`, `full_name`, `birth_date`, `phone`)
- **Appointments** (`*appt_id`, `patient_id` FK → Patients, `doctor_id` FK → Doctors, `appt_datetime`, `notes`)
- Relationships: `Departments` **1:N** `Doctors`; `Patients` **M:N** `Doctors` resolved via `Appointments`.
:::

### Scenario 3: Online shop
Customers place orders. Each order belongs to one customer and has an order date. An order can contain many products, and a product can appear in many orders, with a quantity and unit price for each line.

:::reveal Show model ERD (Online shop)
- **Customers** (`*customer_id`, `full_name`, `email`, `city`)
- **Orders** (`*order_id`, `customer_id` FK → Customers, `order_date`)
- **Products** (`*product_id`, `name`, `stock_qty`, `current_price`)
- **OrderItems** (`*order_item_id`, `order_id` FK → Orders, `product_id` FK → Products, `quantity`, `unit_price`)
- Relationships: `Customers` **1:N** `Orders`; `Orders` **M:N** `Products` resolved via `OrderItems`.
:::

## Common mistakes
- Trying to put `course_id_1, course_id_2, course_id_3` columns inside `Students` instead of creating a junction table (`Enrollments`) for an M:N relationship.
- Putting the Foreign Key on the **1** side instead of the **N (many)** side of a 1:N relationship.
- Using a person's name or email as a Primary Key when names can repeat or emails can change — a surrogate integer ID (`student_id`) is safer.

## Key terms
- entity | a real-world object or concept represented as a table | varlık
- attribute | a property or column of an entity | nitelik
- primary key | a column (or set) that uniquely identifies each row | birincil anahtar
- foreign key | a column referencing the primary key of another table | yabancı anahtar
- junction table | a bridge table that resolves an M:N relationship into two 1:N links | ara tablo (bağlantı tablosu)

## Quick check
? One `Instructor` teaches many `Courses`, and each `Course` is taught by one `Instructor`. Where should the Foreign Key go?
- `instructor_id` in `Courses` and `course_id` in `Instructors` ~~ Only one side needs the FK in a 1:N relationship.
* `instructor_id` inside the `Courses` table ~~ The FK always goes on the "many" (N) side.
- `course_id` inside the `Instructors` table ~~ That would limit an instructor to a single course.
- A new junction table is required ~~ Junction tables are for M:N, not 1:N.
! In a 1:N relationship, place the Foreign Key on the "many" (N) side (`Courses`).

? How do you represent a Many-to-Many (M:N) relationship between `Students` and `Courses` in relational tables?
- Add `course_id` to `Students` ~~ One column can hold only one course ID per student.
- Add `student_id` to `Courses` ~~ One column can hold only one student ID per course.
* Create a junction table (e.g. `Enrollments`) with foreign keys to both `Students` and `Courses` ~~ This splits M:N into two 1:N relationships.
- Merge `Students` and `Courses` into one big table ~~ That causes massive data redundancy.
! M:N relationships are always resolved with a junction table containing FKs to both entities.

? Which stage of database design creates the ER diagram, independent of any specific DBMS software?
* Conceptual design ~~ Conceptual design models entities and relationships before picking a DBMS.
- Physical design ~~ Physical design chooses DBMS-specific types, indexes and storage.
- Backup design ~~ Backup is an operational task, not a modeling stage.
- Query tuning ~~ Query tuning happens after tables exist.
! The three modeling stages are Conceptual (ER) → Logical (tables/normalization) → Physical (DBMS types/indexes).
