# İGÜ Computer Programming (English) — Semester 1 Crash Course

A free, static study website that covers the semester 1 courses of the Computer Programming (English) associate degree at Istanbul Gelişim University, for a student joining in semester 2. It needs no login, no server and no build step to use.

**Live site:** https://moiz-q.github.io/igu-crash-course/

## What's inside

**Start with Essentials** (`#/essentials`): one short page per course (10–25 minutes, about 2.5 hours in total) with only the big ideas — each explained in plain words with one example, a "go deeper" link to the full lesson, and a 5-question check. The full lessons below are for depth and practice.


| Course | Lessons | Practice |
| --- | --- | --- |
| Programming Basics I (C) | 16 | 98 exercises (write code, predict output, find the bug, fill the blank) run in the browser; memory visualizer; 80-question bank; written midterm + final mocks |
| Database Management Systems I (SQL) | 15 | SQL playground (SQLite via sql.js) with a sample university database; 46 auto-checked query challenges; ER diagrams; normalization stepper; written mocks |
| Computer Networks | 16 | Unlimited subnetting drills with worked steps; subnet calculator; base converter; ordering/matching games; 2 Packet Tracer labs; 151 MCQs; timed mocks |
| Mathematics I | 14 | Random question generators for 15 topics with full solutions; 106 five-option MCQs; timed mocks |
| Integrated Office Applications | 14 | Hands-on checklists; Excel formula sandbox; 146 MCQs; timed mocks |
| Advanced English Skills I | 14 + B2 readiness test | Gap-fills, original readings, writing prompts with model answers and rubrics; 66 MCQs; written mocks |
| Turkish Language I, Atatürk Principles I | 1 overview each | 20 / 25-question quizzes, clickable timeline |
| Semester 2 bridge | 8 previews | C structs and files, C → Java, first Java class, SQL functions and views, functions and logarithms |

Plus: dashboard with progress rings, "continue where you left off", 8-week study plan with a changeable start date, practice hub with filters, searchable English ↔ Turkish glossary, spaced-repetition flashcards, printable cheat sheets, light/dark mode, and progress export/import.

## Run it locally

Open `index.html` in Chrome, Edge or Firefox. That's all — everything (CodeMirror, KaTeX, sql.js) is in `vendor/`, so it also works offline.

Progress is saved in the browser (`localStorage`). Use **More → Export progress** to move it to another device.

## Deploy

The site is plain static files. It is deployed with GitHub Pages from the `main` branch root (Settings → Pages). `.nojekyll` tells Pages to serve the files as they are. Netlify or Cloudflare Pages work too: no build command, publish directory `.`.

## Add or change content

All teaching content is in `content/` (each course's quick version is `content/<course>/essentials.md`, built from `:::idea Title` blocks) as Markdown and plain-text files; the format is documented in [`content/FORMAT.md`](content/FORMAT.md). Adding a lesson needs no code change.

1. Edit or add files in `content/<course>/`.
2. Rebuild the data bundles: `python tools/build.py` (Python 3, standard library only). It writes `data/*.js` and prints warnings for anything that breaks the lesson template.
3. Validate (Windows, needs Chrome or Edge): `powershell -ExecutionPolicy Bypass -File tools\validate.ps1` — runs every C program through the in-browser interpreter and every SQL query through sql.js.
4. Commit and push; GitHub Pages updates in about a minute.

Test pages (open through a local server, e.g. `python -m http.server`):

- `tools/viz-gallery.html` — every diagram on one page (with a light/dark toggle) for checking how they look.

- `tools/minic-test.html` — 57 tests for the C interpreter.
- `tools/generator-tests.html` — about 21,000 checks of the subnetting and maths generators against independent calculations, plus the spreadsheet formula engine.

## Design choices and notes

- **Diagrams:** about 40 hand-built SVG diagrams live in `assets/js/viz.js` and are placed in content with `@widget viz name=<diagram>`. They follow light/dark mode and each course's colour, carry full alt text, and can be tapped to enlarge on phones.

- **C runner:** a purpose-built interpreter (`assets/js/minic.js`) instead of a WebAssembly compiler. It covers the C used in the course (stdio, operators, control flow, functions, recursion, arrays, pointers, strings, structs, simple file I/O), gives beginner-friendly error messages, and drives the step-by-step memory visualizer. For anything it doesn't support, it shows a link to a free online C compiler. Code was validated with this interpreter, not with gcc (gcc was not available on the build machine).
- **SQL:** the playground is SQLite. Wherever SQL Server (T-SQL) differs — `TOP` vs `LIMIT`, `IDENTITY`, `GETDATE()`, `BEGIN TRAN` — lessons show a T-SQL note. DCL (GRANT/REVOKE/DENY) is taught with read-only examples because SQLite has no users.
- **English:** all reading passages are original; nothing is copied from the coursebooks. The B2 readiness test is general practice, **not** a copy of the IGUYET exam.
- **Week numbers** on each course page follow the official syllabus, with the week 7 midterm marked.
- Unofficial study aid; course topics are taken from the public İGÜ syllabi (checked November 2026).
