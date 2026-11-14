---
id: bridge-03
title: Preview: C file operations
goal: open, write, read and close text files in C using fopen, fprintf, fgets and fclose
week: 8
minutes: 20
---

Variables in RAM disappear when your program ends. **Programming Basics II** teaches you how to save records to a file on disk and read them back later.

## Opening, writing and closing a file

Every file operation follows four steps:
1. Declare a `FILE *` pointer.
2. Call `fopen("filename", "mode")` (`"w"` writes a new file, `"a"` appends to the end, `"r"` reads).
3. Check if the pointer is `NULL` (meaning the file could not be opened).
4. Write or read, then call `fclose(fp)`.

```c run
#include <stdio.h>

int main() {
    FILE *fp = fopen("grades.txt", "w");
    if (fp == NULL) {
        printf("Could not open file.\n");
        return 1;
    }
    fprintf(fp, "Deniz 85\n");
    fprintf(fp, "Ece 94\n");
    fclose(fp);

    fp = fopen("grades.txt", "r");
    if (fp == NULL) {
        printf("Could not open file for reading.\n");
        return 1;
    }
    char name[30];
    int score;
    while (fscanf(fp, "%s %d", name, &score) == 2) {
        printf("%s scored %d\n", name, score);
    }
    fclose(fp);
    return 0;
}
```

## Reading line by line with `fgets`

When lines contain spaces, `fgets(buffer, size, fp)` is safer than `fscanf`, because it reads up to `\n` (and stops before overflowing the buffer).

```c run
#include <stdio.h>

int main() {
    FILE *fp = fopen("notes.txt", "w");
    fprintf(fp, "Line one: C files\nLine two: always close!\n");
    fclose(fp);

    fp = fopen("notes.txt", "r");
    char line[100];
    while (fgets(line, 100, fp) != NULL) {
        printf("> %s", line);
    }
    fclose(fp);
    return 0;
}
```

## Try it

Modify the program below to append a 3rd student (`"Kerem"`, `79`) using mode `"a"`, then read and print all lines.

```c run
#include <stdio.h>

int main() {
    FILE *fp = fopen("class.txt", "w");
    fprintf(fp, "Deniz 85\nEce 94\n");
    fclose(fp);

    fp = fopen("class.txt", "a");
    if (fp != NULL) {
        fprintf(fp, "Kerem 79\n");
        fclose(fp);
    }

    fp = fopen("class.txt", "r");
    char name[30];
    int g;
    while (fscanf(fp, "%s %d", name, &g) == 2) {
        printf("%s -> %d\n", name, g);
    }
    fclose(fp);
    return 0;
}
```

## Common mistakes
- Using the file pointer without checking `if (fp == NULL)` first — if the file doesn't exist in `"r"` mode, reading from `NULL` crashes the program.
- Opening an existing file with `"w"` when you meant `"a"` — `"w"` erases the old contents immediately.
- Forgetting `fclose(fp)`, which can leave written data stuck in a buffer instead of saved on disk.

## Key terms
- FILE pointer | a `FILE *` handle returned by `fopen` to track an open file | dosya işaretçisi
- file mode | `"r"` read, `"w"` write/overwrite, `"a"` append | dosya modu
- buffer | a temporary char array used to hold a line read from a file | tampon bellek

## Quick check
? What does `fopen("data.txt", "w")` do if `data.txt` already exists?
- Adds new lines to the end ~~ Appending is mode `"a"`.
* Erases the existing contents and starts empty ~~ Mode `"w"` truncates an existing file to zero length.
- Returns `NULL` ~~ Mode `"w"` creates or overwrites; `"r"` returns `NULL` if missing.
- Opens it read-only ~~ Read-only is mode `"r"`.
! `"w"` creates a new file or overwrites an existing one. Use `"a"` to keep old data.

? What does `fopen("missing.txt", "r")` return if the file does not exist?
- An empty string `""` ~~ `fopen` returns a pointer, not a string.
- `0` as an integer error code ~~ It returns a pointer, specifically `NULL`.
* `NULL` ~~ Always check `if (fp == NULL)` after `fopen`.
- It creates an empty file ~~ Only `"w"` and `"a"` create a missing file.
! Reading a missing file with `"r"` returns `NULL`.

? Why is `while (fscanf(fp, "%s %d", name, &g) == 2)` better than `while (!feof(fp))`?
- `feof` only works for binary files ~~ `feof` works on any stream, but only *after* a read fails.
* `fscanf` returns how many items were actually read, preventing an extra duplicate loop at the end ~~ `feof` only becomes true after trying to read past the end.
- `feof` deletes the last line ~~ `feof` does not modify the file.
- `fscanf` automatically closes the file ~~ You still must call `fclose(fp)`.
! Checking the return value of `fscanf` or `fgets` avoids reading garbage after the last line.
