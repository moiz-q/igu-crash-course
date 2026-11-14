---
id: net-06
title: Guided lab 1 — Build your first LAN
goal: build a two-PC Ethernet LAN with a switch in Packet Tracer, assign IPv4 addresses, and verify connectivity with ping
week: 5
minutes: 25
---

In this first guided lab, you will build a working **Local Area Network (LAN)** from scratch, configure static IPv4 addresses, and verify communication using `ping` and Simulation mode.

## Lab topology

- `Switch0`: Cisco `2960-24TT`
- `PC0`: connected to `Switch0` port `FastEthernet0/1` (`Copper Straight-Through`)
- `PC1`: connected to `Switch0` port `FastEthernet0/2` (`Copper Straight-Through`)

| Device | IPv4 Address | Subnet Mask | Default Gateway |
| --- | --- | --- | --- |
| `PC0` | `192.168.1.10` | `255.255.255.0` | *(leave blank — single LAN)* |
| `PC1` | `192.168.1.11` | `255.255.255.0` | *(leave blank — single LAN)* |

## Step-by-step instructions

1. **Place devices**: Drag two **PC-PT** units (`PC0`, `PC1`) and one **2960-24TT** switch (`Switch0`) onto the Logical workspace.
2. **Cable them**: Select **Copper Straight-Through** (solid black line). Click `PC0` → `FastEthernet0` → `Switch0` → `FastEthernet0/1`. Repeat for `PC1` → `FastEthernet0/2`.
3. **Wait for green**: Click **Fast Forward Time** (`Alt+D`) twice so both switch lights turn green.
4. **Configure `PC0` IP**: Click `PC0` → **Desktop** tab → **IP Configuration** → select **Static**. Enter IPv4 `192.168.1.10` and Subnet Mask `255.255.255.0`. Close the window.
5. **Configure `PC1` IP**: Repeat on `PC1` with IPv4 `192.168.1.11` and Subnet Mask `255.255.255.0`.
6. **Test with `ping`**: Click `PC0` → **Desktop** → **Command Prompt**. Type:
   ```text
   ping 192.168.1.11
   ```
   You should see 4 replies (`Reply from 192.168.1.11: bytes=32 time<1ms TTL=128`).
7. **Watch it in Simulation mode**: Switch to **Simulation** mode, click **Add Simple PDU** (closed envelope), click `PC0`, then click `PC1`. Click **Capture / Forward** repeatedly to watch **ARP** find `PC1`'s MAC address first, followed by **ICMP** echo request and reply!

## Try it

Follow the 7 steps above in Cisco Packet Tracer and tick each milestone as you complete it:

:::checklist Guided Lab 1 completion checklist
- Placed `PC0`, `PC1`, and `Switch0` (`2960-24TT`)
- Connected both PCs with Copper Straight-Through cables and saw green link triangles
- Assigned `192.168.1.10/24` to `PC0` and `192.168.1.11/24` to `PC1`
- Ran `ping 192.168.1.11` from `PC0` Command Prompt and received 4 replies (`0% loss`)
- Stepped through one Simple PDU in Simulation mode and observed ARP + ICMP
:::

## Common mistakes

- Giving both PCs the **exact same IP address** (`192.168.1.10` on both). Every host on a LAN must have a unique IPv4 address.
- Putting `PC0` on `192.168.1.10` and `PC1` on `192.168.2.11` with mask `255.255.255.0`. Without a router, two different subnets cannot `ping` each other.
- Pinging immediately while switch ports are still **amber**. Wait or click **Fast Forward Time** first.

## Key terms

- static IP | an IPv4 address typed manually on a host instead of received from a DHCP server | statik IP
- ping | a command that sends ICMP Echo Requests to test if another host is reachable | ping komutu
- ARP (Address Resolution Protocol) | protocol that discovers a host's MAC address from its IPv4 address on a LAN | Adres Çözümleme Protokolü (ARP)
- ICMP | protocol used by `ping` and error messages to test network reachability | İnternet Kontrol Mesaj Protokolü (ICMP)

## Quick check

? Why does `PC0` send an **ARP** broadcast before sending the first `ping` packet to `PC1`?
- To ask `PC1` for its IPv4 address ~~ `PC0` already knows `PC1`'s IP (`192.168.1.11`) because you typed it
* To learn `PC1`'s MAC address so the Ethernet frame can be delivered on the LAN ~~ switches forward Ethernet frames using MAC addresses
- To connect to the internet ~~ this lab has no internet connection
- To assign a subnet mask to `Switch0` ~~ `PC0` already has its own subnet mask
! On an Ethernet LAN, `PC0` knows the target IP but needs the target MAC address, which ARP discovers.

? What happens if you accidentally assign `192.168.1.10` (with mask `255.255.255.0`) to **both** `PC0` and `PC1`?
- Both PCs share the speed equally ~~ IPs must be unique per host
* An IP address conflict occurs and communication fails ~~ duplicate IPs cause ARP/routing conflicts
- The switch automatically changes `PC1` to `.11` ~~ switches do not assign IP addresses
- `ping` works twice as fast ~~ duplicate IPs break connectivity
! Every host on the same network must have a unique IP address.

? You configured `PC0` as `192.168.1.10 / 255.255.255.0` and `PC1` as `192.168.5.11 / 255.255.255.0` on one switch. Why does `ping` fail?
- Switches only work with 3 or more PCs ~~ a switch works fine with 2 PCs
* `192.168.1.x` and `192.168.5.x` are in different subnets, and there is no router between them ~~ a Layer 2 switch cannot route between different IP subnets
- You need a crossover cable between a PC and a switch ~~ PC to switch uses a straight-through cable
- `ping` requires a Default Gateway even on the same subnet ~~ same-subnet traffic never uses a gateway
! Hosts in different subnets need a router to communicate.
