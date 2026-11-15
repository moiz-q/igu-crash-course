---
id: net-09
title: The TCP/IP model, TCP vs. UDP, and ports
goal: map the 4-layer TCP/IP model to OSI, contrast TCP and UDP, and match common application protocols to their port numbers
week: 9
minutes: 20
---

While the OSI model has 7 layers for teaching and troubleshooting, the real internet runs on the **4-layer TCP/IP model**.


@widget viz name=net-tcpudp

## TCP/IP vs. OSI

| TCP/IP Layer | Equivalent OSI Layers | Key protocols |
| --- | --- | --- |
| **Application** | 7 (Application), 6 (Presentation), 5 (Session) | HTTP, HTTPS, DNS, DHCP, FTP, SSH, SMTP |
| **Transport** | 4 (Transport) | **TCP**, **UDP** |
| **Internet** | 3 (Network) | **IPv4**, **IPv6**, ICMP, ARP |
| **Network Access (Link)** | 2 (Data Link), 1 (Physical) | Ethernet, Wi-Fi (802.11) |

## TCP vs. UDP (Transport layer)

| Feature | **TCP** (Transmission Control Protocol) | **UDP** (User Datagram Protocol) |
| --- | --- | --- |
| **Connection** | Connection-oriented (**3-way handshake**: `SYN` → `SYN-ACK` → `ACK`) | Connectionless (send immediately) |
| **Reliability** | Reliable: ACKs, retransmits lost packets, preserves order | Best-effort: no ACKs, no retransmission |
| **Overhead** | Higher (20-byte header) | Low (8-byte header), very fast |
| **Use cases** | Web (HTTP/HTTPS), Email (SMTP), File transfer (FTP), SSH | Video calls, online gaming, DNS lookups, DHCP, streaming |

## Well-known port numbers (memorize for exams!)

A **port number** (0–65535) identifies which application on a host should receive the data. Well-known ports are `0–1023`.

| Port | Protocol | Purpose | Transport |
| --- | --- | --- | --- |
| **20 / 21** | FTP | File Transfer Protocol (data / control) | TCP |
| **22** | SSH | Secure encrypted remote shell | TCP |
| **23** | Telnet | Unencrypted remote shell (insecure) | TCP |
| **25** | SMTP | Sending outgoing email | TCP |
| **53** | DNS | Translating domain names (e.g., `igu.edu.tr`) to IP addresses | UDP (mostly) / TCP |
| **67 / 68** | DHCP | Automatically assigning IP addresses to clients | UDP |
| **80** | HTTP | Unencrypted web pages | TCP |
| **443** | HTTPS | Encrypted web pages (HTTP + TLS) | TCP |
| **143** | IMAP | Read email that stays on the server (sync across devices) | TCP |
| **3389** | RDP | Remote Desktop (control a Windows PC over the network) | TCP |

## Try it

Order the 4 TCP/IP layers (top to bottom) and match common protocols to their default port numbers:

@widget order set=tcpip

@widget match set=ports

## Common mistakes

- Thinking **UDP** is "bad" because it is unreliable. Real-time voice/video and gaming prefer UDP because waiting to retransmit a lost 20 ms audio frame would cause lag.
- Confusing **port 80 (HTTP)** and **port 443 (HTTPS)**, or **SSH (22)** and **Telnet (23)**.
- Forgetting that **DNS** uses port **53** and **DHCP** uses **67/68**.

## Key terms

- TCP/IP model | the 4-layer protocol architecture used by the modern internet | TCP/IP modeli
- TCP | reliable, connection-oriented transport protocol using a 3-way handshake | İletim Denetim Protokolü (TCP)
- UDP | fast, connectionless transport protocol with low overhead | Kullanıcı Datagram Protokolü (UDP)
- port number | a 16-bit number identifying a specific service or application on a host | port numarası
- three-way handshake | TCP's `SYN`, `SYN-ACK`, `ACK` sequence to open a connection | üçlü el sıkışma

## Quick check

? Which protocol uses a **3-way handshake** (`SYN`, `SYN-ACK`, `ACK`) to guarantee reliable, ordered delivery?
- UDP ~~ UDP is connectionless and has no handshake
* TCP ~~ TCP establishes a connection with SYN, SYN-ACK, ACK and retransmits lost segments
- IP ~~ IP is Layer 3 best-effort packet routing
- ICMP ~~ ICMP sends diagnostic messages like ping
! TCP guarantees reliable delivery via sequence numbers, acknowledgments, and the 3-way handshake.

? Which port number does **HTTPS** (encrypted web traffic) use by default?
- 22 ~~ port 22 is SSH
- 53 ~~ port 53 is DNS
- 80 ~~ port 80 is unencrypted HTTP
* 443 ~~ port 443 is HTTPS
! HTTP uses TCP port 80; HTTPS uses TCP port 443.

? Why do live voice and video calls usually use **UDP** instead of **TCP**?
- UDP encrypts audio automatically ~~ neither TCP nor UDP encrypts by itself (TLS/DTLS does)
* UDP avoids retransmission delays and has smaller headers, keeping live audio smooth ~~ a late retransmitted packet is useless in a live call
- UDP uses IP addresses while TCP does not ~~ both run on top of IP
- TCP cannot carry audio or video files ~~ TCP can carry any bytes, just with higher latency on loss
! Real-time media tolerates small drops better than retransmission stalls, so UDP is preferred.
