---
id: net-15
title: Wireless networking (Wi-Fi)
goal: compare Wi-Fi standards (802.11n/ac/ax), 2.4 GHz vs. 5 GHz bands, non-overlapping channels, and WPA2/WPA3 security
week: 14
minutes: 15
---

Wireless LANs (**WLANs**) follow the **IEEE 802.11** family of standards—commonly called **Wi-Fi**. Instead of copper wires, devices share radio frequencies using **CSMA/CA**.

## Wi-Fi standards at a glance

| IEEE Standard | Wi-Fi Name | Band(s) | Typical max speed |
| --- | --- | --- | --- |
| **802.11n** | Wi-Fi 4 | 2.4 GHz & 5 GHz | ~600 Mbps |
| **802.11ac** | Wi-Fi 5 | 5 GHz only | ~1.3–3.5 Gbps |
| **802.11ax** | Wi-Fi 6 / 6E | 2.4, 5 (& 6 GHz) | Up to 9.6 Gbps, better in crowded rooms |

## 2.4 GHz vs. 5 GHz

- **2.4 GHz**: travels **farther** and passes through walls better, but is **slower** and crowded (shared with Bluetooth, microwaves, and neighbors). Only **3 non-overlapping channels** exist: **1, 6, and 11**!
- **5 GHz**: **faster** speeds and many more non-overlapping channels (less interference), but **shorter range** and weakens faster through concrete walls.

## Wireless security & SSID

- **SSID (Service Set Identifier)**: the human-readable Wi-Fi network name (e.g., `IGU-Student`). Hiding the SSID is *not* real security—sniffers still see it in frames.
- **WEP** (broken, obsolete) → **WPA** (deprecated) → **WPA2 (AES)** (standard) → **WPA3** (strongest modern standard, resists offline password guessing).
- **MAC filtering**: allows/blocks listed MAC addresses—helpful as a small extra layer, but easy to spoof, so never use it instead of WPA2/WPA3.

## Try it

You are placing Wi-Fi access points in a crowded 3-classroom hallway using **2.4 GHz** so students' laptops stay connected through thick walls.
1. Which three channels should you assign to the three neighboring APs so they do not interfere with each other?
2. Which security protocol should you enable: WEP, WPA2-AES, or open?

:::reveal Show answer
1. Channels **1, 6, and 11** (the three non-overlapping 2.4 GHz channels).
2. **WPA2-AES** (or **WPA3** if all client devices support it). Never use WEP or open for private/campus access.
:::

## Common mistakes

- Setting neighboring 2.4 GHz access points to channels `1, 2, 3`. Adjacent channels overlap and cause severe interference—always use **1, 6, 11**.
- Thinking **5 GHz** always has better range than **2.4 GHz**. Higher frequency = faster data, **shorter** wall-penetrating range.
- Relying on **hidden SSID** or **MAC filtering** without WPA2/WPA3 encryption.

## Key terms

- IEEE 802.11 | the family of standards defining wireless LANs (Wi-Fi) | IEEE 802.11 standardı
- SSID | the broadcast name of a wireless network | kablosuz ağ adı (SSID)
- non-overlapping channels | channels 1, 6, and 11 in 2.4 GHz that do not interfere with each other | çakışmayan kanallar
- WPA2 / WPA3 | modern Wi-Fi security protocols using strong AES encryption | kablosuz güvenlik protokolleri

## Quick check

? Which three channels are **non-overlapping** in the **2.4 GHz** Wi-Fi band?
- 1, 2, 3 ~~ adjacent channels overlap heavily and cause interference
* 1, 6, 11 ~~ spaced 5 channels apart so their 20–22 MHz widths do not overlap
- 2, 5, 8 ~~ spaced only 3 channels apart, so they overlap
- 36, 40, 44 ~~ those are 5 GHz channels
! In 2.4 GHz, only channels 1, 6, and 11 do not overlap.

? Which statement accurately compares **2.4 GHz** and **5 GHz** Wi-Fi?
- 5 GHz travels farther through thick walls than 2.4 GHz ~~ 2.4 GHz penetrates walls better
* 5 GHz offers higher speeds and less congestion, while 2.4 GHz has longer range ~~ trade-off between speed/channels and range
- 2.4 GHz is used only by 802.11ac ~~ 802.11ac is 5 GHz only
- 5 GHz has only 3 channels ~~ 5 GHz has over 20 non-overlapping channels
! 2.4 GHz reaches farther; 5 GHz is faster and cleaner at shorter distances.

? Which Wi-Fi security standard should you **never** use today because it can be cracked in minutes?
- WPA3 ~~ WPA3 is the newest and strongest standard
- WPA2 (AES) ~~ WPA2 with AES and a strong passphrase is still widely secure
* WEP ~~ WEP has fatal cryptographic flaws and is completely broken
- 802.1X ~~ 802.1X is enterprise authentication
! WEP is obsolete and easily cracked; always use WPA2-AES or WPA3.
