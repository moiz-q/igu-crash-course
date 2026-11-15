---
id: c-01
title: What a program is and how computers work
goal: explain what a computer program is, how compilers differ from interpreters, and what the main computer parts do
week: 1
minutes: 15
---

A computer is very fast, but on its own it cannot think. A **program** is a step-by-step list of instructions written by a programmer so the computer knows exactly what to do.


@widget viz name=c-pipeline

## Main parts of a computer

| Part | Role | Example |
| --- | --- | --- |
| **CPU** (Central Processing Unit) | The "brain" that executes instructions and does arithmetic | Intel Core / AMD Ryzen |
| **RAM** (Memory) | Fast, temporary workspace for running programs and variables (erased when power is off) | 8 GB / 16 GB RAM |
| **Storage** (SSD / HDD) | Permanent storage for files, photos and programs even when turned off | 512 GB SSD |
| **Input / Output (I/O)** | Devices that bring data in or show results out | Keyboard, mouse / screen, printer |

## Source code, compiler and interpreter

Humans write programs in a **high-level language** like **C** or **Python**, called **source code** (*kaynak kod*). The CPU only understands binary **machine code** (`0`s and `1`s). There are two ways to translate:

- **Compiler (*derleyici*):** Translates the **entire** C program into an executable machine-code file (e.g. `program.exe`) *before* you run it. If there is a syntax error, it refuses to build. **C uses a compiler** (such as `gcc`), which makes C programs very fast.
- **Interpreter (*yorumlayıcı*):** Reads and runs the code **one line at a time** while the program is executing (e.g. Python, JavaScript). Easier to test quickly, usually slower.

The C workflow is always: **Write source (`main.c`) → Compile (`gcc main.c -o main`) → Run (`./main`)**.

## A short history of the internet (IT basics)

In the late 1960s, the US **ARPANET** connected four university computers to share research. In the 1970s–80s, **TCP/IP** protocols let many separate networks join together into the **Internet**. In 1989–1991, Tim Berners-Lee invented the **World Wide Web** (HTML, URLs, HTTP) on top of the Internet, turning it into the everyday information system we use today.

## Try it

Even before learning C syntax, you can run your first C program right here! Press **Run** below, then try changing `"Hello, IGU!"` to print your own name.

```c run
#include <stdio.h>

int main() {
    printf("Hello, IGU!\n");
    return 0;
}
```

## Common mistakes
- Confusing **RAM** (temporary memory cleared when power turns off) with **Storage** (SSD/HDD, permanent).
- Thinking the **Internet** and the **World Wide Web** are the exact same thing — the Internet is the global network of computers; the Web is one service (webpages) running on top of it.
- Editing `.c` source code and forgetting to **re-compile** before running the executable again.

## Key terms
- program | a step-by-step set of instructions for a computer to execute | program
- CPU | Central Processing Unit — executes instructions and calculations | işlemci
- RAM | fast temporary memory wiped when power is off | bellek (RAM)
- compiler | translates the whole source file into machine code before running | derleyici
- interpreter | translates and runs source code line by line | yorumlayıcı

## Quick check
? What happens to data stored only in **RAM** when you turn the computer off?
- It moves to the CPU permanently ~~ The CPU has no permanent storage.
* It is lost (erased) ~~ RAM is volatile memory and needs power to keep its contents.
- It is saved to the SSD automatically ~~ Only files explicitly saved to storage remain.
- It stays in RAM forever ~~ Only non-volatile storage (SSD/HDD) keeps data without power.
! RAM is temporary working memory; permanent files live on storage (SSD/HDD).

? How does a **compiler** differ from an **interpreter**?
- A compiler runs code line by line without saving an executable ~~ That describes an interpreter.
* A compiler translates the whole program into machine code *before* execution ~~ C uses a compiler (`gcc`), producing a fast executable file.
- An interpreter only works for C ~~ C is compiled; languages like Python are typically interpreted.
- A compiler is hardware inside the monitor ~~ A compiler is software.
! C is a compiled language: source code → compiler → machine code → run.

? Which 1960s network was the ancestor of today's Internet?
- World Wide Web ~~ The Web was invented in 1989–1991 on top of the Internet.
* ARPANET ~~ ARPANET connected the first university research nodes in 1969.
- Bluetooth ~~ Bluetooth is a short-range wireless standard from the 1990s.
- Ethernet ~~ Ethernet is a local wired LAN technology.
! ARPANET evolved into the global Internet after adopting TCP/IP.
