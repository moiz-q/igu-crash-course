---
id: c-03
title: Flowchart symbols
goal: recognize and use the standard flowchart shapes (terminal, process, input/output, decision, flow arrows)
week: 2
minutes: 15
---

A **flowchart** (*akış şeması*) is a visual map of an algorithm. Instead of reading paragraphs, you follow arrows from **Start** to **End**. Flowcharts appear very often in Programming Basics I written exams!

## The 5 standard symbols

| Symbol | Shape | Meaning |
| --- | --- | --- |
| **Terminal** | Rounded pill / oval | `Start` or `End` of the program |
| **Input / Output** | Parallelogram (slanted box) | `Read n` or `Print result` |
| **Process** | Rectangle | Calculation or assignment (`sum = a + b`) |
| **Decision** | Diamond | Yes/No (`True`/`False`) question (`n > 0 ?`) — always has **two** outgoing arrows |
| **Flow line** | Arrow `→` | Shows which step runs next |

## Worked example: even or odd

```flow
s   start  Start
r   io     Read n
d   dec    n % 2 == 0 ?  yes:e  no:o
e   io     Print "Even"  ->x
o   io     Print "Odd"  @right
x   end    End
```

Follow the arrows:
1. Start → Read `n` (parallelogram).
2. Decision diamond asks `n % 2 == 0 ?`
   - If **Yes**, go down to `Print "Even"`, then to `End`.
   - If **No**, go right to `Print "Odd"`, then down to `End`.

## Try it

Draw a flowchart on paper to read a number `x`, multiply it by `2` (`y = x * 2`), and print `y`. Then check the model flowchart below.

:::reveal Show model flowchart
```flow
s   start  Start
r   io     Read x
p   proc   y = x * 2
o   io     Print y
x   end    End
```
:::

## Common mistakes
- Putting a calculation like `sum = a + b` inside a parallelogram (that is **Process** = rectangle, not Input/Output).
- Leaving a **Decision** diamond with only 1 outgoing arrow — every decision must have **both** a `Yes` (True) and a `No` (False) branch.
- Using a rectangle for `Start` or `End` instead of the rounded terminal shape.

## Key terms
- flowchart | a diagram showing the step-by-step flow of an algorithm | akış şeması
- terminal symbol | rounded oval marking Start or End | başla/bitir sembolü
- decision symbol | diamond shape branching on a Yes/No condition | karar sembolü
- process symbol | rectangle shape representing a calculation or assignment | işlem sembolü

## Quick check
? Which flowchart shape is used for **reading input** or **printing output**?
- Rectangle ~~ Rectangles are for processing/calculations.
* Parallelogram ~~ Slanted parallelograms represent Input/Output.
- Diamond ~~ Diamonds are for Yes/No decisions.
- Rounded oval ~~ Ovals mark Start and End.
! Parallelogram = I/O; Rectangle = Process; Diamond = Decision; Oval = Start/End.

? How many outgoing arrows must a **Decision** diamond have?
- Always 1 ~~ With 1 arrow, there is no decision!
* Always 2 (Yes/True and No/False) ~~ A condition is either true or false.
- 3 or more ~~ Standard flowcharts use binary Yes/No diamonds.
- 0 ~~ Only `End` has 0 outgoing arrows.
! Every decision diamond branches into `Yes` and `No`.

? Which shape should hold `total = price * qty`?
- Parallelogram ~~ That is for reading or printing, not calculating.
* Rectangle (Process) ~~ Assignments and arithmetic belong in a rectangle.
- Diamond ~~ `total = price * qty` is not a Yes/No question.
- Oval ~~ Ovals are only for Start and End.
! Calculations and variable updates use the Process rectangle.
