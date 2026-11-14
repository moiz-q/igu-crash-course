# Content format (for authors)

All content lives in `/content`. Run `powershell -File tools\validate.ps1 -Only <courseId>` after editing:
it runs `python tools/build.py` (which turns `/content` into `/data/*.js`) and then a headless validator that
runs every C program through the in-browser C interpreter (MiniC) and every SQL query through sql.js.
**Fix every warning the build prints for your course and every validator ERROR.**

Read the course build brief (kept outside this repository) for scope. Rules that matter most:
plain beginner English (the student is an ESL learner), short sentences, define every term the first time,
original text only (never copy textbooks), show an example before every rule.

## Files per course (`content/<courseId>/`)

| File | What |
| --- | --- |
| `NN-slug.md` | one lesson per file, `NN` = two digits, sorted order = lesson order |
| `mcq.txt` (or `mcq-*.txt`) | multiple-choice question bank, each question tagged with the lesson number |
| `exercises*.txt` | C course only: runnable exercises |
| `challenges*.txt`, `seed.sql` | DB course only: SQL challenges + sample database |
| `games.json` | ordering / matching games (`@widget order set=...`, `@widget match set=...`) |
| `formula.json` | Office only: spreadsheet sandbox data |
| `cheatsheet.md` | printable one-page cheat sheet |
| `mock-midterm.md`, `mock-final.md` | written mock exams (C, DB, English only — MCQ courses get timed mocks from `mcq.txt` automatically) |
| `flashcards.txt` | extra flashcards: `courseId | front | back` one per line (key terms become flashcards automatically) |

## Lesson file

```
---
id: c-05
title: Your first C program and data types
goal: write, compile and run a small C program and choose the right data type for a value
week: 4
minutes: 20
---

Intro paragraph (no heading).

## What a C program looks like
Text... (every `## ` heading starts a section)

## Worked example
...

## Try it
...interactive part...

## Common mistakes
- 2–4 bullets

## Key terms
- variable | a named box in memory that holds one value | değişken
- data type | what kind of value a variable holds (int, float...) | veri tipi

## Quick check
? Question text?
- wrong option ~~ why it is wrong
* correct option ~~ why it is right
- wrong option ~~ why it is wrong
! General explanation shown after answering.
```

* Front matter: `id` = `<courseId>-NN` (must match the ids in `content/plan.json`), `goal` completes the sentence
  "After this lesson you can …" (lower-case start, no full stop). `week` = syllabus week (e.g. `8–9` allowed).
  Optional `kind: overview` / `kind: test` / `kind: free` turns off the template check (only for overview lessons,
  the level test and review lessons).
* Required sections (the build warns if missing): `## Try it`, `## Common mistakes`, `## Key terms`, `## Quick check`.
  Key terms: `- English term | one-line meaning | Turkish term` — exactly two ` | ` separators.
* Quick check: 3–5 questions. **Every option gets a ` ~~ ` explanation.** Exactly one `*` (correct) option.
  Questions are separated by a blank line. A question can contain a code block (```` ```c ```` … ```` ``` ````)
  between the question line and the options.

### Markdown supported
Paragraphs, `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `- ` lists, `1. ` lists, tables (`| a | b |` + `|---|---|`),
`### sub-heading`, `> quote`, maths `$x^2$` (KaTeX; inline only within a line) and `$$ ... $$` on one line for display maths.
Write a literal dollar sign as `\$`. Do NOT use raw HTML.

### Blocks
* ```` ```c ```` — highlighted C code (static).
* ```` ```c run ```` — editable, runnable C (MiniC). Must compile and run! Program input: ```` ```c run stdin="5 7" ````
  (use `\n` inside the quotes for new lines). For a deliberate compile error add `fails=1`.
* ```` ```output ```` — a box showing program output.
* ```` ```sql ```` — static SQL. ```` ```sql run ```` — runnable against the sample DB (must run; `fails=1` for deliberate errors).
* ```` ```java ````, ```` ```text ```` — static.
* ```` ```memviz stdin="..." ```` — C program shown in the step-by-step memory visualizer (pointers lessons).
* ```` ```flow ```` — flowchart. One node per line, fields separated by **two or more spaces**:
  `id  kind  text  [yes:id] [no:id] [->id] [@right]`; kinds `start end io proc dec`. Nodes follow each other
  top-to-bottom by default; `dec` needs `yes:`/`no:` (a missing one falls through to the next node); `->id` jumps
  (use for loops back up); `@right` places a node in a right-hand column (for the other branch).
  ```
  s   start  Start
  r   io     Read n
  d   dec    n % 2 == 0 ?  yes:e  no:o
  e   io     Print "even"  ->x
  o   io     Print "odd"  @right
  x   end    End
  ```
