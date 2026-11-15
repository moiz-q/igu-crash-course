---
id: en-02
title: Narrative tenses — telling a story about an unusual person
goal: combine past simple, past continuous, past perfect and past perfect continuous to tell a clear story about a person from the past
week: 2
minutes: 22
---

When you describe what happened in a lab, a project, or a story, you need four **narrative tenses** to show **which action finished**, **which was in progress**, and **which happened earlier**.


@widget viz name=en-past

## The four narrative tenses

| Tense | Form | Use | Example |
| --- | --- | --- | --- |
| **Past Simple** | `V2` / `did + V1` | Completed main events in order | *I saved the file and closed the laptop.* |
| **Past Continuous** | `was/were + V-ing` | Action in progress at a past moment (background) | *I was testing my code when the power went out.* |
| **Past Perfect** | `had + V3` | Action that happened **before** another past event | *When I returned, the OS had already restarted.* |
| **Past Perfect Continuous** | `had been + V-ing` | A **longer** action that continued up to an earlier past moment (often with *for / since*) | *She **had been working** on the machine **for** ten years when she finally finished it.* |

Past perfect vs. past perfect continuous: *He **had written** three books* (finished result, a number) vs. *He **had been writing** all night, so he was tired* (duration, the activity itself).

_ By 1843, Ada Lovelace ___ (study) mathematics for many years. = had been studying ~~ long action up to a past moment
_ The scientist was exhausted because she ___ (work) since dawn. = had been working ~~ duration → past perfect continuous
_ They ___ (wait) for two hours when the ship finally arrived. = had been waiting ~~ duration with *for*
_ When he died, he ___ (write) more than 40 books. = had written ~~ a finished number → past perfect simple

## Practice: Gap-fill (15 items)

_ Yesterday, Deniz ___ (arrive) at the computer lab ten minutes early. = arrived ~~ completed past event
_ While he ___ (wait) for the projector to warm up, he checked his notes. = was waiting ~~ background action in progress
_ He realized he ___ (leave) his USB drive in the dormitory! = had left ~~ happened earlier, before arriving at the lab
_ Fortunately, he ___ (upload) a copy to Google Drive the night before. = had uploaded ~~ earlier past action
_ As he ___ (download) the file, the lab instructor walked in. = was downloading ~~ interrupted action
_ The instructor ___ (ask) everyone to open Cisco Packet Tracer. = asked ~~ main event
_ Deniz ___ (not / finish) his coffee before class started. = didn't finish | did not finish ~~ Past Simple negative
_ When I ___ (call) Ece last night, she was studying for DBMS. = called ~~ short interrupting event
_ While we ___ (discuss) the ER diagram, the library lights flickered. = were discussing ~~ ongoing background action
_ By the time the bus arrived, the rain ___ (stop). = had stopped ~~ completed before the bus arrived
_ What ___ (you / do) at 9 p.m. yesterday? = were you doing ~~ action in progress at a specific past time
_ I ___ (never / see) a C pointer diagram before last week's lecture. = had never seen ~~ experience before a past point
_ Mert ___ (type) the `SELECT` query, pressed Enter, and saw 24 rows. = typed ~~ sequence of completed actions
_ She couldn't log in because she ___ (forget) her campus password. = had forgotten ~~ cause happening earlier
_ While the students ___ (write) their exams, the room stayed silent. = were writing ~~ continuous background

## Reading: The Midnight Bug

Read this original passage (~280 words) and answer the questions:

> Last Tuesday, Emir stayed up late to finish his first C programming assignment. By 11:00 p.m., he had written fifty lines of code and felt proud of his progress. The program was supposed to read five exam scores from the user and print their average. While he was compiling the file, a single red warning appeared on his screen, yet the executable still ran. Confident that everything was fine, Emir typed five numbers and pressed Enter. Instead of printing `78.50`, the console printed `0.00`.
>
> At first, Emir thought the compiler had broken. He checked his `for` loop three times, drank a cup of tea, and stared at the `printf` line while his roommate was sleeping nearby. Nothing looked wrong—until he remembered what the lecturer had warned about during Monday's class. In `scanf("%d", score)`, he had forgotten the `&` address-of operator! Because he had omitted `&`, `scanf` was trying to write into the wrong place in memory.
>
> Emir added the single `&` symbol, saved the file, and compiled again. This time, the warning disappeared, and the console printed `78.50` cleanly. Before going to bed at 12:30 a.m., he uploaded his `.c` file to the course portal and made a backup copy on his cloud drive. He had lost an hour to one tiny symbol, but he knew he would never forget `&` in `scanf` again.

