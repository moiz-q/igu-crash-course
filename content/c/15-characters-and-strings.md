---
id: c-15
title: Characters and strings
goal: work with ASCII characters, null-terminated strings, <string.h> functions, <ctype.h> functions, and fgets
week: 14
minutes: 25
---

C does not have a built-in `string` type like Python or Java. Instead, a **string** in C is an **array of `char` ending with the null character `'\0'`** (ASCII code `0`).

## `char`, ASCII and the `'\0'` terminator

Every `char` is stored as a small integer ASCII code: `'A'` = `65`, `'a'` = `97`, `'0'` = `48`.
If you store `"Cat"` in `char s[10]`, memory holds: `'C'`, `'a'`, `'t'`, `'\0'`. Functions stop reading when they hit `'\0'`, so **always leave 1 extra byte for `'\0'`**!

## `<string.h>` and `<ctype.h>`

| Function | Library | What it does |
| --- | --- | --- |
| `strlen(s)` | `<string.h>` | Returns length **excluding** `'\0'` |
| `strcpy(dst, src)` | `<string.h>` | Copies `src` into `dst` (make sure `dst` is big enough!) |
| `strcat(dst, src)` | `<string.h>` | Appends `src` onto the end of `dst` |
| `strcmp(a, b)` | `<string.h>` | Returns **`0`** if `a` and `b` are equal (`<0` if `a<b`, `>0` if `a>b`) |
| `toupper(c)` / `tolower(c)` | `<ctype.h>` | Converts a letter to upper/lower case |
| `isdigit(c)` / `isalpha(c)` | `<ctype.h>` | Checks if `c` is `'0'..'9'` or a letter |

```c run
#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main() {
    char word[30] = "Hello";
    strcat(word, " C");
    printf("word = %s (len = %d)\n", word, (int)strlen(word));

    if (strcmp(word, "Hello C") == 0) {
        printf("Exact match!\n");
    }

    for (int i = 0; word[i] != '\0'; i++) {
        word[i] = toupper(word[i]);
    }
    printf("Upper: %s\n", word);
    return 0;
}
```

## Reading strings: `scanf("%s", s)` vs `fgets`

- `scanf("%s", name);` (no `&` needed because `name` is an array!) stops at the **first space**.
- `fgets(line, sizeof(line), stdin);` reads a **whole line including spaces**, up to `sizeof(line) - 1` chars (and usually keeps the trailing `'\n'`).

## Try it

Solve the character and string exercises below!

@widget exercises lesson=c-15

## Common mistakes
- Comparing strings with `if (s1 == s2)` — that compares **memory addresses**, not text! Always use `if (strcmp(s1, s2) == 0)`.
- Writing `if (strcmp(s1, s2))` thinking `1` means equal — `strcmp` returns **`0`** when equal!
- Assigning a string after declaration with `s = "Ali";` — use `strcpy(s, "Ali");`.
- Forgetting space for `'\0'`: `"Hello"` needs at least `char s[6]`, not `char s[5]`.

## Key terms
- null terminator ('\0') | the zero byte marking the end of a C string | sonlandırma karakteri ('\0')
- ASCII | standard numeric encoding for characters (`'A'=65`, `'a'=97`, `'0'=48`) | ASCII kodu
- strcmp | compares two strings; returns `0` when they are identical | metin karşılaştırma
- fgets | safely reads a full line of text (with spaces) into a `char` array | satır okuma

## Quick check
? What does `strcmp("cat", "cat")` return?
- `1` ~~ `1` (or positive) means the first string is greater, not equal!
* `0` ~~ `strcmp` returns `0` when two strings are identical.
- `-1` ~~ Negative means the first string comes before the second.
- `3` ~~ `strlen` returns `3`, not `strcmp`.
! Always write `if (strcmp(a, b) == 0)` to check if two C strings are equal.

? How many bytes does `char s[] = "IGU";` allocate in memory?
- `3` ~~ Don't forget the hidden `'\0'` at the end!
* `4` ~~ `'I'`, `'G'`, `'U'`, and `'\0'` = 4 bytes.
- `2` ~~ Too small.
- `5` ~~ Only one `'\0'` is added.
! A string literal of length $k$ takes $k + 1$ bytes (including `'\0'`).

? Which function reads a full line **with spaces** safely without overflowing `char buf[50]`?
- `scanf("%s", buf);` ~~ Stops at the first space and doesn't limit length.
* `fgets(buf, sizeof(buf), stdin);` ~~ Reads spaces and stops before overflowing `buf`.
- `scanf("%c", &buf);` ~~ Reads only 1 character.
- `strcpy(buf, stdin);` ~~ `stdin` is a `FILE *`, not a string.
! Use `fgets(buf, sizeof(buf), stdin)` to read a whole line safely.
