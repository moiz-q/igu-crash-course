---
id: db-01
title: Data, information, file systems and databases
goal: explain the difference between data and information and why databases replaced flat file systems
week: 1
minutes: 15
---

Every app you use — a university portal, a bank, an online shop — needs to store facts and find them again later. Before databases existed, programs saved data in plain text or binary files. That caused big problems as data grew.


@widget viz name=db-table

## Data vs information

- **Data (*veri*):** Raw, unprocessed facts with no context on their own. Example: `85`, `Deniz`, `CMP153`.
- **Information (*bilgi*):** Data that has been organized, given context, or processed so it means something to a person. Example: *"Deniz Aksoy scored 85 in CMP153 (Programming Basics I), which is above the class average of 78."*

| Raw data | Organized information |
| --- | --- |
| `2026-09-14`, `3.80`, `Ece` | Ece joined in 2026 and has a 3.80 GPA (Honour list) |
| `37`, `Istanbul`, `24` | 14 of the 24 students live in Istanbul |

## Problems with file-based storage

In a **file system**, each department or program keeps its own separate files (for example, `registrations.csv` for the registrar and `grades.csv` for the department). Five problems appear quickly:

1. **Data redundancy (*veri tekrarı*):** The same student's name and address are stored in 3 or 4 different files, wasting disk space.
2. **Data inconsistency (*veri tutarsızlığı*):** When a student changes their email in one file, the other files still hold the old email.
3. **Isolation:** Data is scattered in different formats, so combining student records with course grades takes custom code every time.
4. **No concurrent control:** If two staff members edit the same file at the same moment, one person's changes overwrite the other's.
5. **Weak security:** It is hard to let a clerk see a student's name without also letting them see salaries or grades in the same file.

## What a database is

A **database** (*veritabanı*) is an organized, shared collection of related data stored electronically. Instead of every program inventing its own file format, one central system manages the data, enforces rules (like "every enrollment must belong to a real student"), and lets many users query it safely at once.

## Try it

Look at our live sample university database below. Press **Run** to see how one query pulls clean information from the `Students` table.

```sql run
SELECT first_name, last_name, city, gpa
FROM Students
WHERE city = 'Istanbul'
ORDER BY gpa DESC
LIMIT 5;
```

## Common mistakes
- Using *data* and *information* as exact synonyms in a written exam — always contrast raw facts vs processed, meaningful output.
- Thinking a spreadsheet file on your desktop is a full database system — a single file lacks multi-user concurrency, strict relational constraints and fine-grained security.

## Key terms
- data | raw, unprocessed facts such as numbers, dates or names | veri
- information | processed, structured data with meaning and context | bilgi
- data redundancy | storing the same fact unnecessarily in multiple places | veri tekrarı
- data inconsistency | conflicting copies of the same fact in different files | veri tutarsızlığı
- database | an organized, shared collection of related data | veritabanı

## Quick check
? Which of the following is an example of **information** rather than raw **data**?
- `3.45` ~~ A bare number with no label or context is raw data.
- `'Istanbul'` ~~ A single city name on its own is raw data.
* "The average GPA of Computer Programming students is 3.21." ~~ It summarizes and gives meaning to raw records.
- `2026` ~~ A standalone year has no context.
! Data becomes information when it is processed, labelled or summarized to answer a question.

? A student updates their phone number in the library file, but the registrar's file still has the old number. Which file-system problem is this?
- Data encryption ~~ Encryption protects data by scrambling it.
* Data inconsistency ~~ Duplicated data in separate files got out of sync.
- Normalization ~~ Normalization is a database design technique that prevents this problem.
- Atomicity ~~ Atomicity is a transaction property.
! Redundancy (storing the same fact in multiple files) leads directly to inconsistency when one copy is updated.

? Which is a major advantage of a database over separate flat files?
- It never needs backups ~~ Databases still require regular backups.
* Centralized control reduces redundancy and enforces rules across all users ~~ One system manages sharing, security and consistency.
- It stores everything as a single unformatted text line ~~ Databases store structured tables, rows and columns.
- Only one user can read it per day ~~ Databases support many concurrent users.
! A database centralizes storage so multiple applications share consistent, rule-checked data.
