---
title: Computer Networks — Cheat Sheet
---

## 1. OSI (7) vs. TCP/IP (4) & PDUs

| OSI # | OSI Layer | TCP/IP Layer | PDU | Key protocols / devices |
| --- | --- | --- | --- | --- |
| **7** | Application | Application | Data | HTTP, HTTPS, DNS, DHCP, SSH, FTP |
| **6** | Presentation | Application | Data | TLS encryption, JPEG, UTF-8 |
| **5** | Session | Application | Data | Session management |
| **4** | Transport | Transport | **Segment** | TCP (reliable), UDP (fast), ports |
| **3** | Network | Internet | **Packet** | IPv4, IPv6, ICMP, **Router** |
| **2** | Data Link | Network Access | **Frame** | Ethernet, Wi-Fi, MAC, **Switch** |
| **1** | Physical | Network Access | **Bit** | UTP (100 m), Fiber, **Hub** |

## 2. Well-known ports

`20/21` FTP · `22` SSH · `23` Telnet · `25` SMTP · `53` DNS · `67/68` DHCP · `80` HTTP · `443` HTTPS

## 3. IPv4 classes & private ranges (RFC 1918)

- **Class A**: `1–126` (`/8`) · Private: `10.0.0.0/8`
- **Class B**: `128–191` (`/16`) · Private: `172.16.0.0 – 172.31.255.255` (`/12`)
- **Class C**: `192–223` (`/24`) · Private: `192.168.0.0/16`
- **Loopback**: `127.0.0.1` · **APIPA (DHCP fail)**: `169.254.0.0/16`

## 4. Subnetting quick reference

- **Usable hosts** = $2^h - 2$ (subtract Network ID + Broadcast)
- **Block size** = $256 - \text{interesting mask octet}$

| CIDR | Mask | Block | Usable |
| --- | --- | --- | --- |
| `/24` | `.0` | 256 | 254 |
| `/25` | `.128` | 128 | 126 |
| `/26` | `.192` | 64 | 62 |
| `/27` | `.224` | 32 | 30 |
| `/28` | `.240` | 16 | 14 |
| `/29` | `.248` | 8 | 6 |
| `/30` | `.252` | 4 | 2 |

## 5. Cabling & diagnostic commands

- **Straight-through**: unlike devices (`PC ↔ Switch`, `Switch ↔ Router`). **Crossover**: like devices (`PC ↔ PC`, `Switch ↔ Switch`).
- `ipconfig /all` (IP, mask, gateway, MAC, DNS) · `ping` (ICMP test) · `tracert` (router hops) · `nslookup` (DNS) · `arp -a` (IP→MAC) · `netstat -an` (ports)
