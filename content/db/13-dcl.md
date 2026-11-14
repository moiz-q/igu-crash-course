---
id: db-13
title: DCL queries: Users, roles and permissions
goal: understand logins, users, roles, GRANT, REVOKE, DENY and the principle of least privilege
week: 12–13
minutes: 15
---

Not everyone should be able to read instructor salaries or `DROP TABLE Students`. **DCL (Data Control Language)** controls *who* can connect to the database and *what* actions they are allowed to perform.

*(Note: SQLite has no user/permission system, so DCL commands are shown below as read-only SQL Server / T-SQL examples.)*

## Logins, users and roles (SQL Server)

- **Login:** Server-level account that lets you connect to the SQL Server instance (`CREATE LOGIN ali WITH PASSWORD = '...';`).
- **User:** Database-level identity mapped to a login inside one specific database (`CREATE USER ali FOR LOGIN ali;`).
- **Role:** A named group of permissions (e.g. `db_datareader` can `SELECT` from all tables; `db_datawriter` can `INSERT/UPDATE/DELETE`; or custom roles like `RegistrarRole`). Assigning permissions to roles instead of individual users makes management much easier.

## `GRANT`, `REVOKE` and `DENY`

| Command | Effect |
| --- | --- |
| `GRANT` | Gives a permission (e.g. `SELECT`, `INSERT`, `UPDATE`, `EXECUTE`) |
| `REVOKE` | Removes a previously granted (or denied) permission |
| `DENY` | Explicitly blocks a permission — **overrides** any `GRANT` from a role! |

```sql
-- T-SQL (SQL Server) examples:

-- 1. Allow student_app to read Students and Courses
GRANT SELECT ON Students TO student_app;
GRANT SELECT ON Courses  TO student_app;

-- 2. Allow registrar_role to read and update Students, but block DELETE
GRANT SELECT, INSERT, UPDATE ON Students TO registrar_role;
DENY DELETE ON Students TO registrar_role;

-- 3. Take back INSERT permission later
REVOKE INSERT ON Students FROM registrar_role;
```

## Principle of least privilege

**Least privilege** (*en az yetki ilkesi*) means every user or application gets **only** the permissions it actually needs to do its job, and nothing more. A public course-catalog webpage only needs `SELECT` on `Courses` — never `DELETE` or `DROP`, and never `SELECT` on `Instructors.salary`.

## Try it

Practice DCL concepts with this short quiz from the question bank.

@widget mcq course=db tag=13 n=5

## Common mistakes
- Connecting web apps as `sa` (system administrator) instead of a limited user with least privilege.
- Confusing `REVOKE` (removes a permission setting, so a role could still grant it) with `DENY` (actively blocks the permission even if a role grants it).

## Key terms
- DCL | Data Control Language (`GRANT`, `REVOKE`, `DENY`) | Veri Kontrol Dili
- GRANT | gives a user or role permission to perform an action | yetki verme
- REVOKE | removes a previously given permission | yetkiyi geri alma
- DENY | explicitly blocks a permission, overriding any `GRANT` | yetkiyi reddetme
- least privilege | giving each account only the minimum permissions it needs | en az yetki ilkesi

## Quick check
? Which DCL command gives `user_ali` permission to run `SELECT` on `Courses`?
* `GRANT SELECT ON Courses TO user_ali;` ~~ `GRANT` assigns permissions.
- `ALLOW SELECT ON Courses TO user_ali;` ~~ `ALLOW` is not a SQL DCL keyword.
- `REVOKE SELECT ON Courses FROM user_ali;` ~~ `REVOKE` removes a permission.
- `DENY SELECT ON Courses TO user_ali;` ~~ `DENY` blocks a permission.
! Use `GRANT <permission> ON <object> TO <principal>;`.

? A user belongs to `db_datareader` (which has `GRANT SELECT`), but you must ensure they can NEVER read `Instructors`. Which command should you run?
- `REVOKE SELECT ON Instructors FROM that_user;` ~~ `REVOKE` only removes a direct grant; they would still inherit `SELECT` from `db_datareader`.
* `DENY SELECT ON Instructors TO that_user;` ~~ `DENY` overrides any `GRANT` inherited from a role.
- `DROP USER that_user;` ~~ That removes the user from the whole database.
- `DELETE FROM Instructors;` ~~ That deletes the data itself!
! `DENY` takes precedence over `GRANT` (even from role membership).

? What does the **principle of least privilege** recommend?
- Give every developer `sa` admin rights so nothing breaks ~~ That is the opposite of least privilege.
* Give each user or app only the exact permissions required for its task ~~ Limits damage if an account is compromised or has a bug.
- Store passwords in plain text ~~ Never store plain-text passwords.
- Disable all `FOREIGN KEY` constraints ~~ Constraints protect data integrity, not access control.
! Least privilege minimizes risk by granting only necessary permissions.
