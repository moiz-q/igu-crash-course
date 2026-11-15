---
id: net-07
title: The OSI 7-layer model and encapsulation
goal: name all seven OSI layers in order, describe what each layer does, and trace data encapsulation through PDUs
week: 6
minutes: 20
---

Sending a message across a network involves many jobs: formatting text, breaking data into chunks, adding IP addresses, adding MAC addresses, and putting electrical pulses on a wire. The **OSI (Open Systems Interconnection) model** splits these jobs into **7 layers** so engineers can design and troubleshoot each part independently.


@widget viz name=net-osi
@widget viz name=net-encap

## The 7 OSI layers (top to bottom)

| # | Layer | Main job | PDU name | Example |
| --- | --- | --- | --- | --- |
| **7** | **Application** | Network services directly for apps | Data | HTTP, DNS, SMTP, FTP |
| **6** | **Presentation** | Data formatting, encryption, compression | Data | TLS/SSL, JPEG, UTF-8 |
| **5** | **Session** | Starts, manages, and closes conversations | Data | Session tokens, NetBIOS |
| **4** | **Transport** | Reliable/fast delivery, port numbers, segmentation | **Segment** (TCP) / Datagram (UDP) | TCP, UDP |
| **3** | **Network** | Logical addressing & routing across networks | **Packet** | IPv4, IPv6, ICMP, Router |
| **2** | **Data Link** | Physical addressing (MAC), framing, error check | **Frame** | Ethernet, Wi-Fi, Switch |
| **1** | **Physical** | Raw bits on wires, fiber, or radio waves | **Bit** | Cat6, RJ-45, Hub |

:::tip Memory trick (Layer 7 → Layer 1)
"**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing" (Application, Presentation, Session, Transport, Network, Data Link, Physical).
:::

## Encapsulation and decapsulation

When you send data (moving **down** Layers 7 → 1):
1. Application creates **Data**.
2. Transport adds a TCP/UDP header (ports) → **Segment**.
3. Network adds an IP header (source & destination IP) → **Packet**.
4. Data Link adds a frame header (MAC addresses) and trailer (FCS error check) → **Frame**.
5. Physical turns the frame into **Bits** on the wire.

When the receiver gets the bits (moving **up** Layers 1 → 7), it strips off each header in reverse order (**decapsulation**).

## Try it

Practice ordering the 7 OSI layers, the encapsulation steps, and matching each layer to its PDU:

@widget order set=osi

@widget order set=encap

@widget match set=pdu

## Common mistakes

- Mixing up **Layer 2 (Data Link)** and **Layer 3 (Network)**. Remember: Layer 2 uses **MAC addresses** inside one LAN (**Frames**, Switches); Layer 3 uses **IP addresses** between networks (**Packets**, Routers).
- Putting **HTTP** or **web browsers** at Layer 1 or forgetting that **Application layer** means network protocols used by apps (not the user's desktop monitor).
- Reversing the encapsulation order: encapsulation goes **top-down (7 → 1)** on the sender; decapsulation goes **bottom-up (1 → 7)** on the receiver.

## Key terms

- OSI model | a 7-layer conceptual framework describing how network communication works | OSI modeli
- encapsulation | wrapping data with protocol headers as it moves down the layers | kapsülleme
- PDU (Protocol Data Unit) | the name of a chunk of data at a specific layer (segment, packet, frame, bit) | protokol veri birimi
- Data Link layer | Layer 2; handles MAC addressing, framing, and local error detection | Veri Bağlantısı katmanı
- Network layer | Layer 3; handles IP addressing and routing between networks | Ağ katmanı

## Quick check

? Which OSI layer is responsible for **logical (IP) addressing** and routing packets between networks?
- Physical (Layer 1) ~~ Layer 1 only moves raw bits
- Data Link (Layer 2) ~~ Layer 2 uses physical MAC addresses on the local link
* Network (Layer 3) ~~ Layer 3 routes packets using IP addresses
- Transport (Layer 4) ~~ Layer 4 handles ports and segmentation
! Layer 3 (Network) handles IP addresses and routing.

? What is the PDU called at **Layer 2 (Data Link)**?
- Bit ~~ Bit is Layer 1 (Physical)
* Frame ~~ Frame is Layer 2 (Data Link)
- Packet ~~ Packet is Layer 3 (Network)
- Segment ~~ Segment is Layer 4 (Transport)
! Data Link wraps packets into Frames (with source/destination MAC and FCS).

? Which OSI layer handles **encryption (TLS)** and **data format conversion (UTF-8, JPEG)**?
- Session (Layer 5) ~~ Session manages dialog setup and teardown
* Presentation (Layer 6) ~~ Presentation handles encoding, compression, and encryption
- Transport (Layer 4) ~~ Transport handles ports and reliability
- Application (Layer 7) ~~ Application provides app-level protocols like HTTP and DNS
! Layer 6 (Presentation) translates, compresses, and encrypts data.
