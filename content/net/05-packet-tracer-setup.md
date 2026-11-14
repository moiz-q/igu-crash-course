---
id: net-05
title: Cisco Packet Tracer setup and workspace
goal: install or open Cisco Packet Tracer, navigate its device panels and modes, and place and cable devices cleanly
week: 4
minutes: 15
---

**Cisco Packet Tracer** is a free network simulator used in İGÜ's Computer Networks labs. It lets you build virtual LANs and WANs, assign IP addresses, run `ping`, and watch packets travel step by step—without needing physical switches or routers at home.

## Getting Packet Tracer

1. Create a free **Cisco Networking Academy** account at `netacad.com` (or use your university-provided installer).
2. Download **Cisco Packet Tracer** for Windows (64-bit) or macOS and install it.
3. Sign in once when prompted, then you can save and open `.pkt` lab files offline.

## Key parts of the workspace

| Area | Where it is | What it does |
| --- | --- | --- |
| **Logical / Physical** | Top-left bar | **Logical** is where you draw and cable networks; **Physical** shows racks/rooms |
| **Device-Type Selection** | Bottom-left | Categories: Network Devices (Routers, Switches), End Devices (PCs, Servers), Connections (Cables) |
| **Specific Devices** | Bottom-center | Exact models inside the chosen category (e.g., `2960-24TT` switch, `PC-PT`, `1941` router) |
| **Realtime vs. Simulation** | Bottom-right | **Realtime** runs immediately; **Simulation** pauses time so you can step through each packet |
| **Simple PDU (envelope)** | Right toolbar | Quick icon to test `ping` between two clicked devices |

## Reading link lights

- **Green triangle**: the link is up and ready.
- **Amber (orange) circle** on a switch port: Spanning Tree Protocol is checking for loops—wait ~30 seconds (or click **Fast Forward Time** `Alt+D` in the bottom bar) until it turns green.
- **Red triangle**: port is shut down, unplugged, or using the wrong cable type.

## Try it

Open Cisco Packet Tracer on your computer and complete this setup checklist:

:::checklist Packet Tracer readiness checklist
- Installed and signed into Cisco Packet Tracer
- Located End Devices → PC (`PC-PT`) and Network Devices → Switches (`2960-24TT`)
- Found Connections → Copper Straight-Through (solid black line) and Copper Cross-Over (dashed black line)
- Switched between **Realtime** and **Simulation** modes in the bottom-right corner
- Tested **Fast Forward Time** (`Alt+D`) to skip the 30-second switch port startup delay
:::

## Common mistakes

- Using the **Lightning Bolt (Automatically Choose Connection Type)** for everything. It hides whether a link needs straight-through or crossover—practice picking the exact cable!
- Thinking a PC cannot talk because the switch port is **orange/amber**. Switch ports take ~30 seconds to turn green unless you click **Fast Forward Time**.
- Trying to delete a device with `BackSpace` when the **Select** tool isn't active—press `Esc` or click the Select arrow first, or use the **Delete (X)** tool carefully.

## Key terms

- Packet Tracer | Cisco's network simulation software for building and testing virtual topologies | Packet Tracer
- Realtime mode | simulation mode where network traffic runs at normal speed | gerçek zamanlı mod
- Simulation mode | step-by-step mode for inspecting individual packets (PDUs) | simülasyon modu
- PDU (Protocol Data Unit) | a packet or frame envelope tracked in Packet Tracer | protokol veri birimi (PDU)

## Quick check

? What does an **amber (orange) circle** on a newly connected switch port mean in Packet Tracer?
- The cable is broken ~~ a broken or wrong cable shows red triangles
* The switch port is still initializing (Spanning Tree listening/learning) ~~ wait ~30 seconds or click Fast Forward Time
- The PC has a duplicate IP address ~~ Spanning Tree happens at Layer 2 before IP traffic
- The switch has no power ~~ an unpowered device shows red or no lights
! Newly cabled switch ports stay amber briefly while Spanning Tree checks for Layer 2 loops.

? Which mode should you use to watch an ICMP ping packet hop from PC0 to Switch0 to PC1 step by step?
- Physical mode ~~ Physical mode shows racks and rooms, not packet-by-packet steps
- Realtime mode ~~ Realtime runs immediately without pausing at each hop
* Simulation mode ~~ Simulation mode lets you click Capture/Forward to trace every hop
- Config tab ~~ Config tab edits device settings
! Simulation mode pauses time and lets you inspect each PDU at every device.

? In Packet Tracer's Connections category, what does a **dashed black line** represent?
- Copper Straight-Through ~~ straight-through is a solid black line
* Copper Cross-Over ~~ cross-over is a dashed black line
- Fiber ~~ fiber is an orange line
- Console ~~ console is a light-blue curved line
! Solid black = Copper Straight-Through; dashed black = Copper Cross-Over.
