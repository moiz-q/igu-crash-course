---
id: net-16
title: Network security, firewalls, and VPNs
goal: explain the CIA triad, recognize common network attacks, and describe how firewalls, ACLs, and VPNs protect a network
week: 15
minutes: 18
---

Connecting a network to the internet exposes it to attackers. **Network security** aims to keep systems working and data safe using three core goals called the **CIA triad**.

## The CIA triad

- **Confidentiality**: only authorized people can read the data (protected by **encryption** like HTTPS/TLS and VPNs).
- **Integrity**: data is not altered in transit (protected by **hashes** and digital signatures).
- **Availability**: authorized users can access services when needed (protected by backups, redundancy, and **DoS** defense).

## Common network threats

| Threat | What happens | Defense |
| --- | --- | --- |
| **Phishing** | Fake email/website tricks a user into typing a password | User awareness, MFA, email filters |
| **Sniffing / Eavesdropping** | Attacker captures unencrypted packets on Wi-Fi or a shared LAN | Encrypt traffic (**HTTPS**, **SSH**, **VPN**) |
| **Man-in-the-Middle (MITM)** | Attacker secretly intercepts and alters traffic between two hosts | TLS certificates, WPA2/WPA3, ARP inspection |
| **DoS / DDoS** | Floods a server with fake traffic so real users cannot connect | Rate limiting, DDoS scrubbing, firewalls |

## Firewalls, ACLs, and VPNs

- **Firewall**: inspects traffic entering or leaving a network and allows or blocks it based on rules (IP address, port number, protocol).
  - **Packet-filtering (stateless)**: checks each packet's header against rules one by one.
  - **Stateful firewall**: remembers active connections (so it automatically allows replies to traffic you started).
- **ACL (Access Control List)**: ordered list of `permit` / `deny` rules applied to a router interface. Rules are checked **top to bottom**—first match wins!
- **VPN (Virtual Private Network)**: creates an **encrypted tunnel** over the public internet so remote workers or students can safely reach an internal campus/company network.

## Try it

A router ACL has these rules in order:
1. `deny tcp any any eq 23` (Telnet)
2. `permit tcp 192.168.1.0 0.0.0.255 any eq 80` (HTTP)
3. `deny ip any any` (implicit/explicit deny all)

What happens to:
- A Telnet packet (port 23) from `192.168.1.10`?
- An HTTPS packet (port 443) from `192.168.1.10`?

:::reveal Show answer
- **Telnet (port 23)**: matches Rule 1 → **Denied** (Telnet is unencrypted, so blocking it is good practice).
- **HTTPS (port 443)**: does not match Rule 1 or Rule 2 (port 80) → hits Rule 3 → **Denied**. (If you want HTTPS allowed, you must add a `permit ... eq 443` rule before `deny ip any any`!)
:::

## Common mistakes

- Putting `deny ip any any` **at the top** of an ACL—because ACLs stop at the **first match**, nothing below it will ever run!
- Confusing **encryption** (protects **Confidentiality**) with **backups/redundancy** (protects **Availability**).
- Using **Telnet (port 23)** or **HTTP (port 80)** for admin logins—anyone sniffing the LAN can read your password in plain text; use **SSH (22)** and **HTTPS (443)**.

## Key terms

- CIA triad | Confidentiality, Integrity, Availability — the three core goals of security | CIA üçlüsü
- firewall | a security device or software that filters network traffic using rules | güvenlik duvarı
- ACL (Access Control List) | an ordered list of permit/deny rules on a router interface | erişim denetim listesi
- VPN (Virtual Private Network) | an encrypted tunnel carrying private traffic safely across a public network | sanal özel ağ (VPN)
- DDoS | Distributed Denial of Service — flooding a target from many machines to knock it offline | dağıtık hizmet reddi saldırısı

## Quick check

? Which part of the **CIA triad** is protected when you switch from HTTP to **HTTPS** so attackers on public Wi-Fi cannot read your password?
* Confidentiality ~~ encryption keeps data secret from unauthorized eavesdroppers
- Availability ~~ availability keeps services online
- Non-repudiation ~~ non-repudiation is not one of the three CIA letters
- Redundancy ~~ redundancy is for availability, not secrecy
! Encryption protects Confidentiality.

? How does a router process rules in an **ACL (Access Control List)**?
- Bottom to top, applying the most specific rule ~~ ACLs are strictly top-down
* Top to bottom, stopping at the first matching rule ~~ order matters critically in ACLs
- Randomly, to balance CPU load ~~ ACL evaluation is deterministic
- Only on UDP packets ~~ ACLs filter IP, TCP, UDP, and ICMP
! ACLs evaluate rules sequentially from top to bottom and act on the first match.

? What is the main purpose of a **VPN**?
- To increase your ISP's physical cable speed ~~ encryption adds slight overhead rather than raw speed
* To create an encrypted tunnel over an untrusted public network ~~ keeps remote traffic private and authenticated
- To replace MAC addresses with domain names ~~ that is unrelated to VPNs
- To disable firewalls on your laptop ~~ VPNs complement firewalls
! A VPN builds an encrypted tunnel across public networks like the internet.
