---
id: net-14
title: Essential network diagnostic commands
goal: use ipconfig/ifconfig, ping, tracert/traceroute, arp, nslookup, and netstat to diagnose connectivity problems
week: 13
minutes: 16
---

When a network stops working, engineers test from bottom to top using built-in command-line tools.

## The 6 commands you will use most

| Command (Windows / Linux-macOS) | What it shows or tests |
| --- | --- |
| `ipconfig` / `ip a` (`ifconfig`) | Shows your IP address, subnet mask, and default gateway (`ipconfig /all` adds MAC & DNS) |
| `ping <host>` | Tests Layer 3 reachability and round-trip time (ms) using **ICMP** |
| `tracert <host>` / `traceroute <host>` | Lists every **router hop** between you and the destination |
| `arp -a` | Displays the local **IP-to-MAC** address cache |
| `nslookup <domain>` | Queries your **DNS server** to translate a domain name (e.g., `igu.edu.tr`) into an IP |
| `netstat -an` | Lists active **TCP/UDP connections** and **listening ports** on your machine |

### Two more small commands

- **`hostname`** — prints the computer's name on the network (e.g. `LAB-PC-07`). Useful before you ask someone to ping you, or to check which machine you are logged in to remotely.
- **`ipconfig /release`** and **`ipconfig /renew`** — give back the current DHCP address and ask the DHCP server for a new one. `ipconfig /flushdns` clears the DNS cache. On Linux/macOS the equivalents are `ip addr` / `ifconfig`, `dhclient`.

## Step-by-step troubleshooting flow

If a user says *"I can't open websites!"*, test in this order:
1. `ipconfig` → Do I have a valid IP (not `169.254.x.x` APIPA) and a Default Gateway?
2. `ping 127.0.0.1` → Is my own TCP/IP software stack working?
3. `ping <Default Gateway>` → Can I reach my local router? (If no, check cable/Wi-Fi!)
4. `ping 8.8.8.8` → Can I reach the internet by IP?
5. `ping google.com` or `nslookup google.com` → If `8.8.8.8` works by IP but `google.com` fails, the problem is **DNS**!

## Try it

A student runs two commands on a lab PC:
- `ping 8.8.8.8` → **4 replies, 0% loss**
- `nslookup igu.edu.tr` → **DNS request timed out**

What is working, and what single service is broken?

:::reveal Show answer
- **Working**: Physical cable/Wi-Fi, local IP/subnet mask, Default Gateway, and internet routing (proved by `8.8.8.8` replying).
- **Broken**: **DNS** (name resolution)—the PC can reach public IPs, so either the configured DNS server IP is wrong/down or UDP port 53 is blocked.
:::

## Common mistakes

- Thinking `ping` failing means the server is definitely off. Many servers and firewalls **block ICMP (`ping`)** for security even while HTTP (`443`) works.
- Running `ipconfig` without `/all` when looking for the **MAC (Physical) Address** or **DNS Server**—you need `ipconfig /all` on Windows.
- Confusing `netstat` (local open sockets/ports) with `tracert` (path of routers across the network).

## Key terms

- `ipconfig` | Windows command displaying IPv4/IPv6, subnet mask, and gateway settings | ipconfig komutu
- `tracert` / `traceroute` | command tracing each router hop along the path to a destination | yol izleme komutu
- `nslookup` | command querying DNS servers to resolve domain names to IP addresses | DNS sorgulama komutu
- `netstat` | command listing active network connections and listening ports | ağ istatistikleri komutu

## Quick check

? You can `ping 1.1.1.1` successfully, but opening `https://gelisim.edu.tr` fails and `nslookup gelisim.edu.tr` times out. Where is the fault?
- Your Ethernet cable is unplugged ~~ `1.1.1.1` replied, so the link is up
- Your Default Gateway is wrong ~~ traffic reached `1.1.1.1` through the gateway
* DNS resolution is failing ~~ IP connectivity works, but domain-to-IP lookup is broken
- Your NIC is damaged ~~ hardware is working fine
! Reaching an IP directly while domain names fail points directly to DNS.

? Which command shows the **path of routers (hops)** packets take to reach `example.com`?
- `arp -a` ~~ `arp -a` only shows the local LAN IP-to-MAC table
* `tracert example.com` (or `traceroute`) ~~ lists each router hop and latency along the path
- `ipconfig /all` ~~ shows local interface configuration only
- `netstat -an` ~~ shows local sockets and listening ports
! `tracert` (Windows) / `traceroute` (Linux/macOS) reveals every router hop to the target.

? Which command displays your PC's **MAC (Physical) address** and **DNS servers** on Windows?
- `ping /all` ~~ `ping` has no `/all` option for NIC config
* `ipconfig /all` ~~ displays MAC address, DHCP status, IP, mask, gateway, and DNS servers
- `arp -a` ~~ shows other hosts' cached MACs, not your own DNS server
- `tracert` ~~ traces remote router hops
! `ipconfig /all` shows complete adapter details including Physical Address and DNS servers.
