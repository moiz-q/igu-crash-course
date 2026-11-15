---
title: Computer networks — the essentials
minutes: 20
intro: devices, layers, ports, IP addresses, subnetting, commands
---

A network is computers **passing messages**. Seven pictures cover most of the exam.

:::idea Sizes and shapes
@widget viz name=net-sizes
@widget viz name=net-topos
[Go deeper](#/lesson/net-02)
:::

:::idea Switch inside, router between
@widget viz name=net-lan
Cables: **UTP** with **RJ-45** plugs for LANs, **fibre** (light) for long, fast links. [Go deeper](#/lesson/net-03)
:::

:::idea Seven layers
@widget viz name=net-osi
[Go deeper](#/lesson/net-07)
:::

:::idea Each layer adds a header
@widget viz name=net-encap
[Go deeper](#/lesson/net-07)
:::

:::idea TCP is careful, UDP is fast
@widget viz name=net-tcpudp
Ports: **HTTP 80 · HTTPS 443 · DNS 53 · SSH 22 · FTP 20/21 · SMTP 25 · DHCP 67/68 · RDP 3389**. [Go deeper](#/lesson/net-09)
:::

:::idea IP addresses and subnetting
@widget viz name=net-ip
Private: `10.x` · `172.16–31.x` · `192.168.x` — loopback `127.0.0.1`. [Practise subnetting](#/tool/subnet-drill) until it's boring.
:::

:::idea Testing with commands
@widget viz name=net-ping
`ipconfig` = my IP and gateway · `nslookup` = name → IP · `netstat` = open connections · `arp -a` = IP ↔ MAC. [Go deeper](#/lesson/net-14)
:::

:::remember If you remember only this
- switch = inside a LAN (MAC) · router = between networks (IP)
- OSI: **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing
- TCP reliable · UDP fast · HTTPS 443
- hosts = 2^host-bits − 2: /24 254 · /26 62 · /27 30 · /30 2
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
