---
id: net-04
title: Cabling and transmission media
goal: compare twisted-pair, coaxial, fiber-optic, and wireless media and choose between straight-through and crossover Ethernet cables
week: 3
minutes: 16
---

Data travels across a network as electrical pulses (copper), light pulses (fiber), or radio waves (wireless). Choosing the right medium depends on distance, speed, cost, and electrical noise (**EMI**).

## Guided (wired) media

| Medium | Signal | Typical max run | Pros & cons |
| --- | --- | --- | --- |
| **UTP (Twisted Pair)** | Electrical | 100 m | Cheap, flexible, standard for LANs (`Cat5e`, `Cat6`); vulnerable to EMI |
| **STP (Shielded TP)** | Electrical | 100 m | Extra foil shield reduces EMI; stiffer and pricier than UTP |
| **Coaxial** | Electrical | ~500 m | Good shielding; used by cable TV/internet ISPs |
| **Fiber-optic** | Light | 2 km (MMF) to 40+ km (SMF) | Immune to EMI, very high speed, long distance; costlier connectors |

### Why are UTP wires twisted?
Twisting pairs of copper wires cancels out **crosstalk** (interference between neighboring wires) and external electromagnetic interference (**EMI**). **Cat5e** and **Cat6** are common Ethernet categories supporting 1 Gbps (and 10 Gbps over short Cat6 runs).

### Single-mode vs. multi-mode fiber
- **Single-mode fiber (SMF)**: narrow core, laser light, travels tens of kilometers (used between cities and campus buildings).
- **Multi-mode fiber (MMF)**: wider core, LED light, shorter runs up to ~550 m–2 km (used inside buildings and data centers).

## RJ-45, T568A/T568B, and cable types

Ethernet UTP cables use **8-pin RJ-45** connectors. Two wiring standards exist: **T568A** and **T568B** (T568B is most common).

- **Straight-through cable**: both ends use the **same** standard (e.g., T568B on both ends). Used to connect **unlike devices**:
  - PC ↔ Switch
  - Switch ↔ Router
- **Crossover cable**: one end is **T568A** and the other is **T568B** (transmit pins connect to receive pins). Used to connect **like devices**:
  - PC ↔ PC
  - Switch ↔ Switch
  - Router ↔ Router

:::tip Auto-MDIX on modern hardware
Most modern switches and NICs support **Auto-MDIX**, which automatically detects and flips pins so a straight-through cable works everywhere. In **Cisco Packet Tracer** and exams, still know the straight-through vs. crossover rule!
:::

## Unguided (wireless) media

- **Wi-Fi (802.11)**: radio waves in 2.4 GHz / 5 GHz bands for LANs.
- **Bluetooth**: short-range PANs (~10 m).
- **Cellular (4G/5G)** and **Satellite**: wide-area wireless links.

## Try it

Decide whether you should choose **straight-through**, **crossover**, or **fiber-optic** for each link (assuming no Auto-MDIX):
1. A lab PC to a classroom switch (15 m).
2. Two switches in the same rack.
3. Building A switch to Building B switch (400 m apart, outdoors).

:::reveal Show answer
1. **Straight-through** UTP (unlike devices: PC ↔ Switch, under 100 m).
2. **Crossover** UTP (like devices: Switch ↔ Switch).
3. **Fiber-optic** (400 m exceeds the 100 m copper UTP limit, and fiber is immune to lightning/EMI outdoors).
:::

## Common mistakes

- Running UTP Ethernet beyond **100 meters**—signal attenuation causes packet loss; use fiber or add a switch/repeater.
- Using a **straight-through** cable between two PCs in Packet Tracer when Auto-MDIX is off (the link stays red!).
- Thinking **fiber-optic** carries electricity. It carries pulses of **light**, so it is immune to electromagnetic interference.

## Key terms

- UTP (Unshielded Twisted Pair) | standard copper Ethernet cable with 4 twisted wire pairs | korumalı olmayan bükümlü çift kablo (UTP)
- fiber-optic cable | glass or plastic strand that carries data as pulses of light | fiber optik kablo
- straight-through cable | Ethernet cable wired identically at both ends (used for unlike devices) | düz kablo
- crossover cable | Ethernet cable with transmit and receive pairs swapped (used for like devices) | çapraz kablo
- EMI (Electromagnetic Interference) | electrical noise that can corrupt signals on copper cables | elektromanyetik girişim

## Quick check

? Which cable type is immune to electromagnetic interference (EMI) and supports runs well over 100 meters?
- Cat5e UTP ~~ UTP is copper (affected by EMI) and limited to 100 m
- Cat6 UTP ~~ Cat6 is still copper and limited to 100 m
* Fiber-optic ~~ fiber uses light pulses inside glass, making it immune to EMI and suitable for long runs
- Coaxial ~~ coaxial uses copper and is still susceptible to strong EMI
! Fiber-optic cables transmit light rather than electricity, so EMI does not affect them.

? Without Auto-MDIX, which Ethernet cable connects a **PC directly to another PC**?
- Straight-through ~~ straight-through connects unlike devices (PC to switch, switch to router)
* Crossover ~~ crossover swaps transmit and receive pins so two like devices can talk
- Rollover (console) ~~ console cables connect a PC serial port to a router/switch console port for CLI setup
- Coaxial ~~ PCs use RJ-45 twisted pair, not coax
! Like devices (PC–PC, Switch–Switch, Router–Router) require a crossover cable when Auto-MDIX is absent.

? What is the maximum recommended length for a standard Cat5e/Cat6 Ethernet UTP cable run?
- 10 meters ~~ 10 m is typical for Bluetooth, not Ethernet
- 50 meters ~~ Ethernet UTP goes farther than 50 m
* 100 meters ~~ 100 m is the standard Ethernet twisted-pair distance limit
- 2,000 meters ~~ 2 km applies to multi-mode fiber, not copper UTP
! Standard Ethernet over twisted-pair copper is rated up to 100 meters.
