---
id: net-11
title: IPv4 classes, private IPs, NAT, and IPv6
goal: identify IPv4 address classes and special ranges, explain why NAT exists, and recognize IPv6 address notation
week: 10–11
minutes: 18
---

Before modern CIDR subnetting, IPv4 addresses were divided into fixed classes. Even today, you must know the **class ranges** and **private IP ranges** for exams and lab setups.

## Traditional IPv4 classes (by first octet)

| Class | First octet | Default mask | Use |
| --- | --- | --- | --- |
| **A** | `1 – 126` | `255.0.0.0` (`/8`) | Very large networks |
| **B** | `128 – 191` | `255.255.0.0` (`/16`) | Medium-to-large networks |
| **C** | `192 – 223` | `255.255.255.0` (`/24`) | Small LANs (up to 254 hosts) |
| **D** | `224 – 239` | — | Multicast (group streaming) |
| **E** | `240 – 255` | — | Experimental / reserved |

### Special reserved IPv4 addresses
- **`127.0.0.0/8` (`127.0.0.1`)**: **Loopback**—tests your own PC's TCP/IP stack (`ping 127.0.0.1`).
- **`169.254.0.0/16`**: **APIPA**—self-assigned by Windows/macOS when a DHCP server cannot be reached.

## Private vs. public IPv4 & NAT

There are only ~4.3 billion IPv4 addresses—not enough for every phone and laptop on Earth. **RFC 1918** reserves three **private** ranges for internal LANs (not routable on the public internet):

| Class | Private IPv4 range | CIDR |
| --- | --- | --- |
| **A** | `10.0.0.0` – `10.255.255.255` | `10.0.0.0/8` |
| **B** | `172.16.0.0` – `172.31.255.255` | `172.16.0.0/12` |
| **C** | `192.168.0.0` – `192.168.255.255` | `192.168.0.0/16` |

**NAT (Network Address Translation)** runs on your home or campus router. It translates your LAN's private IPs (like `192.168.1.10`) into the router's single **public IP** when traffic goes out to the internet.

## IPv6 overview

**IPv6** solves IPv4 exhaustion permanently with **128-bit** addresses ($3.4 \times 10^{38}$ addresses!), written as **8 groups of 4 hex digits** separated by colons:

```text
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```
Shortening rules:
1. Drop leading zeros in each group (`0db8` → `db8`).
2. Replace one consecutive block of all-zero groups with `::` (`2001:db8:85a3::8a2e:370:7334`). Loopback in IPv6 is `::1`.

## Try it

Classify each IPv4 address as **Public**, **Private**, **Loopback**, or **APIPA**:
1. `192.168.10.5`
2. `172.20.4.1`
3. `172.32.4.1`
4. `169.254.12.88`
5. `8.8.8.8`

:::reveal Show answer
1. `192.168.10.5` → **Private** (Class C private range `192.168.0.0/16`)
2. `172.20.4.1` → **Private** (inside `172.16.0.0` – `172.31.255.255`)
3. `172.32.4.1` → **Public** (just outside `172.31.255.255`!)
4. `169.254.12.88` → **APIPA** (DHCP failure fallback)
5. `8.8.8.8` → **Public** (Google Public DNS)
:::

## Common mistakes

- Thinking `172.32.0.1` is private. Only `172.16.0.0` through `172.31.255.255` is private!
- Thinking `127.0.0.1` is a public or private LAN IP. `127.0.0.0/8` is strictly **loopback** (never leaves your own host).
- Using `::` twice in a shortened IPv6 address. You may use `::` **at most once** per address, otherwise the length is ambiguous.

## Key terms

- private IP | an RFC 1918 IPv4 address used inside LANs and not routed on the public internet | özel IP
- NAT (Network Address Translation) | router feature that translates private LAN IPs to a public IP for internet access | Ağ Adresi Çevirisi (NAT)
- loopback (`127.0.0.1`) | special address pointing back to the local host for testing TCP/IP | geri döngü adresi
- APIPA (`169.254.x.x`) | automatic local IP assigned when a host cannot reach a DHCP server | APIPA
- IPv6 | 128-bit next-generation IP addressing written in hexadecimal | IPv6

## Quick check

? Which IPv4 address is a **private** address?
- `11.0.0.5` ~~ `10.x.x.x` is private; `11.x.x.x` is public
- `172.35.1.1` ~~ Class B private stops at `172.31.255.255`
* `172.18.5.10` ~~ falls inside `172.16.0.0` – `172.31.255.255`
- `192.169.1.1` ~~ `192.168.x.x` is private; `192.169.x.x` is public
! The three private IPv4 ranges are `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`.

? You run `ipconfig` on a Windows PC and see `169.254.44.12`. What happened?
- The PC has a static public IP ~~ `169.254.x.x` is APIPA, not public
* The PC failed to get an IP from a DHCP server and self-assigned an APIPA address ~~ check the cable or DHCP server
- The PC is using loopback ~~ loopback is `127.0.0.1`
- NAT is disabled on the router ~~ APIPA happens before reaching a router
! `169.254.0.0/16` (APIPA) indicates DHCP discovery failed.

? What is the main purpose of **NAT** on a home or campus edge router?
- To convert IPv6 addresses into MAC addresses ~~ NAT translates IPv4 addresses
* To let many devices with private LAN IPs share one (or a few) public IPv4 addresses ~~ NAT preserves scarce public IPv4 addresses
- To replace DNS servers ~~ DNS resolves domain names; NAT translates IPs
- To speed up Ethernet cables ~~ NAT is a Layer 3/4 address translation function
! NAT maps private internal IPs to public internet IPs.
