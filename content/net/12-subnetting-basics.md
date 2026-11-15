---
id: net-12
title: Subnetting basics and CIDR
goal: calculate the network address, broadcast address, first/last usable host, and usable host count for an IPv4 CIDR subnet
week: 12
minutes: 25
---

**Subnetting** splits one large IPv4 network into smaller networks (**subnets**). This reduces broadcast traffic, improves security, and saves IP addresses.


@widget viz name=net-ip

## The subnet mask and CIDR (`/n`)

Every IPv4 address has two parts: the **network portion** (left) and the **host portion** (right). The **subnet mask** tells your device where the split happens:
- Mask `1` bits = **network**
- Mask `0` bits = **host**

**CIDR** (Classless Inter-Domain Routing) writes the count of `1` bits after a slash:

| CIDR | Subnet Mask | Host bits ($h$) | Usable hosts ($2^h - 2$) |
| --- | --- | --- | --- |
| `/24` | `255.255.255.0` | 8 | $2^8 - 2 = \mathbf{254}$ |
| `/25` | `255.255.255.128` | 7 | $2^7 - 2 = \mathbf{126}$ |
| `/26` | `255.255.255.192` | 6 | $2^6 - 2 = \mathbf{62}$ |
| `/27` | `255.255.255.224` | 5 | $2^5 - 2 = \mathbf{30}$ |
| `/28` | `255.255.255.240` | 4 | $2^4 - 2 = \mathbf{14}$ |
| `/29` | `255.255.255.248` | 3 | $2^3 - 2 = \mathbf{6}$ |
| `/30` | `255.255.255.252` | 2 | $2^2 - 2 = \mathbf{2}$ (router links!) |

Why **$- 2$**? Every subnet reserves two addresses that cannot be assigned to hosts:
1. **First address** (all host bits `0`): **Network Address** (identifies the subnet itself).
2. **Last address** (all host bits `1`): **Broadcast Address** (reaches every host in that subnet).

## Fast "block size" method (the exam shortcut!)

Suppose you are given `192.168.10.75/26`.
1. **Find the interesting octet**: `/26` means 24 network bits + 2 bits in the 4th octet (`255.255.255.192`).
2. **Block size** = $256 - 192 = \mathbf{64}$. Subnets step by `64`: `0, 64, 128, 192`.
3. **Locate `75`**: `75` falls between `64` and `128`!
   - **Network address**: `192.168.10.64`
   - **Next subnet**: `192.168.10.128` → so **Broadcast** is one less: `192.168.10.127`
   - **First usable host**: `192.168.10.65`
   - **Last usable host**: `192.168.10.126`
   - **Usable hosts**: $64 - 2 = 62$.

## Try it

Use the interactive Subnet Calculator below to verify `192.168.10.75/26`, `10.0.5.130/25`, and `172.16.1.5/30`:

@widget subnetcalc

## Common mistakes

- Assigning the **network address** (`.0`, `.64`, etc.) or **broadcast address** (`.255`, `.127`, etc.) to a PC. Packet Tracer and real OSes reject them!
- Forgetting to subtract **2** in $2^h - 2$ when asked for **usable hosts**.
- Using `256 - mask` on the wrong octet when the prefix is `/16`–`/23` (block size applies to the **3rd** octet there, with `.0` in the 4th).

## Key terms

- subnet mask | a 32-bit mask separating the network bits (1s) from host bits (0s) | alt ağ maskesi
- CIDR | Classless Inter-Domain Routing notation like `/26` counting network bits | CIDR gösterimi
- network address | the first address in a subnet (host bits all 0), identifying the subnet | ağ adresi
- broadcast address | the last address in a subnet (host bits all 1), reaching all hosts in the subnet | yayın adresi

## Quick check

? How many **usable host** IP addresses are in a `/26` subnet?
- 64 ~~ 64 is total addresses, before subtracting network and broadcast
* 62 ~~ $32 - 26 = 6$ host bits, so $2^6 - 2 = 62$ usable hosts
- 30 ~~ 30 is for `/27`
- 126 ~~ 126 is for `/25`
! A `/26` has 6 host bits: $2^6 - 2 = 62$ usable host addresses.

? What is the **network address** for host `192.168.1.140/25`?
- `192.168.1.0` ~~ `/25` splits the `/24` in half at `.128`
* `192.168.1.128` ~~ block size is $256 - 128 = 128$, and `140` is in the second half (`128..255`)
- `192.168.1.129` ~~ `.129` is the first usable host, not the network address
- `192.168.1.255` ~~ `.255` is the broadcast address
! With `/25` (`255.255.255.128`), subnets are `.0–.127` and `.128–.255`; `140` belongs to `192.168.1.128`.

? Which CIDR prefix gives **exactly 2 usable host** addresses—ideal for a point-to-point link between two routers?
- `/28` ~~ `/28` gives 14 usable hosts
- `/29` ~~ `/29` gives 6 usable hosts
* `/30` ~~ $32 - 30 = 2$ host bits, so $2^2 - 2 = 2$ usable hosts
- `/31` ~~ standard host subnetting formula gives 0 usable hosts for `/31`
! `/30` (`255.255.255.252`) provides 2 usable host IPs.
