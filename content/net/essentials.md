---
title: Computer networks — the essentials
minutes: 25
intro: devices, layers, ports, IP addresses, subnetting, commands
---

A network is computers **sending messages to each other** through cables or radio. The exam is multiple choice, so you need clear ideas and a few facts. Six ideas cover most of it.

:::idea Network types and shapes
- By size: **PAN** (your phone + earbuds) < **LAN** (a building) < **MAN** (a city) < **WAN** (countries; the Internet is the biggest WAN).
- By shape (**topology**): **star** — everything connects to one central switch (the most common today); **bus** — one shared cable; **ring** — a circle; **mesh** — many links, very reliable.
- **Client–server:** one computer serves many (a website). **Peer-to-peer:** everyone is equal.

[Go deeper: topologies and types](#/lesson/net-02)
:::

:::idea The main devices
| Device | Job in one line |
| --- | --- |
| **Switch** | connects devices **inside** a LAN and sends each message only to the right one (uses MAC addresses) |
| **Router** | connects **different networks** together, e.g. your home to the Internet (uses IP addresses) |
| **Access point** | adds Wi-Fi to a network |
| **Firewall** | allows or blocks traffic using rules |
| **NIC** | the network card inside each computer |

Cables: **UTP twisted pair** with **RJ-45** plugs (most LANs), **fibre** for long or fast links (uses light).

[Go deeper: devices](#/lesson/net-03) · [cables](#/lesson/net-04)
:::

:::idea The layer models
Sending data is split into **layers**; each does one job. The **OSI model** has 7:

| # | Layer | Think of it as | Example |
| --- | --- | --- | --- |
| 7 | Application | the app you use | HTTP, DNS, email |
| 6 | Presentation | translating & encrypting | TLS, JPEG |
| 5 | Session | keeping the conversation open | |
| 4 | Transport | reliable delivery, ports | **TCP, UDP** — *segment* |
| 3 | Network | addresses and routes | **IP**, router — *packet* |
| 2 | Data link | the local hop | MAC, switch — *frame* |
| 1 | Physical | bits on the wire | cables, hub — *bits* |

Memory aid (top → bottom): **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing. **TCP/IP** is the real-world version with 4 layers: Application, Transport, Internet, Network Access.

[Go deeper: OSI](#/lesson/net-07) · [TCP/IP](#/lesson/net-09)
:::

:::idea TCP vs. UDP, and ports
- **TCP** = careful: connection first, checks every piece arrived, resends lost ones (web, email, files).
- **UDP** = fast: no checks (video calls, games, DNS).

A **port** number says which program gets the data. Learn these: **HTTP 80**, **HTTPS 443**, **DNS 53**, **SSH 22**, **FTP 20/21**, **SMTP 25** (send mail), **DHCP 67/68**, **RDP 3389**.

[Go deeper: TCP, UDP and ports](#/lesson/net-09)
:::

:::idea IP addresses and subnetting
An **IPv4 address** is 4 numbers 0–255: `192.168.1.10` (32 bits). The **subnet mask** (or **/prefix**) says which part is the **network** and which part is the **host**.

`192.168.1.10/24` → mask `255.255.255.0` → network `192.168.1.0`, broadcast `192.168.1.255`, usable hosts `.1`–`.254`.

**Usable hosts = 2^(host bits) − 2** (minus the network and broadcast addresses). /24 → 8 host bits → 254 hosts. /26 → 6 host bits → 62 hosts.

Also know: private ranges **10.x.x.x**, **172.16–31.x.x**, **192.168.x.x**; **127.0.0.1** = this computer (loopback); **DHCP** gives addresses automatically; **DNS** turns names into IPs. **IPv6** is 128 bits, written in hexadecimal: `2001:db8::1`.

Subnetting is the topic most likely to cost marks — do the drills until they are boring.

[Go deeper: subnetting](#/lesson/net-12) · [Unlimited subnetting drills](#/tool/subnet-drill)
:::

:::idea Commands to test a network
| Command | Tells you |
| --- | --- |
| `ping 8.8.8.8` | can I reach that address? |
| `ipconfig` (`/all`) | my IP, mask, gateway, DNS (Windows; `ip addr` on Linux) |
| `tracert google.com` | every router on the way |
| `nslookup google.com` | which IP a name has (DNS check) |
| `netstat` | open connections and ports |
| `arp -a` | IP ↔ MAC table |

[Go deeper: commands](#/lesson/net-14)
:::

:::remember If you remember only this
- Switch = inside a LAN (MAC). Router = between networks (IP).
- OSI 7 layers: All People Seem To Need Data Processing. PDUs: segment → packet → frame → bits.
- TCP reliable, UDP fast. HTTP 80, HTTPS 443, DNS 53, SSH 22.
- Hosts = 2^h − 2. /24 = 254, /25 = 126, /26 = 62, /27 = 30, /28 = 14, /29 = 6, /30 = 2.
- `ping` = reachable? `ipconfig` = my settings. `tracert` = the path.
:::

## Quick check

? Which device connects two different networks, such as your home LAN and the Internet?
- switch ~~ works inside one LAN
* router ~~ routes between networks using IP addresses
- hub ~~ repeats signals in one LAN
- NIC ~~ the card inside a computer
! Router = between networks.

? At which OSI layer do IP addresses and routers work?
- Layer 2 (Data link) ~~ that's MAC and switches
* Layer 3 (Network) ~~ IP, routing, packets
- Layer 4 (Transport) ~~ that's TCP/UDP
- Layer 7 (Application) ~~ that's HTTP, DNS
! Network layer = IP.

? Which port does HTTPS use?
- 80 ~~ HTTP (not encrypted)
- 53 ~~ DNS
* 443 ~~ HTTPS
- 22 ~~ SSH
! HTTPS = 443.

? How many usable hosts does a /27 network have?
- 32 ~~ subtract network and broadcast
* 30 ~~ 2^5 − 2
- 62 ~~ that's /26
- 14 ~~ that's /28
! /27 → 5 host bits → 32 − 2 = 30.

? Which command shows your computer's IP address and default gateway on Windows?
- ping ~~ tests reachability
- tracert ~~ shows the path
* ipconfig ~~ shows IP settings
- nslookup ~~ DNS lookups
! `ipconfig` (add `/all` for more).
