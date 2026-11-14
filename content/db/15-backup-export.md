---
id: db-15
title: Backup, restore and exporting data
goal: compare full and differential backups, understand restore and export data to CSV or SQL scripts
week: 15
minutes: 15
---

Hardware fails, disks die, and humans accidentally run `DELETE` without `WHERE`. A **backup** is your safety net.

## Full vs differential backup

| Type | What it copies | Speed & size | Restore steps |
| --- | --- | --- | --- |
| **Full backup** (*Tam yedek*) | The **entire** database | Slower, largest file | Restore just this 1 file |
| **Differential backup** (*Fark yedeği*) | Only data changed **since the last full backup** | Faster, smaller | Restore the **last full** backup + the **latest differential** backup |

*(In SQL Server, there is also a **Transaction Log backup** for point-in-time recovery, e.g. restoring to 14:29 right before a bad `DELETE` at 14:30.)*

:::tsql Backup and restore in SQL Server
In SSMS: right-click the database › **Tasks › Back Up…** (or **Restore › Database…**). In T-SQL:
```sql
BACKUP DATABASE UniversityDB
TO DISK = 'C:\Backups\UniversityDB_full.bak';

-- Differential backup later:
BACKUP DATABASE UniversityDB
TO DISK = 'C:\Backups\UniversityDB_diff.bak'
WITH DIFFERENTIAL;
```
:::

## Exporting data and generating scripts

Often you need to share data with someone who uses Excel, or move a database structure to another server:
- **Export to CSV / Excel:** In SSMS, right-click the database › **Tasks › Export Data…** (or right-click a query result grid › **Save Results As…** `.csv`). A **CSV** (*Comma-Separated Values*) file opens directly in Excel.
- **Generate SQL Scripts:** Right-click the database › **Tasks › Generate Scripts…** to export `CREATE TABLE` statements (schema only, or schema + `INSERT` data) as a `.sql` text file.

## Try it

Run this query, which produces a clean summary table ready to export to CSV for an academic advisor.

```sql run
SELECT
    s.student_id,
    s.first_name || ' ' || s.last_name AS full_name,
    d.dept_name,
    COALESCE(CAST(s.gpa AS TEXT), 'N/A') AS gpa
FROM Students s
JOIN Departments d ON s.dept_id = d.dept_id
ORDER BY d.dept_name, s.last_name;
```

## Common mistakes
- Keeping backups on the **same** physical disk or server as the live database — if that disk dies or is hit by ransomware, both are lost.
- Taking differential backups without ever testing a **restore** — an untested backup is not a reliable backup.
- Trying to restore *only* a differential backup without restoring the base full backup first.

## Key terms
- full backup | a complete copy of the entire database | tam yedek
- differential backup | a copy of all changes since the last full backup | fark yedeği
- restore | loading a backup file to recover a database | geri yükleme
- CSV | Comma-Separated Values — plain-text table format opened by Excel | CSV (virgülle ayrılmış değerler)

## Quick check
? You took a **Full** backup on Sunday, and **Differential** backups on Monday, Tuesday and Wednesday. The server crashes on Thursday morning. What do you need to restore?
- Sunday full + Monday diff + Tuesday diff + Wednesday diff ~~ Differential backups are cumulative since the last full backup, so Wednesday's already includes Monday and Tuesday.
* Sunday **full** backup + Wednesday **differential** backup ~~ Only the last full and the latest differential are needed.
- Only Wednesday's differential backup ~~ A differential backup cannot be restored without its base full backup.
- Only Monday's differential backup ~~ You would lose Tuesday and Wednesday's changes.
! To restore with differential backups, restore the latest **full** backup first, then the **latest** differential backup.

? Which format is best for exporting a `SELECT` result so a colleague can open it directly in Microsoft Excel?
- `.bak` ~~ `.bak` is a binary SQL Server backup file.
* `.csv` ~~ CSV is plain-text tabular data that Excel opens directly.
- `.exe` ~~ `.exe` is a Windows program, not data.
- `.pkt` ~~ `.pkt` is a Cisco Packet Tracer file.
! Export query results as `.csv` for Excel, or use **Generate Scripts…** (`.sql`) to recreate tables and data in SQL Server.

? In SSMS, which wizard creates a `.sql` file containing the `CREATE TABLE` statements (and optionally `INSERT`s) of your database?
- Shrink Database ~~ Shrink frees unused file space.
* Tasks › Generate Scripts… ~~ Generate Scripts exports schema and/or data as SQL statements.
- Activity Monitor ~~ Activity Monitor shows live server processes.
- SQL Server Profiler ~~ Profiler traces live SQL events.
! Use **Tasks › Generate Scripts…** to script out tables and data as `.sql`.
