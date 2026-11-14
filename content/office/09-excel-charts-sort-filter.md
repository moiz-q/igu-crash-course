---
id: office-09
title: Microsoft Excel — Sorting, filtering, conditional formatting, and charts
goal: sort and filter tables cleanly, highlight rules with Conditional Formatting, and choose the right chart type
week: 10
minutes: 18
---

Spreadsheets are not just for calculating numbers—they also help you **organize**, **highlight**, and **visualize** data.

## Sorting & Filtering

- **Sort**: Click any cell inside your table → `Data → Sort & Filter → Sort A to Z` / `Sort Z to A` / `Custom Sort` (multi-column sort, e.g., by Department then by Grade descending).
- **Filter (AutoFilter)**: Click inside your table → `Data → Sort & Filter → Filter` (`Ctrl+Shift+L`). Drop-down arrows appear on every header so you can filter by value, text, or condition (`Greater Than...`).

## Conditional Formatting

Automatically color cells based on their values (`Home → Styles → Conditional Formatting`):
- **Highlight Cells Rules**: e.g., mark grades `< 60` in light red fill.
- **Color Scales / Data Bars**: show high vs. low values visually at a glance.

## Choosing the right chart (`Insert → Charts`)

| Chart type | Best used for | Example |
| --- | --- | --- |
| **Column / Bar** | Comparing categories side by side | Midterm averages by department |
| **Line** | Showing trends over **time** | Monthly website visitors Jan–Dec |
| **Pie** | Showing **parts of one whole** (percentages summing to 100%) | Share of OS market (Windows, macOS, Linux) |

## Freeze Panes & Print Setup

- **Keep header row visible while scrolling**: `View → Window → Freeze Panes → Freeze Top Row`.
- **Print cleanly**: `Page Layout → Page Setup → Orientation (Landscape)` + `Scale to Fit → Width: 1 page`.

## Try it

:::checklist Lesson 9 hands-on checklist
- Turned on **Filter** (`Ctrl+Shift+L` or `Data → Filter`) on a multi-row table and filtered one category
- Applied **Conditional Formatting** (`Home → Conditional Formatting → Highlight Cells Rules → Less Than`) to highlight scores below 60
- Created a **Column** or **Line** chart (`Insert → Charts`) with a clear chart title
- Froze the header row using `View → Freeze Panes → Freeze Top Row`
:::

## Common mistakes

- Selecting **only one column** before clicking Sort—Excel either warns you or sorts that column alone, breaking the link between names and grades! Always click **one cell inside the table** (or select the whole table).
- Using a **Pie chart** when values do not represent parts of one whole (or when there are 15 tiny slices)—use a **Bar/Column chart** instead.
- Printing a 10-column Excel sheet without checking **Print Preview** (`Ctrl+P`), splitting the last 2 columns onto a separate orphan page.

## Key terms

- AutoFilter | dropdown filters on table headers to show only matching rows (`Data → Filter`) | otomatik filtre
- Conditional Formatting | formatting that changes cell color/style automatically based on cell values | koşullu biçimlendirme
- Freeze Panes | locking header rows or columns so they stay visible while scrolling | bölmeleri dondur

## Quick check

? Which chart type is best for showing how monthly sales changed from January to December?
- Pie chart ~~ Pie charts show shares of a single total, not time trends
* Line chart ~~ Line charts clearly show trends over continuous time
- Scatter plot ~~ Scatter plots compare two numeric variables
- Radar chart ~~ hard to read for simple time series
! Use a **Line chart** for trends over time.

? You want Row 1 (your column headers) to stay visible at the top while you scroll down through 500 student rows. Which menu path do you use?
- `Home → Wrap Text` ~~ wraps long text inside one cell
- `Data → Filter` ~~ adds filter dropdowns, doesn't lock scrolling
* `View → Freeze Panes → Freeze Top Row` ~~ locks Row 1 during scrolling
- `Insert → Header & Footer` ~~ only appears on printed pages
! `View → Freeze Panes → Freeze Top Row` keeps Row 1 pinned on screen.

? What happens if you select **only Column B** (scores) and click Sort Largest to Smallest, ignoring Column A (names)?
- Excel always refuses to sort ~~ Excel may sort Column B alone if you choose "Continue with current selection"
* Scores get reordered while student names stay in place, mismatching every student's grade! ~~ always expand the selection or click one cell inside the table
- Column A is deleted ~~ it stays, just mismatched
- All formulas turn into `#REF!` ~~ values mismatch
! Always select the whole table (or a single cell inside it) so rows stay together when sorting.
