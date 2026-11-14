---
id: net-10
title: Binary, hexadecimal, and IPv4 addressing
goal: convert between binary, decimal, and hexadecimal, and read 32-bit IPv4 addresses in dotted-decimal form
week: 10
minutes: 20
---

Computers and switches only understand **binary** (`0` and `1`). To make long 32-bit IPv4 addresses and 48-bit MAC addresses readable for humans, we write IPv4 in **dotted decimal** and MAC/IPv6 in **hexadecimal**.

## Binary powers of 2 (1 byte = 8 bits)

Each bit position in an **octet** (8 bits) has a place value:

| Bit position | $2^7$ | $2^6$ | $2^5$ | $2^4$ | $2^3$ | $2^2$ | $2^1$ | $2^0$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Value** | **128** | **64** | **32** | **16** | **8** | **4** | **2** | **1** |

- Minimum 8-bit value: `00000000` = **0**
- Maximum 8-bit value: `11111111` = $128+64+32+16+8+4+2+1$ = **255**

### Example: Convert `192` to 8-bit binary
Subtract the largest powers of 2 that fit:
- `192 >= 128` → bit 128 is `1`, remainder `192 - 128 = 64`
- `64 >= 64` → bit 64 is `1`, remainder `0`
- All remaining bits (`32, 16, 8, 4, 2, 1`) are `0`
- Result: `11000000`

### Example: Convert `10101000` to decimal
Add the values where there is a `1`:
$$128 + 32 + 8 = 168$$

## IPv4 address structure

An **IPv4 address** is **32 bits** long, split into **4 octets** of 8 bits each, separated by dots:

```text
192      . 168      . 1        . 10
11000000 . 10101000 . 00000001 . 00001010
```

Because each octet is 8 bits, every number in a valid IPv4 address must be between **0 and 255**. An address like `192.168.300.1` is invalid!

## Hexadecimal (base 16)

Hex uses 16 digits: `0–9` and `A–F` (`A=10, B=11, C=12, D=13, E=14, F=15`). Every **1 hex digit = 4 binary bits** (a nibble), so **2 hex digits = 1 byte**:
- `1111 1111` = `FF` (255)
- `1100 0000` = `C0` (192)
- MAC address example: `00:1A:2B:3C:4D:5E` (6 bytes = 48 bits).

## Try it

Use the interactive base converter below to test binary, decimal, and hex conversions (`192`, `168`, `255`, `10`, `0xFF`, `11110000`):

@widget baseconv

## Common mistakes

- Writing `256` or higher in an IPv4 octet. Eight bits can only hold `0` through `255` ($2^8 = 256$ values total, starting at `0`).
- Dropping leading zeros when aligning 8-bit octets—`1` in an IPv4 octet is `00000001`, not just `1`, when doing subnetting math.
- Confusing hex `A`–`F` values (`A=10`, `F=15`, not `A=11`).

## Key terms

- octet | an 8-bit group (0–255) forming one quarter of an IPv4 address | sekizli (oktet)
- binary | base-2 number system using only digits 0 and 1 | ikilik sayı sistemi
- hexadecimal | base-16 number system using 0–9 and A–F (used in MAC and IPv6) | onaltılık sayı sistemi
- IPv4 address | a 32-bit logical address written as four decimal octets | IPv4 adresi

## Quick check

? What is the decimal value of the 8-bit binary number `11000000`?
- 128 ~~ 128 is `10000000`
* 192 ~~ `128 + 64 = 192`
- 196 ~~ `128 + 64 + 4` would be `11000100`
- 224 ~~ `128 + 64 + 32` would be `11100000`
! Only the 128 and 64 bits are 1, so `128 + 64 = 192`.

? Why is `192.168.1.260` an **invalid** IPv4 address?
- It has too many dots ~~ it has 3 dots (4 octets), which is normal
* One octet (`260`) is greater than 255 ~~ 8 bits can only represent 0 through 255
- `192.168` cannot be used in private networks ~~ `192.168.0.0/16` is a valid private range
- IPv4 addresses cannot end in 0 ~~ 260 is out of range, not ending in 0
! Each octet is 8 bits, so its maximum possible value is 255.

? How many bits are in a standard **IPv4** address?
- 8 bits ~~ 8 bits is one octet
- 16 bits ~~ 16 bits is two octets
* 32 bits ~~ 4 octets × 8 bits = 32 bits
- 128 bits ~~ 128 bits is IPv6
! IPv4 addresses are 32 bits long (IPv6 addresses are 128 bits).
