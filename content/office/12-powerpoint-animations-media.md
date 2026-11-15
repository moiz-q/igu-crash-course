---
id: office-12
title: Microsoft PowerPoint — Transitions, animations, and media
goal: distinguish slide transitions from object animations, control timing with the Animation Pane, and embed media and speaker notes
week: 12
minutes: 16
---

Motion in PowerPoint should guide the audience's eye—never distract them.


@widget viz name=off-anim

## Transitions vs. Animations

| Feature | Applies to | Ribbon tab | Example |
| --- | --- | --- | --- |
| **Transition** | How **one slide** changes to the **next slide** | `Transitions` | `Fade`, `Push`, `Morph` |
| **Animation** | How **objects on a slide** (bullets, charts) appear, emphasize, or exit | `Animations` | `Appear`, `Fade`, `Fly In` |

## Controlling animations cleanly

- **Effect Options**: e.g., reveal bullet points **By Paragraph** on click so the audience doesn't read ahead.
- **Animation Pane** (`Animations → Advanced Animation → Animation Pane`): shows the exact order and timing (`On Click`, `With Previous`, `After Previous`).
- **Consistency**: pick **one** subtle transition (like `Fade`) and click **Transitions → Timing → Apply to All**—never use 15 spinning/shattering transitions!

## Media & Presenter View

- **Video / Audio**: `Insert → Media → Video / Audio` (prefer local files embedded in the `.pptx` rather than fragile internet links during classroom talks!).
- **Speaker Notes & Presenter View**: type talking points in the **Notes** pane below the slide. During a talk (`Slide Show → Use Presenter View`), the projector shows only the clean slide while your laptop screen shows your notes, timer, and next slide!

## Try it

:::checklist Lesson 12 hands-on checklist
- Applied one subtle **Transition** (`Transitions → Fade → Apply to All`)
- Added an **Entrance** animation (`Appear` or `Fade`) to a bullet list and opened **Animation Pane** to verify `On Click` order
- Typed 2–3 talking points in the **Notes** pane at the bottom of a slide
- Tested **Slide Show → From Beginning** (`F5`) and **From Current Slide** (`Shift+F5`)
:::

## Common mistakes

- Using noisy or slow 3-second animations (`Bounce`, `Spin`) on every heading—wastes time and looks unprofessional.
- Linking to a YouTube video when the classroom projector PC has no Wi-Fi—always embed local MP4/audio or have a backup!
- Putting your entire speech onto the slide instead of the **Notes** pane.

## Key terms

- transition | visual effect when moving from one slide to the next | slayt geçişi
- animation | visual effect applied to an individual object on a slide | animasyon
- Animation Pane | sidebar listing all animations on the current slide and their timing | animasyon bölmesi
- Presenter View | dual-screen mode showing speaker notes and timer to the presenter only | sunucu görünümü

## Quick check

? What is the difference between a **Transition** and an **Animation** in PowerPoint?
- They are two names for the same effect ~~ transitions are between slides; animations are on objects
* A **Transition** happens between slides; an **Animation** moves or reveals individual objects on a slide ~~ e.g., Fade between slides vs. bullets appearing one by one
- Transitions only work on Title Slides ~~ transitions work on any slide
- Animations cannot be clicked ~~ `On Click` is the default animation trigger
! Transitions = slide-to-slide; Animations = objects within a slide.

? Which keyboard shortcut starts Slide Show **from the very first slide**, and which starts **from the current slide**?
- `F1` and `F2` ~~ Help and Rename
* `F5` (from beginning) and `Shift+F5` (from current slide) ~~ essential presenter shortcuts
- `Ctrl+S` and `Ctrl+P` ~~ Save and Print
- `Alt+F4` and `Esc` ~~ Close and Exit
! `F5` starts from Slide 1; `Shift+F5` starts from the current slide.

? Where should you put detailed talking points so **you** can read them on your laptop during **Presenter View** while the audience only sees clean slides?
- Inside a tiny text box in the corner ~~ audience sees it on the projector
* In the **Notes** pane below the slide ~~ Presenter View shows Notes only on your screen
- In Slide Master ~~ shows on every slide to the audience
- In the file properties ~~ not visible during Slide Show
! Use the **Notes** pane + **Presenter View** for speaker prompts.
