---
id: net-08
title: Error detection and media access control
goal: detect single-bit errors with parity, explain how CRC/FCS protects frames, and compare CSMA/CD with CSMA/CA
week: 8
minutes: 16
---

Cables and radio waves are noisy—electrical spikes or interference can flip a `0` into a `1`. Layer 2 (Data Link) handles two key jobs: **checking frames for bit errors** and **deciding whose turn it is to transmit** on a shared medium.

## Error detection

### 1. Parity bit (simple)
Add one extra bit so the total number of `1`s is even (**even parity**) or odd (**odd parity**).
- Example (even parity): data `1011001` has four `1`s (already even) → parity bit = `0` → sent as `10110010`.
- Data `1010001` has three `1`s (odd) → parity bit = `1` → sent as `10100011`.
- Limitation: parity catches any **single-bit** error (1, 3, 5… flips), but **misses 2-bit errors** because two flips keep the parity even!

### 2. Checksum
The sender adds up blocks of data and attaches the sum. The receiver repeats the sum; if they differ, the data was corrupted. (Used in IPv4/TCP/UDP headers.)

### 3. CRC (Cyclic Redundancy Check) / FCS
Ethernet frames end with a **32-bit Frame Check Sequence (FCS)** computed using **CRC**. The sender divides the frame bits by a fixed polynomial and sends the remainder. The receiver runs the same division; if the remainder is non-zero, the frame is **discarded silently** (higher layers like TCP will retransmit if needed).

## Error correction: Hamming code and ARQ

Detecting an error is only half the job. There are two ways to **fix** it:

1. **Retransmission (ARQ — Automatic Repeat reQuest).** The receiver checks each frame. If it is correct, it sends an **ACK** (acknowledgement). If it is damaged, it sends a **NAK** or sends nothing; after a **timeout** the sender sends the frame again. The simplest form is **Stop-and-Wait ARQ**: send one frame, wait for its ACK, then send the next. TCP and Wi-Fi both use retransmission.
2. **Forward error correction (FEC).** The sender adds enough extra bits that the receiver can **find and fix** an error itself, without asking again. Useful when resending is slow or impossible (satellites, deep-space probes, memory chips).

**Hamming code (the idea).** Extra **parity bits** are placed at positions 1, 2, 4, 8… of the codeword. Each parity bit checks a different group of positions. When one bit is flipped, some parity checks fail; adding the positions of the failed parity bits gives the **position of the wrong bit**, which can then be flipped back.

*Mini example — Hamming(7,4):* 4 data bits + 3 parity bits = 7 bits. If the receiver finds that the checks for parity bits **1** and **4** fail but check **2** is fine, the error is at position 1 + 4 = **5**. Flip bit 5 and the data is correct again.

| Method | Detects | Corrects | Typical use |
| --- | --- | --- | --- |
| Parity bit | single-bit errors | no | simple serial links |
| Checksum | many errors | no | IP, TCP, UDP headers |
| CRC | almost all burst errors | no | Ethernet and Wi-Fi frames |
| Hamming code | 1–2 bit errors | **1-bit errors** | ECC memory, storage |
| ARQ | (uses one of the above) | by **resending** | TCP, Wi-Fi |

## Media access control: CSMA/CD vs. CSMA/CA

When multiple devices share a medium, two signals at once cause a **collision**.

| Method | Where used | How it handles collisions |
| --- | --- | --- |
| **CSMA/CD** (Collision Detection) | Old half-duplex Ethernet (hubs) | Listen before sending → send → **detect** collision → send jam signal, wait random backoff, retry |
| **CSMA/CA** (Collision Avoidance) | **Wi-Fi (802.11)** | Cannot easily detect collisions while transmitting radio → listen, wait random backoff, optionally use **RTS/CTS** to **avoid** collisions |

:::tip Why modern wired Ethernet doesn't collide
Modern switched Ethernet uses **full-duplex** links (separate wires for send and receive, one PC per switch port), so collisions cannot happen and CSMA/CD is not needed.
:::

## Try it

Check these 8-bit bytes using **even parity** (the rightmost bit is the parity bit). Which bytes arrived with an error?
1. `11010100`
2. `01101010`
3. `11111111`

:::reveal Show answer
1. `11010100`: four `1`s (even) → **OK** (no single-bit error detected).
2. `01101010`: four `1`s (even) → **OK**.
3. `11111111`: eight `1`s (even) → **OK**. Wait—what if `10101011` arrived? Five `1`s (odd) → **Error detected!**
:::

## Common mistakes

- Thinking a parity bit **fixes** errors. Parity only **detects** odd numbers of flipped bits; it cannot tell which bit flipped.
- Confusing **CSMA/CD** (wired Ethernet hubs) with **CSMA/CA** (wireless Wi-Fi). Remember: **D** = Detect (wired), **A** = Avoid (air/wireless).
- Thinking Ethernet switches **repair** corrupted frames. A switch checks the FCS and simply **drops** bad frames.

## Key terms

- parity bit | an extra bit added to make the number of 1s even or odd for basic error detection | eşlik biti
- CRC (Cyclic Redundancy Check) | a strong polynomial-based error check used in Ethernet frames (FCS) | döngüsel artıklık denetimi
- collision | two devices transmitting on a shared medium at the same time, corrupting both signals | çarpışma
- CSMA/CD | Carrier Sense Multiple Access with Collision Detection (legacy wired Ethernet) | çarpışma algılamalı erişim
- CSMA/CA | Carrier Sense Multiple Access with Collision Avoidance (Wi-Fi) | çarpışma önlemeli erişim

## Quick check

? Using **even parity**, what parity bit should be added to the 7-bit data `1100101`?
* `0` ~~ there are already four 1s (even), so parity bit is 0
- `1` ~~ adding 1 would make five 1s (odd)
- `10` ~~ a parity bit is always a single bit
- `01` ~~ a parity bit is always a single bit
! `1100101` has four `1`s, which is already even, so the even parity bit is `0`.

? Which media access method is used by **Wi-Fi (802.11)** networks?
- CSMA/CD ~~ CSMA/CD is for legacy shared-wire Ethernet, not radio
* CSMA/CA ~~ Wi-Fi uses Collision Avoidance because wireless radios cannot easily listen while transmitting
- Token Ring ~~ Token Ring is an older wired ring LAN technology
- Full-duplex switching ~~ Wi-Fi shares open radio airwaves (half-duplex)
! Wireless LANs use CSMA/CA to avoid collisions before transmitting.

? What does an Ethernet switch do when a received frame fails the **FCS (CRC)** check?
- Fixes the flipped bit automatically ~~ CRC detects errors; it does not correct them
* Drops (discards) the corrupted frame ~~ Layer 2 drops bad frames so upper layers can retransmit if needed
- Sends it to all ports ~~ flooding a corrupted frame wastes bandwidth
- Converts it to a packet ~~ corrupted frames are discarded
! Failed FCS frames are discarded at Layer 2.
