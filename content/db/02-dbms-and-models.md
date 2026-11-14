---
id: db-02
title: DBMS, data models and architectures
goal: explain what a DBMS does, compare the main data models and describe the three-level and client–server architectures
week: 2
minutes: 15
---

A database is the collection of data itself. The software that creates, protects and queries that database is called a **DBMS (Database Management System)**. Examples include **Microsoft SQL Server**, **PostgreSQL**, **MySQL**, **Oracle** and **SQLite** (which powers the playground on this site).

## What a DBMS does

A DBMS sits between users/applications and the stored files on disk. It handles:
- **Defining structure:** creating tables, columns and data types.
- **Querying and updating:** running SQL commands to read or change rows.
- **Integrity and constraints:** rejecting invalid data (such as a negative credit count or a grade of 150).
- **Security:** controlling who can read or edit which tables.
- **Concurrency and recovery:** letting many users work at once without corrupting data, and recovering after a crash.

## Data models at a glance

A **data model** describes how data is structured and connected:

| Model | Shape | Notes |
| --- | --- | --- |
| **Hierarchical** | Tree (parent → children) | Fast for 1:N, rigid (each child has only 1 parent). Used in early mainframes. |
| **Network** | Graph (children can have multiple parents) | Flexible, but complex to navigate with pointers. |
| **Relational** | **Tables** (rows and columns) linked by keys | The standard model taught in this course (SQL Server, PostgreSQL, SQLite). |
| **NoSQL** | Documents (JSON), key–value, wide-column or graph | Built for massive scale or flexible schemas (e.g. MongoDB, Redis). |

## Three-level (ANSI-SPARC) architecture

To separate how users see data from how bytes are stored on disk, a DBMS uses three levels:

1. **External level (View level):** What each user or app is allowed to see (for example, a student sees only their own grades, while an advisor sees advisees' GPAs).
2. **Conceptual level (Logical level):** The whole database design — all tables, columns, data types and relationships.
3. **Internal level (Physical level):** How the data is actually stored on disk (files, pages, indexes).

This separation gives **data independence**: you can move files to a faster disk (internal) without breaking SQL queries (conceptual) or user screens (external).

## Client–server architecture

In most real systems (including **SQL Server**), the **DBMS runs on a server** machine. Your application, SSMS (SQL Server Management Studio) or a web backend acts as a **client** that sends SQL requests over the network and receives result tables back. (SQLite is an exception: it is an *embedded* library that runs inside the app itself.)

## Try it

Run this query to inspect the tables stored in our relational database (`sqlite_master` is SQLite's system catalog).

```sql run
SELECT name, type
FROM sqlite_master
WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
ORDER BY name;
```

## Common mistakes
- Confusing **database** (the data) with **DBMS** (the software like SQL Server or MySQL).
- Mixing up the **external** level (individual user views) with the **conceptual** level (the full logical schema of all tables).

## Key terms
- DBMS | Database Management System — software that manages databases | Veritabanı Yönetim Sistemi (VTYS)
- relational model | data model storing records in tables linked by keys | ilişkisel model
- conceptual level | the complete logical structure of tables and relationships | kavramsal düzey
- data independence | ability to change storage or schema without breaking apps | veri bağımsızlığı

## Quick check
? Which of the following is a **DBMS** rather than a data model?
- Relational ~~ Relational is a data model.
- Hierarchical ~~ Hierarchical is a data model.
* Microsoft SQL Server ~~ SQL Server is DBMS software that implements the relational model.
- NoSQL ~~ NoSQL is a family of non-relational data models.
! A DBMS is the software product (SQL Server, PostgreSQL, SQLite); a data model is the structural concept.

? Which level of the three-level architecture defines how bytes and indexes are physically stored on disk?
- External level ~~ External level defines tailored user views.
- Conceptual level ~~ Conceptual level defines all tables and relationships logically.
* Internal level ~~ Internal (physical) level handles files, storage blocks and indexes.
- Application level ~~ Not one of the three ANSI-SPARC levels.
! The three ANSI-SPARC levels are external (views), conceptual (logical schema) and internal (physical storage).

? In the relational model, how is data organized?
- As a strict single-parent tree ~~ That is the hierarchical model.
* As tables made of rows (records) and columns (attributes) ~~ Tables are linked by primary and foreign keys.
- As unlinked plain text files ~~ Flat files lack relational structure.
- Only as JSON documents ~~ JSON documents belong to document-based NoSQL databases.
! Relational databases store data in two-dimensional tables (relations) linked by keys.
