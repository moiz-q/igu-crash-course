---
id: net-02
title: Network topologies and types
goal: classify networks by geographic size (PAN, LAN, MAN, WAN) and compare bus, star, ring, mesh, tree, and hybrid topologies
week: 2
minutes: 18
---

Networks are described in two main ways: **how big an area they cover** (network type) and **how devices are arranged and connected** (topology).

## Network types by size

| Type | Full name | Typical range | Example |
| --- | --- | --- | --- |
| **PAN** | Personal Area Network | A few meters (1–10 m) | Bluetooth headphones paired to a phone |
| **LAN** | Local Area Network | One room, building, or campus | University computer lab or home Wi-Fi |
| **MAN** | Metropolitan Area Network | A city | Fiber ring linking municipal offices across a city |
| **WAN** | Wide Area Network | Across countries or globally | The internet, or bank branches across cities |

## Physical vs. logical topology

- **Physical topology**: how the cables and devices are actually laid out on desks, walls, and racks.
- **Logical topology**: the path data actually takes as it travels from device to device.

## Common network topologies

### Bus topology
All devices share a single backbone cable with terminators at both ends. Cheap to wire, but if the main cable breaks, the whole network goes down.

@widget topology type=bus

### Star topology
Every device connects to a central switch (or hub). If one cable fails, only that one device loses connection. This is the standard layout for modern Ethernet LANs.

@widget topology type=star

### Ring topology
Each device connects to two neighbors, forming a closed loop. Data travels in one direction (or both in a dual ring). A single break can disrupt a simple ring.

@widget topology type=ring

### Mesh topology
Devices have multiple redundant links to each other. A **full mesh** connects every node to every other node, giving high fault tolerance at high cable cost—common in core WAN routers.

@widget topology type=mesh

### Tree and hybrid topologies
- **Tree (hierarchical)**: a root switch connects to branch switches, forming levels—common in multi-floor campus buildings.
- **Hybrid**: combines two or more topologies (for example, star-wired floors linked by a mesh core).

@widget topology type=tree

@widget topology type=hybrid

## Try it

A university has 4 floors in its Engineering building. Each floor has 30 PCs wired to a floor switch, and the 4 floor switches connect to one core switch in the server room.
1. Is this network a PAN, LAN, MAN, or WAN?
2. Which topology does a single floor use?
3. Which topology describes the whole building?

:::reveal Show answer
1. **LAN** (one building on a campus).
2. **Star** topology (30 PCs connected to one central floor switch).
3. **Tree** (hierarchical) topology—multiple stars connected to a core switch.
:::

## Common mistakes

- Calling a home network a **WAN** just because it connects to the internet. Inside your home, it is a **LAN**; your ISP connects your LAN to the **WAN**.
- Confusing **bus** and **star**: in a star topology, a broken PC cable affects only that PC, whereas in a bus topology a broken backbone stops everyone.
- Thinking **mesh** is used for desktop PCs in a lab. Full mesh is too expensive for PCs; it is used between core routers or wireless mesh nodes.

## Key terms

- LAN (Local Area Network) | a network covering a small area such as a home, office, or campus building | yerel alan ağı
- WAN (Wide Area Network) | a network spanning cities, countries, or continents | geniş alan ağı
- topology | the physical or logical layout of devices and links in a network | topoloji
- star topology | a layout where every host connects to a central switch or hub | yıldız topoloji
- mesh topology | a layout with redundant links between devices for fault tolerance | örgü topoloji

## Quick check

? Which network type covers a single university computer lab?
- PAN ~~ PAN covers only a few meters around one person (like Bluetooth)
* LAN ~~ a Local Area Network covers a room, building, or campus
- MAN ~~ a Metropolitan Area Network spans a whole city
- WAN ~~ a Wide Area Network spans large geographic distances across cities or countries
! A single room or building network is a LAN.

? In which topology does a single broken backbone cable bring down the entire network?
- Star ~~ a broken drop cable in a star only disconnects that one device
* Bus ~~ every device shares the single backbone cable
- Full mesh ~~ mesh has redundant alternate paths
- Hybrid ~~ hybrid combines topologies and usually isolates failures
! In a bus topology, all hosts share one main cable, so a break or missing terminator stops communication.

? Why do modern office and campus LANs use **star** (and tree) topologies instead of bus?
- Star uses less cable than any other topology ~~ star actually uses more cable than bus because each host has its own run
- Star requires no central device ~~ star requires a central switch or hub
* A single cable fault only affects one host, making troubleshooting easy ~~ isolating faults to one port/cable is a major advantage
- Star only works with wireless devices ~~ Ethernet star networks use copper or fiber cables
! Star topologies isolate single cable failures and make adding or removing hosts simple.
