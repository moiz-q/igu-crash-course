---
id: net-01
title: Network basics and internet history
goal: explain what a computer network is, compare client-server and peer-to-peer models, and trace the key milestones of the internet
week: 1
minutes: 15
---

A **computer network** is two or more devices connected together so they can share data and resources (such as files, printers, or an internet connection). Every time you send a message or load a web page, your device is talking across a network.


@widget viz name=net-sizes

## What makes a network work?

Every network needs four basic pieces:

- **End devices (hosts)**: computers, phones, or servers that send and receive data.
- **Intermediary devices**: switches and routers that forward data along the right path.
- **Transmission media**: copper cables, fiber-optic cables, or radio waves (Wi-Fi) that carry signals.
- **Protocols**: agreed-upon rules (such as **IP**, **TCP**, and **HTTP**) so both sides speak the same language.

## Client-server vs. peer-to-peer

| Model | How it works | Example |
| --- | --- | --- |
| **Client-server** | Dedicated **servers** store data or run services; **clients** request them | Web browser (client) loading a page from a web server |
| **Peer-to-peer (P2P)** | Every device acts as both client and server; no central server is required | Two laptops sharing files directly over Wi-Fi |

Client-server networks are easier to secure and back up centrally. Peer-to-peer networks are cheap and quick to set up for a few devices, but harder to manage as they grow.

## A brief history of the internet

The **internet** is a global "network of networks" connecting millions of private, academic, business, and government networks.

```timeline
1969 | ARPANET | The US Department of Defense connects four university computers. It introduces packet switching, splitting messages into small chunks instead of holding one phone line open. | 1
1983 | TCP/IP becomes standard | ARPANET adopts TCP/IP as its core protocol suite, letting different kinds of networks talk to each other. This is often called the birth of the modern internet. | 1
1989 | World Wide Web invented | Tim Berners-Lee at CERN proposes hypertext documents (HTML), URLs, and HTTP—making the internet easy for non-specialists to browse. | 1
1990s–present | Commercial & mobile era | ISPs open the internet to the public; broadband, Wi-Fi, cloud computing, and smartphones connect billions of devices worldwide. | 1
```

## Try it

Look at three actions you did online today (for example: watching a video, checking email, or messaging a friend). For each one, identify:
1. What is the **client**?
2. What is the **server**?
3. What **medium** carried the first hop from your device (Wi-Fi, cellular, or Ethernet cable)?

:::reveal Show sample answer
- **Watching a video**: Client = your phone's video app; Server = the video platform's streaming server; First hop = Wi-Fi or 4G/5G cellular.
- **Checking email**: Client = your browser or mail app; Server = the university/provider mail server; First hop = Ethernet cable or Wi-Fi.
:::

## Common mistakes

- Confusing the **internet** (the global network infrastructure of cables, routers, and IP) with the **World Wide Web** (websites and HTTP running on top of the internet).
- Thinking a **protocol** is hardware. A protocol is a set of rules (software/standard), not a cable or box.
- Assuming peer-to-peer means "no internet." P2P devices can be across the internet or on the same local Wi-Fi.

## Key terms

- computer network | two or more devices connected to share data and resources | bilgisayar ağı
- protocol | a standard set of rules that governs how data is formatted and sent | protokol
- client | a device or program that requests a service or data | istemci
- server | a device or program that provides data or services to clients | sunucu
- packet | a small formatted chunk of data sent across a network | paket

## Quick check

? What is the main difference between the internet and the World Wide Web?
- They are two names for the exact same system ~~ the Web is only one service running on top of the internet
* The internet is the global network of connected networks, while the Web is a system of websites and pages running on it ~~ correct: email, SSH, and file transfers use the internet without being the Web
- The Web is hardware cables and the internet is only browsers ~~ reversed: cables and routers belong to the internet infrastructure
- The Web came first in 1969 and the internet was added in 1989 ~~ reversed: ARPANET (1969) came 20 years before the Web (1989)
! The internet is the underlying network infrastructure; the World Wide Web (HTTP/HTML) is one application running over it.

? Which statement best describes a **client-server** network?
- Every computer has equal responsibility and there is no central server ~~ that describes peer-to-peer (P2P)
* Clients request resources and dedicated servers respond with those resources ~~ centralized servers make security and backups easier
- Devices can only connect using copper cables ~~ client-server works over any medium, including Wi-Fi and fiber
- Only two devices can communicate at a time ~~ servers handle requests from many clients
! In a client-server model, specialized servers host data or services for many clients.

? Why was **packet switching** (used in ARPANET) important?
- It required a dedicated physical wire between every pair of users ~~ that was circuit switching, not packet switching
- It encrypted all web pages with HTTPS in 1969 ~~ HTTPS was invented much later after the Web
* It broke messages into small packets that could share links and route around failures ~~ multiple conversations could share the same cables efficiently
- It allowed only one computer to send data per hour ~~ packet switching improved sharing and throughput
! Packet switching splits data into small packets so links are shared efficiently and traffic can reroute if a link fails.