* ```` ```erd ```` — ER diagram: `Entity: *pk_col, col2, fk_col` lines then `A 1--N B : label` lines.
* ```` ```stepper ```` — normalization stepper, JSON:
  `{"title": "...", "stages": [{"name": "UNF", "note": "text", "tables": [{"name": "T", "pk": ["a"], "cols": ["a","b"], "rows": [["1","x"]]}], "problem": "text or omit on the last stage"}]}`
* ```` ```timeline ```` — `date | title | 2–3 sentence card | syllabus week` per line.

### Containers
```
:::tip Optional title
markdown inside
:::
```
Kinds: `note`, `tip`, `warn`, `exam` (exam tip), `example` (worked example), `tsql` ("In SQL Server (T-SQL)" note),
`reveal Show answer` (collapsible answer), `checklist Title` (saved tick list, lines `- task`),
`rubric Title` (self-grading checklist, lines `- point`).

### Gap-fill practice
Consecutive lines `_ She ___ (go) home. = went ~~ optional note`. Several blanks: `___ … ___ = a ; b`,
alternative answers `= went | had gone`. Number of `___` must equal number of answers.

### Widgets (`@widget name key=value ...` on its own line)
| Widget | Args | Use |
| --- | --- | --- |
| `mcq` | `course=net tag=07 n=5` | quiz from the bank (tag = lesson number) |
| `exercises` | `lesson=c-05` (default: current) | list of this lesson's C exercises |
| `challenges` | `lesson=db-09` | list of this lesson's SQL challenges |
| `subnetcalc`, `subnetdrill`, `baseconv` | — | networks tools |
| `mathdrill` | `topic=sets` (sets fractions divisibility bases modular primes gcdlcm exponents radicals factoring linear quadratic inequalities absolute ratio) | maths generator |
| `formula` | — | Excel sandbox (office, needs formula.json) |
| `topology` | `type=bus` (bus star ring mesh tree hybrid) | topology diagram |
| `venn` | `types=inner,left,right` | JOIN diagrams |
| `order` / `match` | `set=osi` | games from games.json |

## Question bank `mcq.txt`
```
# comment lines start with #
? [07] Which OSI layer uses IP addresses?
- Data link ~~ uses MAC addresses
* Network ~~ IP lives at layer 3
- Transport ~~ uses port numbers
- Physical ~~ only bits and signals
! The network layer (3) routes packets using logical (IP) addresses.
```
Tag `[07]` = lesson `net-07` (the part after the course id). Optional difficulty `[07|hard]`. MCQ courses: use
**5 options** for maths (Turkish exam style), 4–5 for others. One `*`. Blank line between questions.

## C exercises `exercises*.txt` (C course)
```
=== c-05-01 | easy | run | Print your name and age
Prompt in markdown. Say exactly what to print.
--- starter
#include <stdio.h>

int main() {
    // write your code here

    return 0;
}
--- solution
...complete program...
--- stdin
5 7
--- hint
One sentence.
--- checklist
- Uses scanf with &
- Prints with \n
```
Header: `id | easy|medium|exam | run|bug|fill|predict | title`. Id = `<lessonId>-NN`. `run` = write the program
(starter optional — default is an empty main); `bug` = starter is the buggy program, solution is fixed (output must
differ!); `fill` = starter contains `____` blanks; `predict` = use `--- code` instead of starter/solution; the student
types the output. The checker compares the student's output to the **solution's** output for the given stdin, so the
prompt must specify the exact output format. `checklist` only for exam-level written questions.

## SQL challenges `challenges*.txt` (DB course)
```
=== db-q01 | easy | SELECT | db-09 | All students from Istanbul
List the first and last names of students whose city is Istanbul, ordered by last name.
--- sql
SELECT first_name, last_name FROM Students WHERE city = 'Istanbul' ORDER BY last_name;
--- hint
Use WHERE and ORDER BY.
```
Header: `id | difficulty | topic | lessonId | title`. Results are compared as sets unless the model query has ORDER BY.
For INSERT/UPDATE/DELETE/DDL challenges add `--- check` with a SELECT whose result is compared.
Prompts must name the exact columns wanted, in order.
