---
id: net-03
title: Network devices
goal: distinguish the roles of NICs, hubs, switches, routers, access points, and modems, and match each device to its OSI layer
week: 3
minutes: 18
---

Different network devices operate at different levels of intelligence. Understanding what each box reads—signals, MAC addresses, or IP addresses—tells you where to place it in a network.


@widget viz name=net-lan

## Core network devices

| Device | Main job | Address used | Layer |
| --- | --- | --- | --- |
| **NIC** | Connects a host (PC/server) to the network medium | MAC address | Layer 1–2 |
| **Repeater / Hub** | Boosts and repeats electrical signals to **all** other ports | None (raw bits) | Layer 1 |
| **Switch** | Learns MAC addresses and forwards frames **only** to the target port | MAC address | Layer 2 |
| **Access Point (AP)** | Bridges wireless Wi-Fi devices onto a wired Ethernet LAN | MAC address | Layer 2 |
| **Router** | Connects different networks (LANs) and chooses best paths | IP address | Layer 3 |
| **Modem** | Converts ISP line signals (DSL/cable/fiber) to digital data | — | Layer 1 |

## Hub vs. switch: why switches won

Suppose PC-A wants to send data to PC-C, and 4 PCs are plugged into the same box:

- **Hub (Layer 1)**: copies the signal out of **every** other port. PC-B and PC-D also hear it, wasting bandwidth and risking collisions (one shared **collision domain**).
- **Switch (Layer 2)**: reads the destination **MAC address**, checks its **MAC address table**, and sends the frame **only** to PC-C's port. Each port is its own collision domain.

## Switch vs. router

- A **switch** connects devices **inside the same network (LAN)** using MAC addresses. It forwards broadcasts to all ports in that LAN.
- A **router** connects **different networks** (for example, your home LAN to your ISP's WAN, or Lab 1 to Lab 2) using **IP addresses**. Routers stop LAN broadcasts from flooding the next network—each router interface marks a separate **broadcast domain**.

:::tip Home "Wi-Fi router"
The small box at home is actually 3–4 devices in one plastic case: a **modem** (or ONT), a **router**, a small 4-port **switch**, and a wireless **access point**.
:::

## Try it

Match each network device to the layer and address type it uses:

@widget match set=devlayer

## Common mistakes

- Saying a **switch** routes IP packets between different networks. A standard Layer 2 switch only forwards frames inside one LAN using MAC addresses; a **router** connects different networks.
- Thinking a **hub** and a **switch** do the same thing because they look similar. A hub broadcasts every bit to all ports; a switch forwards selectively.
- Confusing a **modem** with a **router**. A modem translates line signals from the ISP; a router directs IP packets between networks.

## Key terms

- NIC (Network Interface Card) | hardware component that connects a computer to a network | ağ bağdaştırıcısı (NIC)
- hub | a simple Layer 1 device that repeats incoming signals to all ports | göbek (hub)
- switch | a Layer 2 device that forwards frames based on MAC addresses | anahtar (switch)
- router | a Layer 3 device that forwards packets between different networks using IP addresses | yönlendirici (router)
- MAC address | a 48-bit physical hardware address burned into a NIC | MAC adresi

## Quick check

? Which device reads destination **MAC addresses** to send a frame only to the intended port?
- Hub ~~ a hub has no knowledge of addresses and repeats bits to every port
* Switch ~~ a switch builds a MAC address table and forwards frames to the matching port
- Repeater ~~ a repeater only regenerates signals at Layer 1
- Modem ~~ a modem converts between ISP line signals and digital signals
! Switches operate at Layer 2 and forward frames using MAC addresses.

? You need to connect two separate LANs (`192.168.1.0/24` and `192.168.2.0/24`). Which device do you need?
- Hub ~~ a hub only repeats Layer 1 signals inside one segment
- Standard Layer 2 switch ~~ a Layer 2 switch keeps all ports in the same broadcast domain and does not route between IP subnets
* Router ~~ a router operates at Layer 3 and forwards IP packets between different networks
- Repeater ~~ a repeater only extends cable distance
! Routers connect distinct IP networks and route packets between them.

? What is the main job of a wireless **Access Point (AP)**?
- To assign public IP addresses to websites ~~ DNS/ISPs handle public naming and routing
* To connect Wi-Fi clients to a wired Ethernet LAN ~~ an AP bridges wireless frames onto the wired switch network
- To amplify DSL telephone signals ~~ that is a DSL modem's job
- To replace all routers on the internet ~~ an AP operates at Layer 2 inside a LAN
! An access point lets wireless devices join a wired local network.
