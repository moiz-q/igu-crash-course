---
id: office-05
title: Microsoft Word — Styles, Table of Contents, and Page Layout
goal: apply Heading styles, generate an automatic Table of Contents, and configure page breaks, headers, footers, and page numbers
week: 5
minutes: 18
---

Long university reports look messy if you build the Table of Contents by hand. Using **Styles** lets Word build and update it in one click.

## Styles & Automatic Table of Contents (TOC)

1. **Apply Heading styles**: Instead of just making a title bold and big, select it and click `Home → Styles → Heading 1` (for main chapters) and `Heading 2` (for sub-sections).
2. **Insert TOC**: Place your cursor at the start of the document and click:
   `References → Table of Contents → Automatic Table 1`
3. **Update after edits**: Right-click the TOC → **Update Field → Update entire table** (or `Update page numbers only`).

## Page breaks vs. Section breaks

- **Page Break** (`Insert → Pages → Page Break`, or `Ctrl+Enter`): starts the next text cleanly at the top of a new page.
- **Section Break (Next Page)** (`Layout → Page Setup → Breaks → Next Page`): splits the document into independent **sections** so you can have **portrait** pages in Chapter 1 and **landscape** in Chapter 2, or omit page numbers on the cover page!

## Headers, footers & page numbers

- `Insert → Header & Footer → Page Number → Bottom of Page`
- To hide the page number on Page 1 (your cover page): double-click the header/footer to open **Header & Footer** tab → tick **Different First Page**.
- Margins & Orientation: `Layout → Page Setup → Margins / Orientation / Size`.

## Try it

:::checklist Lesson 5 hands-on checklist
- Styled 3 titles with `Home → Styles → Heading 1` and 2 subheadings with `Heading 2`
- Inserted an automatic Table of Contents via `References → Table of Contents`
- Inserted a clean **Page Break** (`Ctrl+Enter`) before a new section
- Added page numbers (`Insert → Page Number`) and enabled **Different First Page**
:::

## Common mistakes

- Typing a Table of Contents manually—every time you add a paragraph, all page numbers become wrong!
- Seeing *"No table of contents entries found"* because you made headings **Bold + 16pt** manually instead of applying **Heading 1 / Heading 2** styles.
- Changing **Orientation** to Landscape without a **Section Break**, which flips the entire document sideways instead of just one wide table page.

## Key terms

- Style | a named bundle of font and paragraph settings (`Heading 1`, `Normal`) | stil
- Table of Contents | an auto-generated list of headings and page numbers (`References → Table of Contents`) | içindekiler tablosu
- Section Break | a break dividing a document so different sections can have separate layouts or headers | bölüm sonu

## Quick check

? Word says *"No table of contents entries found"* when you click `References → Table of Contents`. Why?
- Your document has too few pages ~~ TOC works on 1-page documents too
* You formatted titles manually (bold/large) instead of applying `Home → Styles → Heading 1/2` ~~ Automatic TOC only reads Heading styles
- You forgot to save as `.pdf` ~~ TOC is built inside `.docx`
- Your margins are too narrow ~~ margins do not affect TOC detection
! Automatic Table of Contents pulls entries from `Heading 1`, `Heading 2`, etc.

? Which shortcut inserts a clean **Page Break** so a new chapter always begins at the top of the next page?
- `Shift+Enter` ~~ inserts a soft line break within the same paragraph
* `Ctrl+Enter` ~~ inserts a hard Page Break
- `Alt+Enter` ~~ repeats last action / new line in Excel cell
- `Ctrl+Shift+Enter` ~~ column break
! `Ctrl+Enter` inserts a Page Break.

? You want **Page 3** of a portrait report to be **Landscape** for a wide table, while keeping Pages 1, 2, and 4 **Portrait**. What must you insert before and after Page 3?
- Page Breaks (`Ctrl+Enter`) ~~ Page Breaks share the same page orientation
* Section Breaks (`Layout → Breaks → Next Page`) ~~ Section Breaks allow independent orientation per section
- Tab stops ~~ tab stops align text on a line
- Footnotes ~~ footnotes sit at the bottom of a page
! Only Section Breaks allow mixed Portrait and Landscape pages in one document.
