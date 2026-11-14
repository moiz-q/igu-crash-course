---
id: net-13
title: Subnetting practice and Guided lab 2 (Two LANs + Router)
goal: design subnets for a host requirement, run the unlimited subnetting drill, and route between two LANs in Packet Tracer
week: 12
minutes: 25
---

In exams and labs, you are often given a base network like `192.168.10.0/24` and asked to split it into subnets for different rooms—and then build it in Packet Tracer with a **router** connecting them.

## Designing subnets from host requirements

Suppose Lab A needs **50 hosts** and Lab B needs **25 hosts**, starting from `192.168.10.0/24`. Always allocate the **largest** requirement first (VLSM — Variable Length Subnet Masking):

1. **Lab A (needs 50 hosts)**:
   - Smallest power of 2 with $2^h - 2 \ge 50$: $h = 6$ ($2^6 - 2 = 62$).
   - Prefix = $32 - 6 = \mathbf{/26}$ (`255.255.255.192`, block size 64).
   - Subnet: `192.168.10.0/26` (usable `.1` – `.62`, broadcast `.63`).
2. **Lab B (needs 25 hosts)**:
   - Next free address is `.64`.
   - Smallest $h$ with $2^h - 2 \ge 25$: $h = 5$ ($2^5 - 2 = 30$).
   - Prefix = $32 - 5 = \mathbf{/27}$ (`255.255.255.224`, block size 32).
   - Subnet: `192.168.10.64/27` (usable `.65` – `.94`, broadcast `.95`).

## Guided Packet Tracer Lab 2: Two LANs + Router

When two PCs are in **different subnets**, a switch alone cannot connect them. You need a **router**, and each PC must know its **Default Gateway** (the IP of the router interface on that PC's LAN).

| Device | Interface | IPv4 Address | Subnet Mask | Default Gateway |
| --- | --- | --- | --- | --- |
| `Router0` | `GigabitEthernet0/0` | `192.168.10.1` | `255.255.255.192` (`/26`) | — |
| `PC0` (Lab A) | `FastEthernet0` | `192.168.10.10` | `255.255.255.192` | `192.168.10.1` |
| `Router0` | `GigabitEthernet0/1` | `192.168.10.65` | `255.255.255.224` (`/27`) | — |
| `PC1` (Lab B) | `FastEthernet0` | `192.168.10.70` | `255.255.255.224` | `192.168.10.65` |

### Lab steps
1. Place `Router0` (`1941` or `2911`), `Switch0`, `Switch1`, `PC0`, and `PC1`.
2. Cable `PC0` ↔ `Switch0` ↔ `Router0 (Gig0/0)` using **Copper Straight-Through**. Cable `PC1` ↔ `Switch1` ↔ `Router0 (Gig0/1)` using **Copper Straight-Through**.
3. Configure `PC0` and `PC1` IP, Subnet Mask, and **Default Gateway** (Desktop → IP Configuration).
4. Click `Router0` → **Config** tab → `GigabitEthernet0/0`: enter IP `192.168.10.1`, Mask `255.255.255.192`, and tick **Port Status: On** (`no shutdown` in CLI).
5. Repeat for `GigabitEthernet0/1`: IP `192.168.10.65`, Mask `255.255.255.224`, tick **Port Status: On**.
6. Wait for green lights, then from `PC0` run `ping 192.168.10.70`. (The very first packet may say `Request timed out` while ARP runs—the next 3 should reply!)

## Try it

Practice with the unlimited subnetting drill (aim for 10+ in a row without a calculator), and complete Lab 2:

@widget subnetdrill

:::checklist Guided Lab 2 completion checklist
- Built two LANs connected to `Router0` (`Gig0/0` and `Gig0/1`)
- Turned **On** (`no shutdown`) both router interfaces so all links are green
- Set each PC's **Default Gateway** to its local router interface IP
- Verified cross-subnet connectivity with `ping 192.168.10.70` from `PC0`
:::

## Common mistakes

- Leaving router interfaces **shut down** (red triangles). Cisco router ports are **administratively down by default** until you turn Port Status On (`no shutdown`).
- Forgetting the **Default Gateway** on `PC0` or `PC1`. Without it, `PC0` does not know where to send packets destined for another subnet.
- Using `192.168.10.63` as a host IP in Lab A—`.63` is Lab A's broadcast address!

## Key terms

- default gateway | the router interface IP on a local LAN where hosts send packets bound for other networks | varsayılan ağ geçidi
- VLSM (Variable Length Subnet Mask) | dividing a network into subnets of different sizes to match actual host counts | değişken uzunluklu alt ağ maskesi
- `no shutdown` | Cisco IOS command that enables (turns on) a router interface | arayüzü etkinleştirme komutu

## Quick check

? You need a subnet for **12 hosts**. Which CIDR prefix wastes the fewest IP addresses?
- `/29` ~~ `/29` only gives $2^3 - 2 = 6$ usable hosts (too small!)
* `/28` ~~ `/28` gives $2^4 - 2 = 14$ usable hosts (enough for 12)
- `/27` ~~ `/27` gives 30 hosts, wasting 16 extra addresses
- `/26` ~~ `/26` gives 62 hosts, wasting 50 addresses
! $2^4 - 2 = 14 \ge 12$, so `/28` (`255.255.255.240`) is the smallest fit.

? In Guided Lab 2, `PC0` (`192.168.10.10/26`) can ping its gateway `192.168.10.1`, and `Router0` links are all green, but `ping 192.168.10.70` fails. What is the most likely missing setting?
- `Switch0` needs an IP address ~~ Layer 2 switches forward frames without needing an IP to pass traffic
* `PC1` is missing its Default Gateway (`192.168.10.65`) or has the wrong subnet mask ~~ the reply packet cannot return to `PC0`'s subnet without `PC1`'s gateway
- A crossover cable is needed between `Switch0` and `Router0` ~~ switch to router uses straight-through
- DNS is not configured ~~ `ping` to an IP address does not use DNS
! Both sides need the correct Default Gateway so both the request and the reply can cross the router.

? Why do Cisco router ports start with **red** link triangles when first cabled in Packet Tracer?
- The cable is broken ~~ straight-through cables work fine between router and switch
* Router interfaces are shut down by default and must be enabled (`Port Status: On` / `no shutdown`) ~~ switches start enabled, routers start disabled
- Routers only support fiber cables ~~ routers have GigabitEthernet copper ports
- You must restart Packet Tracer ~~ just turn Port Status On
! Unlike switch ports, Cisco router interfaces are administratively disabled until turned on.