? Why did Emir's program print `0.00` instead of `78.50`?
- His computer ran out of battery ~~ not mentioned
- His roommate deleted a line of code ~~ his roommate was sleeping
* He forgot the `&` operator inside `scanf` ~~ `scanf` could not store the input properly without `&`
- He used `float` instead of `int` ~~ the bug was the missing `&`
! Forgetting `&` in `scanf` caused the bug.

? Which event happened **first** chronologically?
- Emir drank a cup of tea ~~ happened after seeing `0.00`
* The lecturer warned the class about `&` on Monday ~~ happened before Tuesday night (Past Perfect: `had warned`)
- Emir uploaded his file to the portal ~~ happened last at 12:30 a.m.
- The warning disappeared ~~ happened after fixing `&`
! `had warned` marks the earliest event in the timeline.

## Try it

Write **120–150 words** about an **unusual person from the past** — a famous person (an inventor, explorer, artist) or someone from your own family. Say what was unusual about them and tell **one event** from their life. Use **all four narrative tenses** at least once.

Story structure: **1. Set the scene** (who, where, when — past continuous for background) → **2. The main events** (past simple, in order) → **3. The background before** (past perfect / past perfect continuous) → **4. The ending** (what happened later and why the person is remembered).

:::reveal Show model answer
My great-grandmother, Fatma, was an unusual woman for her time. In the 1950s, while most women in her village were working in the fields, she was repairing radios in a small shop in Bursa. Nobody had taught her; she had been taking broken radios apart since she was twelve, just to see how they worked. One winter evening, the town's only doctor arrived at her shop in a panic. His radio had stopped working, and he needed to hear the weather news before a dangerous trip over the mountains. Fatma opened the radio, found a burnt wire and fixed it in ten minutes. The doctor heard that a storm was coming and waited until morning. Later, he told everyone the story, and people started bringing her their radios from all the nearby villages.
:::

:::rubric Story self-check
- Introduces the person and says what was unusual about them
- Uses past simple for the main events in order
- Uses past continuous for background (*while most women were working…*)
- Uses past perfect **and** past perfect continuous for earlier events
- Has a clear ending; 120–150 words
:::

## Common mistakes

- Using Past Simple for both actions when one clearly happened **before** the other (`When I arrived, the class already started` → `had already started`).
- Using Past Continuous with state verbs like `know`, `want`, or `understand` (`I was knowing` → `I knew`).
- Forgetting irregular `V2`/`V3` forms (`write → wrote → written`, `forget → forgot → forgotten`).

## Key terms
- past perfect continuous | had been + V-ing: a longer action continuing up to an earlier past moment | geçmişte süregelmiş eylem (past perfect continuous)

- narrative tenses | past tenses (Simple, Continuous, Perfect) used together to tell a story | hikaye zamanları
- Past Continuous | `was/were + -ing`, showing an ongoing background action in the past | şimdiki zamanın hikayesi
- Past Perfect | `had + V3`, showing an action completed before another past time | miş'li geçmiş zaman

## Quick check

? Choose the best completion: *"While I ___ to music, my friend knocked on the door."*
- listened ~~ `while` with a background ongoing action takes Past Continuous
* was listening ~~ ongoing background action interrupted by `knocked`
- had listened ~~ listening did not finish before the knock
- listen ~~ present tense doesn't fit `knocked`
! Use Past Continuous (`was listening`) for the longer background action.

? Choose the best completion: *"When we got to the cinema, the film ___."*
- already started ~~ use Past Perfect to show it started *before* we arrived
* had already started ~~ earlier past event before `got`
- was already starting ~~ `already` with completed start before arrival fits Past Perfect
- has already started ~~ Present Perfect cannot pair with `When we got`
! `had + V3` shows the film started before our arrival.

? Which sentence is grammatically **correct**?
- I was knowing the answer during the quiz. ~~ `know` is a stative verb, not normally used in `-ing`
* By 10 p.m., she had finished all five SQL queries. ~~ correct Past Perfect with `by + past time`
- While he typed, the phone was ringing twice. ~~ short `twice` event should be Past Simple (`rang`)
- Did you went to the lab yesterday? ~~ after `did`, use base verb `go`
! `By 10 p.m., she had finished...` uses Past Perfect accurately.
