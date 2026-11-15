/* Diagram library. Use in content as:  @widget viz name=<diagram-name>
   Every diagram is inline SVG that follows the theme (light/dark) and the course accent colour. */
(function () {
'use strict';
const esc = CC.esc; let U = 0;
const t = (x, y, s, c, a) => `<text x="${x}" y="${y}" text-anchor="${a || 'middle'}" class="${c || ''}">${esc(String(s))}</text>`;
const tl = (x, y, lines, c, a, lh) => lines.map((s, i) => t(x, y + i * (lh || 17), s, c, a)).join('');
const r = (x, y, w, h, c, rx) => `<rect class="${c || 'n'}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx === undefined ? 6 : rx}"/>`;
const ln = (x1, y1, x2, y2, c, m) => `<line class="${c || 'e'}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"${m === false ? '' : ` marker-end="url(#MK${m === 'a' ? 'a' : m === 'b' ? 'b' : m === 'o' ? 'o' : ''})"`}/>`;
const pth = (d, c, m) => `<path class="${c || 'e'}" d="${d}"${m === false ? '' : ` marker-end="url(#MK${m === 'a' ? 'a' : m === 'b' ? 'b' : m === 'o' ? 'o' : ''})"`}/>`;
const poly = (pts, c) => `<polygon class="${c || 'n'}" points="${pts}"/>`;
const circ = (x, y, rr, c) => `<circle class="${c || 'n'}" cx="${x}" cy="${y}" r="${rr}"/>`;
const ell = (x, y, rx, ry, c) => `<ellipse class="${c || 'n'}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
const box = (x, y, w, h, lines, c, tc) => r(x, y, w, h, c) + tl(x + w / 2, y + h / 2 - (lines.length - 1) * 8.5 + 5, lines, tc);
const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="${cls}" d="M0,0 L10,5 L0,10 z"/></marker>`;
function svg(w, h, body, alt, cap) {
  const id = 'vz' + (++U);
  return `<figure class="diagram viz"><svg viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(alt)}"><defs>${mk(id, 'arrow')}${mk(id + 'a', 'arrow-acc')}${mk(id + 'b', 'arrow-bad')}${mk(id + 'o', 'arrow-ok')}</defs>${body.replace(/MK/g, id)}</svg>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
}
/* small table helper: cols = [[title, width], …], rows = [[…], …], cls(rowIndex, colIndex) → rect class */
function table(x, y, cols, rows, cls, rh, hh) {
  rh = rh || 26; hh = hh || 26; let s = '', cx = x;
  cols.forEach(([name, w], c) => {
    s += r(cx, y, w, hh, 'f2', 0) + t(cx + w / 2, y + hh / 2 + 5, name, 's b');
    rows.forEach((row, ri) => { s += r(cx, y + hh + ri * rh, w, rh, (cls && cls(ri, c)) || 'n', 0) + t(cx + w / 2, y + hh + ri * rh + rh / 2 + 5, row[c], 's'); });
    cx += w;
  });
  return s;
}
const V = {};

/* ================= C ================= */
V['c-pipeline'] = () => svg(440, 116, [['Your code', 'hello.c', 'fa', 'you write'], ['Compiler', 'gcc', 'f2', 'translates'], ['Program', 'hello.exe', 'f2', 'computer runs'], ['Output', 'Hello!', 'fok', 'you see']].map(([a, b, c, u], i) => box(i * 118, 12, 86, 58, [a, b], c, i ? '' : '') + t(i * 118 + 43, 96, u, 's m') + (i < 3 ? ln(i * 118 + 88, 41, i * 118 + 116, 41) : '')).join(''),
  'From code to program: you write source code (hello.c), the compiler gcc translates it, the computer runs the program (hello.exe), and you see the output.', 'A compiler turns the code you write into a program the computer can run.');
V['c-symbols'] = () => {
  let s = ''; const cy = 38; const L = [['Start / End'], ['Input /', 'Output'], ['Process'], ['Decision', '(yes / no)'], ['Flow']];
  [44, 132, 220, 308, 396].forEach((cx, i) => {
    if (i === 0) s += r(cx - 36, cy - 18, 72, 36, 'fa', 18);
    if (i === 1) s += poly(`${cx - 30},${cy - 18} ${cx + 40},${cy - 18} ${cx + 30},${cy + 18} ${cx - 40},${cy + 18}`, 'n');
    if (i === 2) s += r(cx - 36, cy - 18, 72, 36, 'n', 3);
    if (i === 3) s += poly(`${cx},${cy - 25} ${cx + 40},${cy} ${cx},${cy + 25} ${cx - 40},${cy}`, 'fw');
    if (i === 4) s += ln(cx - 32, cy, cx + 30, cy, 'e thick');
    s += tl(cx, 84, L[i], 's');
  });
  return svg(440, 112, s, 'Flowchart symbols: rounded oval = start or end; slanted parallelogram = input or output; rectangle = process (a calculation); diamond = decision (yes or no); arrow = flow.', 'The five flowchart shapes.');
};
V['c-skeleton'] = () => {
  const L = [['#include <stdio.h>', 'tools for printf / scanf'], ['int main() {', 'the program starts here'], ['    printf("Hi!\\n");', 'one step — ends with ;'], ['    return 0;', '0 means “all OK”'], ['}', 'end of main']];
  let s = r(0, 0, 250, 166, 'code', 8);
  L.forEach(([c, n], i) => { const y = 30 + i * 30; s += t(12, y, c, 'mono', 'start') + ln(236, y - 5, 262, y - 5, 'e dash thin', false) + t(268, y, n, 's acc', 'start'); });
  return svg(440, 166, s, 'The skeleton of a C program: #include <stdio.h> gives tools for printf and scanf; int main() { is where the program starts; each statement ends with a semicolon; return 0 means all OK; the closing brace ends main.', '');
};
V['c-variables'] = () => {
  let s = '';
  [['age', '19', 'int', 'whole number'], ['price', '4.50', 'double', 'decimal number'], ['grade', "'A'", 'char', 'one character']].forEach(([n, v, ty, d], i) => {
    const cx = 70 + i * 150; s += t(cx, 22, n, 'b mono') + r(cx - 60, 30, 120, 60, 'fa', 10) + t(cx, 68, v, 'big') + t(cx, 112, ty, 'mono acc') + t(cx, 130, d, 's m');
  });
  s += r(10, 148, 200, 34, 'fbad') + t(110, 170, '7 / 2   →   3', 'mono') + r(230, 148, 200, 34, 'fok') + t(330, 170, '7.0 / 2   →   3.5', 'mono');
  return svg(440, 188, s, 'Variables are labelled boxes: age holds the int 19, price holds the double 4.50, grade holds the char A. Watch out: 7 / 2 gives 3 with ints, while 7.0 / 2 gives 3.5.', 'Each variable is a box with a name, a type and one value. Dividing two ints throws the decimals away.');
};
V['c-io'] = () => {
  let s = box(0, 12, 110, 50, ['Keyboard', 'you type 20'], 'f2') + ln(112, 37, 163, 37) + box(165, 12, 110, 50, ['scanf("%d",', '&age);'], 'n', 'mono s') + ln(277, 37, 318, 37);
  s += r(320, 6, 120, 62, 'fa', 10) + t(380, 26, 'age', 's b mono') + t(380, 56, '20', 'big');
  s += pth('M380,70 L380,125 L279,125') + box(165, 100, 110, 50, ['printf(…,', 'age + 1);'], 'n', 'mono s') + ln(163, 125, 114, 125) + box(0, 100, 110, 50, ['Screen', 'shows 21'], 'fok');
  return svg(440, 156, s, 'Input and output: you type 20 on the keyboard, scanf("%d", &age) stores it in the variable age, then printf shows age + 1, so the screen shows 21.', 'scanf stores what you type in a variable (the & says where). printf shows values on the screen.');
};
V['c-ifelse'] = () => {
  let s = poly('220,10 310,44 220,78 130,44', 'fw') + t(220,49, 'age >= 18 ?', 'mono');
  s += pth('M130,44 L80,44 L80,98') + t(104, 36, 'Yes', 's b ok') + box(10, 100, 140, 42, ['print "Adult"'], 'fok', 'mono s');
  s += pth('M310,44 L360,44 L360,98') + t(336, 36, 'No', 's b bad') + box(290, 100, 140, 42, ['print "Child"'], 'f2', 'mono s');
  s += pth('M80,142 L80,172 L218,172', 'e', false) + pth('M360,142 L360,172 L222,172', 'e', false) + ln(220, 172, 220, 192) + box(150, 194, 140, 34, ['continue…'], 'n', 's');
  return svg(440, 232, s, 'An if-else decision: if age >= 18 is true (yes), print Adult; if false (no), print Child; both paths then continue.', 'if/else: the program takes exactly one of the two paths.');
};
V['c-function'] = () => svg(440, 128,
  t(28, 60, '4', 'big acc') + ln(48, 54, 118, 54, 'e', 'a') + t(83, 42, 'parameter x', 'xs m') + r(120, 14, 200, 80, 'fa', 14) + t(220, 46, 'square(x)', 'b mono') + t(220, 74, 'return x * x;', 'mono s') + ln(322, 54, 390, 54, 'e', 'o') + t(358, 42, 'return value', 'xs m') + t(414, 60, '16', 'big ok') + t(220, 120, 'printf("%d", square(4));  →  16', 'mono s m'),
  'A function is a machine: the input 4 goes in as parameter x, square(x) computes return x * x, and 16 comes out as the return value.', 'A function takes inputs (parameters), does one job, and gives back a result (return).');
V['c-array'] = () => {
  let s = t(30, 57, 'marks', 'b mono');
  [70, 85, 90, 60, 75].forEach((v, i) => { const x = 66 + i * 62; s += r(x, 30, 62, 42, 'fa', 0) + t(x + 31, 57, v, 'b') + t(x + 31, 94, '[' + i + ']', 'mono acc'); });
  s += r(376, 30, 62, 42, 'fbad dash', 0) + t(407, 57, '?', 'b bad') + t(407, 94, '[5]', 'mono bad') + t(407, 114, 'not there!', 's bad') + t(30, 94, 'index', 's m');
  return svg(440, 122, s, 'An array called marks with 5 boxes holding 70, 85, 90, 60 and 75 at indexes 0 to 4. Index 5 does not exist.', 'int marks[5] has indexes 0 to 4 — counting starts at 0.');
};
V['c-pointer'] = () => svg(440, 172,
  t(110, 24, 'x', 'b mono') + r(50, 32, 120, 52, 'fa', 8) + t(110, 66, '9', 'big') + t(110, 104, 'lives at 0x1000', 's mono m') +
  t(330, 24, 'p', 'b mono') + r(270, 32, 120, 52, 'f2', 8) + t(330, 64, '0x1000', 'mono') + t(330, 104, 'lives at 0x2000', 's mono m') +
  ln(268, 58, 174, 58, 'e acc thick', 'a') + t(221, 50, 'points to', 's acc') +
  t(220, 138, '&x  →  0x1000   (where x lives)', 'mono s') + t(220, 160, '*p  →  9   (what lives there)', 'mono s'),
  'A pointer: variable x holds 9 at address 0x1000; pointer p holds the address 0x1000, so p points to x. &x gives the address 0x1000; *p gives the value 9.', 'A pointer stores an address. & asks “where?”, * asks “what is there?”.');
V['c-strings'] = () => {
  let s = t(28, 52, 'name', 'b mono');
  ['A', 'd', 'a', '\\0'].forEach((ch, i) => { const x = 60 + i * 56; s += r(x, 26, 56, 40, i === 3 ? 'fw' : 'fa', 0) + t(x + 28, 52, i === 3 ? '\\0' : "'" + ch + "'", 'mono b') + t(x + 28, 86, '[' + i + ']', 'mono s acc'); });
  s += t(296, 40, '← the end mark', 's', 'start') + t(296, 58, '(strlen = 3)', 's m', 'start');
  return svg(440, 100, s, 'A string is a char array: name holds A, d, a and then the end mark backslash zero at index 3. strlen is 3.', 'A string is an array of chars that ends with \\0.');
};

/* ================= DB ================= */
V['db-table'] = () => {
  let s = table(70, 40, [['student_id', 90], ['first_name', 110], ['city', 100]], [['1', 'Deniz', 'Istanbul'], ['2', 'Ece', 'Ankara'], ['3', 'Arda', 'Izmir']], (ri, c) => c === 0 ? 'fa' : ri === 1 ? 'fok' : 'n');
  s += t(195, 20, 'a column (field)', 's acc') + ln(195, 25, 195, 38, 'e acc', 'a');
  s += t(30, 106, 'a row', 's ok') + t(30, 122, '(record)', 's ok') + ln(52, 116, 68, 116, 'e ok', 'o');
  s += ln(115, 178, 115, 160, 'e acc', 'a') + t(115, 194, 'primary key: unique for every row', 's acc', 'start');
  return svg(440, 200, s, 'A table called Students with columns student_id, first_name and city, and three rows. A column is a field, a row is one record, and student_id is the primary key.', '');
};
V['db-keys'] = () => {
  let s = t(100, 28, 'Departments', 'b') + table(10, 36, [['dept_id', 80], ['dept_name', 100]], [['1', 'IT'], ['2', 'Business']], (ri, c) => c === 0 ? 'fa' : 'n');
  s += t(325, 28, 'Students', 'b') + table(220, 36, [['student_id', 80], ['name', 64], ['dept_id', 76]], [['7', 'Deniz', '1'], ['8', 'Ece', '1'], ['9', 'Arda', '2']], (ri, c) => c === 0 ? 'fa' : c === 2 ? 'fw' : 'n');
  s += pth('M402,142 C402,192 50,192 50,124', 'e acc thick', 'a') + t(226, 160, 'foreign key → primary key', 's acc b');
  s += r(10, 196, 14, 12, 'fa', 2) + t(30, 207, 'primary key (PK)', 's', 'start') + r(170, 196, 14, 12, 'fw', 2) + t(190, 207, 'foreign key (FK)', 's', 'start');
  return svg(440, 214, s, 'Two linked tables: Departments has primary key dept_id. Students has primary key student_id and a foreign key dept_id that points to Departments.dept_id, so Deniz and Ece belong to department 1 (IT) and Arda to department 2.', '');
};
V['db-normalize'] = () => {
  let s = t(220, 16, 'Before: one messy table', 'b bad');
  s += table(30, 24, [['student', 80], ['courses', 110], ['dept', 70], ['dept_phone', 120]], [['Ali', 'Math, C', 'IT', '555-01'], ['Ece', 'C', 'IT', '555-01']], (ri, c) => (ri === 0 && c === 1) ? 'fbad' : c === 3 ? 'fw' : 'n', 24, 24);
  s += t(220, 118, '✗ two values in one cell     ✗ the same phone stored twice', 's bad');
  s += ln(220, 128, 220, 156, 'e acc thick', 'a') + t(232, 146, 'normalize', 's acc b', 'start');
  s += t(65, 170, 'Students', 's b') + table(0, 176, [['id', 40], ['name', 90]], [['1', 'Ali'], ['2', 'Ece']], () => 'n', 24, 24);
  s += t(220, 170, 'Enrollments', 's b') + table(150, 176, [['student', 70], ['course', 70]], [['1', 'Math'], ['1', 'C'], ['2', 'C']], () => 'fa', 24, 24);
  s += t(375, 170, 'Departments', 's b') + table(310, 176, [['dept', 55], ['phone', 75]], [['IT', '555-01']], () => 'n', 24, 24);
  s += t(220, 296, '✓ every fact is stored exactly once', 's ok b');
  return svg(440, 302, s, 'Normalization. Before: one table where Ali has two courses in one cell and the IT phone number is stored twice. After: three tables — Students, Enrollments (one row per student and course) and Departments (each phone stored once).', '');
};
V['db-order'] = () => {
  const chev = (x, y, label, c) => poly(`${x},${y} ${x + 62},${y} ${x + 72},${y + 17} ${x + 62},${y + 34} ${x},${y + 34} ${x + 10},${y + 17}`, c) + t(x + 37, y + 21, label, 'xs b');
  let s = t(0, 16, 'You WRITE the clauses in this order:', 's m', 'start');
  ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'].forEach((w, i) => { s += chev(i * 72, 24, w, 'f2'); });
  s += t(0, 90, 'The database RUNS them in this order:', 's m', 'start');
  ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY'].forEach((w, i) => { s += chev(i * 72, 98, w, w === 'SELECT' ? 'fw' : 'fa'); });
  return svg(440, 140, s, 'SQL clause order. You write SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY. The database runs FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.', 'That is why WHERE can’t use a column alias from SELECT, but ORDER BY can.');
};
V['db-families'] = () => {
  let s = '';
  [['DDL — builds tables', 'CREATE   ALTER', 'DROP   TRUNCATE', 'fa'], ['DML — works with rows', 'SELECT   INSERT', 'UPDATE   DELETE', 'fok'], ['DCL — who may do what', 'GRANT   REVOKE', 'DENY', 'fw'], ['TCL — all or nothing', 'BEGIN   COMMIT', 'ROLLBACK', 'f2']].forEach(([h, a, b, c], i) => {
    const x = (i % 2) * 228, y = Math.floor(i / 2) * 106; s += r(x, y, 212, 96, c, 10) + t(x + 14, y + 28, h, 'b', 'start') + t(x + 14, y + 56, a, 'mono s', 'start') + t(x + 14, y + 78, b, 'mono s', 'start');
  });
  return svg(440, 202, s, 'The four families of SQL commands: DDL builds tables (CREATE, ALTER, DROP, TRUNCATE); DML works with rows (SELECT, INSERT, UPDATE, DELETE); DCL controls permissions (GRANT, REVOKE, DENY); TCL makes changes all-or-nothing (BEGIN, COMMIT, ROLLBACK).', '');
};
V['db-delete'] = () => {
  let s = '';
  const mini = (x, mode) => {
    let g = r(x, 34, 120, 20, mode === 'drop' ? 'f2 dash' : 'f2', 0);
    for (let i = 0; i < 4; i++) g += r(x, 54 + i * 16, 120, 16, mode === 'drop' ? 'n dash' : (mode === 'del' && (i === 1 || i === 3)) ? 'fbad' : 'n', 0);
    if (mode === 'del') g += ln(x + 8, 70, x + 112, 70, 'e bad', false) + ln(x + 8, 102, x + 112, 102, 'e bad', false);
    if (mode === 'trunc') g += t(x + 60, 92, '(empty)', 's m');
    if (mode === 'drop') g += ln(x, 34, x + 120, 118, 'e bad thick', false) + ln(x + 120, 34, x, 118, 'e bad thick', false);
    return g;
  };
  s += t(70, 22, 'DELETE … WHERE', 'mono s b') + mini(10, 'del') + t(70, 140, 'removes chosen rows', 's m');
  s += t(220, 22, 'TRUNCATE', 'mono s b') + mini(160, 'trunc') + t(220, 140, 'empties the table', 's m');
  s += t(370, 22, 'DROP', 'mono s b') + mini(310, 'drop') + t(370, 140, 'removes the table itself', 's m');
  return svg(440, 150, s, 'DELETE with WHERE removes chosen rows; TRUNCATE empties all rows but keeps the table; DROP removes the whole table.', 'DELETE without WHERE removes every row — always write the WHERE first.');
};

/* ================= Networks ================= */
V['net-sizes'] = () => svg(440, 206,
  r(0, 0, 440, 204, 'f2', 16) + t(14, 22, 'WAN — countries (the Internet is the biggest)', 'b s', 'start') + r(18, 34, 404, 160, 'n', 14) + t(32, 56, 'MAN — a city', 'b s', 'start') +
  r(36, 68, 250, 116, 'fa', 12) + t(50, 90, 'LAN — one building', 'b s', 'start') + r(56, 102, 140, 70, 'fok', 10) + tl(126, 132, ['PAN', 'phone + earbuds'], 's') +
  r(304, 90, 100, 36, 'f2', 6) + t(354, 113, 'other LAN', 's m') + r(304, 136, 100, 36, 'f2', 6) + t(354, 159, 'other LAN', 's m'),
  'Network sizes from small to big: a PAN (your phone and earbuds) sits inside a LAN (one building), inside a MAN (a city), inside a WAN (countries; the Internet is the biggest WAN).', '');
V['net-topos'] = () => {
  let s = '';
  const N = (x, y) => circ(x, y, 10, 'fa');
  const panel = (px, py, title, sub, draw) => { s += r(px, py, 214, 158, 'n', 10) + draw(px + 107, py + 66) + t(px + 107, py + 132, title, 'b s') + t(px + 107, py + 149, sub, 's m'); };
  const ring = (cx, cy, n, rr) => Array.from({ length: n }, (x, i) => [cx + rr * Math.cos(2 * Math.PI * i / n - Math.PI / 2), cy + rr * Math.sin(2 * Math.PI * i / n - Math.PI / 2)]);
  panel(0, 0, 'Star', 'all cables go to one switch', (cx, cy) => { const p = ring(cx, cy, 5, 48); return p.map(q => ln(cx, cy, q[0], q[1], 'e', false)).join('') + r(cx - 16, cy - 11, 32, 22, 'fw', 4) + t(cx, cy + 4, 'SW', 'xs b') + p.map(q => N(q[0], q[1])).join(''); });
  panel(226, 0, 'Bus', 'one shared cable', (cx, cy) => ln(cx - 90, cy, cx + 90, cy, 'e thick', false) + [-70, -35, 0, 35, 70].map((dx, i) => ln(cx + dx, cy, cx + dx, cy + (i % 2 ? 30 : -30), 'e', false) + N(cx + dx, cy + (i % 2 ? 30 : -30))).join(''));
  panel(0, 170, 'Ring', 'each to its two neighbours', (cx, cy) => { const p = ring(cx, cy, 6, 46); return p.map((q, i) => ln(q[0], q[1], p[(i + 1) % 6][0], p[(i + 1) % 6][1], 'e', false)).join('') + p.map(q => N(q[0], q[1])).join(''); });
  panel(226, 170, 'Mesh', 'many links — very reliable', (cx, cy) => { const p = ring(cx, cy, 5, 48); let g = ''; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) g += ln(p[i][0], p[i][1], p[j][0], p[j][1], 'e thin', false); return g + p.map(q => N(q[0], q[1])).join(''); });
  return svg(440, 328, s, 'Four network topologies: star (all devices cabled to one central switch), bus (one shared cable), ring (each device connected to its two neighbours in a circle), mesh (devices connected to many others).', '');
};
V['net-lan'] = () => {
  let s = t(110, 16, 'inside the LAN → switch (MAC)', 's acc b');
  [30, 74, 118].forEach(y => { s += box(0, y, 54, 28, ['PC'], 'f2', 's') + ln(56, y + 14, 128, 96, 'e', false); });
  s += box(130, 80, 72, 34, ['Switch'], 'fa', 's b') + ln(204, 97, 250, 97) + box(252, 80, 72, 34, ['Router'], 'fw', 's b') + t(288, 66, 'joins networks (IP)', 's bad b');
  s += ln(326, 97, 352, 97) + ell(394, 97, 44, 30, 'f2') + t(394, 102, 'Internet', 's b');
  s += ln(166, 116, 166, 150, 'e', false) + box(130, 152, 72, 30, ['Wi-Fi AP'], 'n', 's') + pth('M204,167 Q232,150 262,167', 'e dash', false) + pth('M210,177 Q232,165 256,177', 'e dash', false) + box(266, 154, 70, 28, ['laptop'], 'f2', 's');
  return svg(440, 192, s, 'A small network: three PCs connect by cable to a switch inside the LAN; a Wi-Fi access point on the switch connects a laptop wirelessly; the switch connects to a router, which joins the LAN to the Internet.', 'Switch = connects devices inside one network. Router = connects different networks.');
};
V['net-osi'] = () => {
  const L = [[7, 'Application', 'HTTP, DNS', 'data', 'fa'], [6, 'Presentation', 'TLS, JPEG', 'data', 'fa'], [5, 'Session', 'sessions', 'data', 'fa'], [4, 'Transport', 'TCP, UDP', 'segment', 'fw'], [3, 'Network', 'IP, router', 'packet', 'fok'], [2, 'Data link', 'MAC, switch', 'frame', 'f2'], [1, 'Physical', 'cables, bits', 'bits', 'n']];
  let s = t(140, 14, 'OSI — 7 layers', 's b') + t(312, 14, 'PDU', 's b') + t(394, 14, 'TCP/IP', 's b');
  L.forEach(([n, name, ex, pdu, c], i) => { const y = 22 + i * 42; s += r(0, y, 280, 38, c, 6) + t(12, y + 24, n + '  ' + name, 'b s', 'start') + t(270, y + 24, ex, 's m', 'end') + t(312, y + 24, pdu, 's mono'); });
  [['Application', 0, 3, 'fa'], ['Transport', 3, 1, 'fw'], ['Internet', 4, 1, 'fok'], ['Network', 5, 2, 'f2']].forEach(([nm, a, k, c]) => { const y = 22 + a * 42; const h = k * 42 - 4; s += r(348, y, 92, h, c, 6) + (nm === 'Network' ? tl(394, y + h / 2 - 3, ['Network', 'access'], 's b') : t(394, y + h / 2 + 5, nm, 's b')); });
  return svg(440, 318, s, 'The OSI model has 7 layers, top to bottom: 7 Application (HTTP, DNS), 6 Presentation (TLS, JPEG), 5 Session, 4 Transport (TCP, UDP; PDU segment), 3 Network (IP, routers; packet), 2 Data link (MAC, switches; frame), 1 Physical (cables; bits). TCP/IP joins them into 4 layers: Application (7 to 5), Transport (4), Internet (3), Network access (2 and 1).', 'Memory aid, top to bottom: All People Seem To Need Data Processing.');
};
V['net-encap'] = () => {
  let s = '';
  const blk = (x, w, lab, c) => r(x, 0, w, 26, c, 4) + t(x + w / 2, 18, lab, 'xs b');
  const rows = [['data', 'Application', [[256, 104, 'DATA', 'fa']]], ['segment', 'Transport', [[206, 48, 'TCP', 'fw'], [256, 104, 'DATA', 'fa']]], ['packet', 'Network', [[156, 48, 'IP', 'fok'], [206, 48, 'TCP', 'fw'], [256, 104, 'DATA', 'fa']]], ['frame', 'Data link', [[106, 48, 'MAC', 'f2'], [156, 48, 'IP', 'fok'], [206, 48, 'TCP', 'fw'], [256, 104, 'DATA', 'fa'], [362, 44, 'FCS', 'f2']]]];
  rows.forEach(([a, b, bl], i) => { const y = 8 + i * 42; s += t(0, y + 13, a, 'b s', 'start') + t(0, y + 29, b, 'xs m', 'start') + `<g transform="translate(0,${y + 2})">` + bl.map(q => blk(...q)).join('') + '</g>'; });
  s += t(0, 8 + 4 * 42 + 13, 'bits', 'b s', 'start') + t(0, 8 + 4 * 42 + 29, 'Physical', 'xs m', 'start') + t(106, 8 + 4 * 42 + 20, '0110 1001 0011 1100 0101 1010 …', 'mono s', 'start');
  return svg(440, 214, s, 'Encapsulation: going down the layers, each layer adds its own header. DATA becomes a segment (TCP header + data), then a packet (IP + TCP + data), then a frame (MAC + IP + TCP + data + FCS), and finally bits on the wire.', 'Sending = each layer wraps the data in its own header. Receiving = unwrap in reverse.');
};
V['net-tcpudp'] = () => {
  let s = '';
  const side = (x, title, msgs, foot) => {
    s += t(x + 105, 16, title, 'b') + t(x + 30, 36, 'You', 's m') + t(x + 180, 36, 'Server', 's m') + ln(x + 30, 42, x + 30, 206, 'e thin dash', false) + ln(x + 180, 42, x + 180, 206, 'e thin dash', false);
    msgs.forEach(([lab, dir, lost], i) => { const y = 58 + i * 30; const [a, b] = dir > 0 ? [x + 32, x + 178] : [x + 178, x + 32]; s += lost ? ln(a, y, x + 115, y + 9, 'e bad dash', false) + t(x + 128, y + 22, '✗', 'b bad') : ln(a, y, b, y + 14, dir > 0 ? 'e acc' : 'e ok', dir > 0 ? 'a' : 'o'); s += t(x + 105, y + 2, lab, 'xs mono'); });
    s += t(x + 105, 228, foot, 's b');
  };
  side(0, 'TCP — careful', [['SYN', 1], ['SYN-ACK', -1], ['ACK', 1], ['data', 1], ['ACK (got it)', -1]], 'connect · check · resend');
  side(230, 'UDP — fast', [['data', 1], ['data', 1], ['data', 1, true], ['data', 1], ['data', 1]], 'just send, no checks');
  return svg(440, 236, s, 'TCP versus UDP. TCP first connects with a handshake (SYN, SYN-ACK, ACK), then sends data and waits for acknowledgements, resending anything lost. UDP just sends data with no handshake and no checks; a lost piece is simply lost.', 'TCP for web, email and files. UDP for live video, games and DNS.');
};
V['net-ip'] = () => {
  let s = '';
  ['192', '168', '1', '10'].forEach((o, i) => { s += r(20 + i * 104, 10, 96, 34, 'f2', 6) + t(68 + i * 104, 33, o, 'mono b') + (i < 3 ? t(118 + i * 104, 33, '.', 'b') : ''); });
  s += t(220, 62, '4 numbers × 8 bits = 32 bits', 's m');
  const bar = (y, p) => { const w = 400 * p / 32; return r(20, y, w, 30, 'fa', 0) + t(20 + w / 2, y + 20, 'network  /' + p, 's b') + r(20 + w, y, 400 - w, 30, 'fbad', 0) + t(20 + w + (400 - w) / 2, y + 20, 'host ' + (32 - p), 's b'); };
  s += bar(74, 24) + t(20, 124, '/24  →  8 host bits  →  2⁸ − 2  =  254 usable hosts', 's', 'start');
  s += bar(138, 26) + t(20, 188, '/26  →  6 host bits  →  2⁶ − 2  =  62 usable hosts', 's', 'start');
  return svg(440, 196, s, 'An IPv4 address such as 192.168.1.10 is 4 numbers of 8 bits, 32 bits in total. With /24 the first 24 bits are the network and 8 bits are for hosts: 2 to the 8 minus 2 = 254 hosts. With /26, 6 host bits give 62 hosts.', 'The prefix (/24, /26 …) says how many bits belong to the network. The rest are for hosts.');
};
V['net-ping'] = () => svg(440, 156,
  pth('M60,40 L380,40', 'e acc dash', 'a') + t(220, 30, 'ping: are you there?', 's acc b') +
  box(0, 52, 60, 34, ['PC'], 'f2', 's b') + ln(62, 69, 118, 69, 'e', false) + circ(140, 69, 21, 'fw') + t(140, 74, 'R1', 's b') + ln(161, 69, 238, 69, 'e', false) + circ(260, 69, 21, 'fw') + t(260, 74, 'R2', 's b') + ln(281, 69, 378, 69, 'e', false) + box(380, 52, 60, 34, ['Server'], 'fok', 's b') +
  t(140, 108, 'hop 1', 'xs m') + t(260, 108, 'hop 2', 'xs m') + t(410, 104, 'hop 3', 'xs m') +
  pth('M380,124 L60,124', 'e ok', 'o') + t(220, 146, 'reply: yes, 12 ms   ·   tracert lists every hop', 's ok b'),
  'ping sends a small message from your PC through routers R1 and R2 to the server and waits for a reply. tracert lists every router (hop) on the way.', '');

/* ================= Maths ================= */
V['math-sets'] = () => svg(440, 232,
  ell(220, 116, 216, 112, 'f2') + ell(188, 122, 160, 88, 'n') + ell(160, 130, 104, 62, 'f2') + ell(132, 136, 52, 34, 'fa') +
  t(132, 134, 'ℕ', 'b') + t(132, 152, '0, 1, 2 …', 'xs') + t(160, 90, 'ℤ   −3, −1', 's') + t(188, 56, 'ℚ   ½, 0.75, −2/3', 's') + t(388, 106, 'ℝ', 'b') + t(388, 126, 'irrational:', 'xs m') + t(388, 142, 'π, √2', 's'),
  'Number sets inside each other: natural numbers N (0, 1, 2) are inside the integers Z (which add negatives), inside the rational numbers Q (fractions), inside the real numbers R, which also contain irrational numbers like pi and root 2.', 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ — each set contains the one before it.');
V['math-gcd'] = () => svg(440, 228,
  t(120, 16, '12 = 2 · 2 · 3', 's b') + t(320, 16, '18 = 2 · 3 · 3', 's b') + circ(170, 104, 82, 'vc') + circ(270, 104, 82, 'vc') +
  t(126, 112, '2', 'big') + t(220, 112, '2   3', 'big acc') + t(314, 112, '3', 'big') +
  t(220, 206, 'GCD = the middle = 2 · 3 = 6', 's b acc') + t(220, 224, 'LCM = everything = 2 · 2 · 3 · 3 = 36', 's b'),
  'Venn diagram of prime factors: 12 = 2·2·3 and 18 = 2·3·3. Shared in the middle: 2 and 3. Left only: 2. Right only: 3. GCD = middle = 6. LCM = all factors = 36.', '');
V['math-exp'] = () => {
  let s = t(0, 30, '2³ · 2⁴', 'b', 'start');
  for (let i = 0; i < 7; i++) { const x = 92 + i * 36 + (i >= 3 ? 20 : 0); s += r(x, 10, 30, 30, i < 3 ? 'fa' : 'fok', 4) + t(x + 15, 31, '2', 's b'); }
  s += t(92 + 3 * 36 + 4, 30, '·', 'b');
  s += t(0, 84, '= 2⁷', 'b', 'start');
  for (let i = 0; i < 7; i++) { const x = 92 + i * 36; s += r(x, 64, 30, 30, i < 3 ? 'fa' : 'fok', 4) + t(x + 15, 85, '2', 's b'); }
  s += t(220, 122, 'same base → just count the 2s:  3 + 4 = 7', 's m');
  return svg(440, 130, s, '2 cubed times 2 to the 4th is three 2s times four 2s, which is seven 2s: 2 to the 7th. With the same base, add the exponents.', '');
};
V['math-area'] = () => svg(360, 252,
  r(70, 30, 130, 130, 'fa', 0) + r(200, 30, 78, 130, 'f2', 0) + r(70, 160, 130, 52, 'f2', 0) + r(200, 160, 78, 52, 'fok', 0) +
  t(135, 102, 'x²', 'big') + t(239, 102, '3x', 'big') + t(135, 193, '2x', 'big') + t(239, 193, '6', 'big') +
  t(135, 22, 'x', 'b acc') + t(239, 22, '3', 'b acc') + t(56, 100, 'x', 'b acc') + t(56, 191, '2', 'b acc') +
  t(180, 240, '(x + 2)(x + 3)  =  x² + 5x + 6', 'b'),
  'Area model: a rectangle with sides x + 3 and x + 2 splits into x squared, 3x, 2x and 6, so (x + 2)(x + 3) = x squared + 5x + 6.', 'Factoring is this picture backwards: find the two sides from the area.');
V['math-ineq'] = () => {
  const X = v => 40 + (v + 4) * 40;
  const line = (y) => { let g = ln(20, y, 420, y, 'e', false); for (let v = -4; v <= 5; v++) g += ln(X(v), y - 5, X(v), y + 5, 'e', false) + t(X(v), y + 20, v, 'xs m'); return g; };
  let s = t(20, 16, 'x > 2   (open ○ = 2 is NOT included)', 's', 'start') + line(40) + ln(X(2) + 7, 40, 418, 40, 'e acc thick', 'a') + circ(X(2), 40, 6, 'n acc-stroke');
  s += t(20, 86, 'x ≤ −1   (filled ● = −1 IS included)', 's', 'start') + line(110) + ln(X(-1) - 4, 110, 22, 110, 'e acc thick', 'a') + circ(X(-1), 110, 6, 'fs');
  s += t(220, 166, '−2x > 6   →   x < −3      (÷ by a negative → flip the sign!)', 's b bad');
  return svg(440, 174, s, 'Inequalities on a number line: x > 2 is an open circle at 2 with an arrow to the right; x ≤ −1 is a filled circle at −1 with an arrow to the left. Dividing by a negative flips the sign: −2x > 6 gives x < −3.', '');
};
V['math-abs'] = () => {
  const X = v => 40 + (v + 3) * 30; let s = t(220, 16, '|x − 3| = 5   means   x is 5 steps away from 3', 's');
  s += ln(20, 80, 420, 80, 'e', false); for (let v = -3; v <= 9; v++) s += ln(X(v), 75, X(v), 85, 'e', false) + t(X(v), 102, v, 'xs m');
  s += pth(`M${X(3)},72 Q${(X(3) + X(8)) / 2},28 ${X(8)},72`, 'e acc', 'a') + pth(`M${X(3)},72 Q${(X(3) + X(-2)) / 2},28 ${X(-2)},72`, 'e acc', 'a') + t((X(3) + X(8)) / 2, 44, '5', 'b acc') + t((X(3) + X(-2)) / 2, 44, '5', 'b acc');
  s += circ(X(3), 80, 6, 'fw') + circ(X(8), 80, 7, 'fs') + circ(X(-2), 80, 7, 'fs') + t(220, 126, 'x = −2   or   x = 8', 'b ok');
  return svg(440, 132, s, 'Absolute value as distance: |x − 3| = 5 means x is 5 steps from 3 on the number line, so x = −2 or x = 8.', '');
};
V['math-percent'] = () => svg(440, 124,
  t(180, 20, '100%', 's m') + t(364, 20, '+15%', 's ok b') + r(20, 28, 320, 36, 'fa', 0) + t(180, 52, '200 TL', 'b') + r(340, 28, 48, 36, 'fok', 0) + t(364, 52, '+30', 's b') +
  t(204, 94, '200 × 1.15 = 230 TL', 'b') + t(204, 114, 'increase by p%  →  × (1 + p/100)      decrease  →  × (1 − p/100)', 'xs m'),
  'Percentage bar model: 200 TL is 100%; a 15% increase adds 30 TL, so the new price is 200 × 1.15 = 230 TL.', '');

/* ================= Office ================= */
V['off-email'] = () => {
  let s = box(0, 78, 80, 40, ['You'], 'fa', 'b');
  [['To: Ali', 'main person', 10, 'fok'], ['CC: Ece', 'a visible copy', 78, 'f2'], ['BCC: Can', 'a hidden copy', 146, 'n dash']].forEach(([a, b, y, c]) => { s += ln(82, 98, 246, y + 20) + box(248, y, 104, 40, [a], c, 's b') + t(360, y + 25, b, 's m', 'start'); });
  return svg(440, 196, s, 'Email fields: To is the main person (Ali); CC sends a visible copy (Ece); BCC sends a hidden copy (Can). Ali and Ece can see each other, but nobody sees Can.', 'Ali and Ece see each other’s addresses. Nobody sees Can — use BCC for mass emails.');
};
V['off-roles'] = () => svg(440, 168,
  r(0, 100, 140, 64, 'f2', 8) + t(70, 122, 'Viewer', 'b') + t(70, 146, 'read', 's') +
  r(150, 60, 140, 104, 'fa', 8) + t(220, 82, 'Commenter', 'b') + tl(220, 108, ['read', 'comment'], 's', 'middle', 20) +
  r(300, 20, 140, 144, 'fok', 8) + t(370, 42, 'Editor', 'b') + tl(370, 68, ['read', 'comment', 'change', 'share'], 's', 'middle', 20),
  'Google Drive sharing roles as a staircase: Viewer can read; Commenter can read and comment; Editor can read, comment, change and share.', 'Each step up can do everything below it, plus more.');
V['off-ribbon'] = () => {
  const tabs = [['Home', ['fonts', 'bullets', 'styles', 'Format Painter']], ['Insert', ['tables', 'pictures', 'shapes', 'page no.']], ['Layout', ['margins', 'orientation', 'columns', 'breaks']], ['References', ['contents', 'citations', 'footnotes']], ['Review', ['spelling', 'comments', 'track changes']], ['View', ['zoom', 'ruler', 'read mode']]];
  let s = '';
  tabs.forEach(([n, items], i) => { const x = i * 73.3; s += r(x + 1, 6, 71, 30, i === 0 ? 'fa' : 'f2', 6) + t(x + 37, 26, n, 'xs b'); items.forEach((it, k) => { s += t(x + 37, 60 + k * 18, it, 'xs'); }); });
  s += r(0, 136, 440, 30, 'fw', 6) + t(220, 156, 'File (Backstage): Save As · PDF · Print · Protect · Inspect', 'xs b');
  return svg(440, 170, s, 'The Word ribbon: Home has fonts, bullets, styles and Format Painter; Insert has tables, pictures, shapes and page numbers; Layout has margins, orientation, columns and breaks; References has table of contents, citations and footnotes; Review has spelling, comments and track changes; View has zoom, ruler and read mode. The File tab (Backstage) has Save As, PDF, Print, Protect and Inspect.', '');
};
V['off-ref'] = () => {
  let s = table(10, 10, [['', 34], ['B', 96], ['C', 170], ['E', 110]], [['1', 'price', 'with tax', '1.2'], ['2', '100', '=B2*$E$1', ''], ['3', '250', '=B3*$E$1', ''], ['4', '80', '=B4*$E$1', '']], (ri, c) => (c === 2 && ri > 0) ? 'fa' : (c === 3 && ri === 0) ? 'fw' : c === 0 ? 'f2' : 'n', 28, 26);
  s += ln(390, 76, 390, 126, 'e acc', 'a') + t(398, 106, 'copy', 's acc', 'start') + t(398, 122, 'down', 's acc', 'start');
  s += t(10, 168, 'B2 → B3 → B4 : moves with the copy (relative)', 's acc b', 'start') + t(10, 190, '$E$1 : stays locked on the tax rate (absolute)', 's warn b', 'start');
  return svg(440, 196, s, 'Copying the formula =B2*$E$1 down column C gives =B3*$E$1 and =B4*$E$1: the relative reference B2 moves, while the absolute reference $E$1 stays locked on the tax rate.', '');
};
V['off-anim'] = () => svg(440, 154,
  r(0, 16, 170, 104, 'f2', 8) + t(85, 36, 'Slide 1', 's m') + r(18, 62, 34, 26, 'fa', 4) + ln(56, 75, 136, 75, 'e acc dash', 'a') + r(138, 62, 26, 26, 'fa dash', 4) +
  ln(176, 68, 262, 68, 'e thick', 'b') + t(219, 58, 'Transition', 's b bad') +
  r(270, 16, 170, 104, 'f2', 8) + t(355, 36, 'Slide 2', 's m') +
  t(92, 140, 'Animation = object moves', 's acc b') + t(355, 140, 'Transition = between slides', 's bad b'),
  'Animation versus transition: an animation moves an object inside a slide; a transition is the effect when changing from slide 1 to slide 2.', '');

/* ================= English ================= */
V['en-past'] = () => svg(440, 168,
  ln(10, 110, 426, 110, 'e', 'b') + t(412, 96, 'now', 's m') +
  circ(60, 110, 7, 'fw') + t(60, 64, 'had left a note', 'b s') + t(60, 80, 'past perfect', 's m') + t(60, 96, '(earlier)', 'xs m') +
  r(150, 103, 180, 14, 'fa', 7) + t(240, 72, 'was raining', 'b s') + t(240, 88, 'past continuous (background)', 'xs m') +
  circ(250, 110, 7, 'fs') + t(250, 140, 'opened the door', 'b s') + t(250, 156, 'past simple (main event)', 'xs m'),
  'A past timeline: earliest, a note had been left (past perfect); during a long background action, it was raining (past continuous), she opened the door (past simple, the main event).', '');
V['en-future'] = () => svg(440, 156,
  ln(10, 90, 426, 90, 'e', 'b') + ln(40, 80, 40, 100, 'e thick', false) + t(40, 118, 'now', 's m') +
  r(150, 83, 130, 14, 'fa', 7) + ln(215, 70, 215, 104, 'e dash', false) + t(215, 40, "I'll be studying", 'b s') + t(215, 58, 'at 8 pm tomorrow (in progress)', 'xs m') +
  r(300, 83, 64, 14, 'fok', 7) + ln(392, 56, 392, 108, 'e bad dash', false) + t(392, 48, 'by June', 's b bad') + t(338, 128, "I'll have finished", 'b s') + t(338, 146, 'done before June', 'xs m'),
  'A future timeline: future continuous (I will be studying) is an action in progress at a future moment; future perfect (I will have finished) is an action completed before a future deadline (by June).', '');
V['en-passive'] = () => svg(440, 172,
  t(220, 18, 'Active — who does it comes first', 's m') + box(20, 28, 120, 34, ['Factories'], 'fa', 'b s') + box(165, 28, 110, 34, ['make'], 'fw', 'b s') + box(300, 28, 120, 34, ['plastic.'], 'fok', 'b s') +
  t(220, 88, 'same colour = same word, new place', 'xs m') +
  box(20, 104, 120, 34, ['Plastic'], 'fok', 'b s') + box(165, 104, 110, 34, ['is made'], 'fw', 'b s') + box(300, 104, 120, 34, ['(by factories).'], 'fa dash', 's') +
  t(220, 162, 'Passive = be + past participle (V3); the “by …” part is optional', 's m'),
  'Active to passive: Factories make plastic becomes Plastic is made (by factories). The object moves to the front, the verb becomes be plus past participle, and the doer becomes optional.', '');
V['en-certainty'] = () => svg(440, 124,
  t(20, 22, '0% — sure it did NOT happen', 'xs m', 'start') + t(420, 22, 'sure it DID happen — 100%', 'xs m', 'end') +
  r(20, 32, 130, 18, 'fbad', 0) + r(150, 32, 140, 18, 'fw', 0) + r(290, 32, 130, 18, 'fok', 0) +
  t(85, 74, "can't have", 'b mono s') + t(220, 74, 'might / could have', 'b mono s') + t(355, 74, 'must have', 'b mono s') +
  t(85, 94, '+ V3', 'xs m') + t(220, 94, '+ V3', 'xs m') + t(355, 94, '+ V3', 'xs m') + t(220, 118, 'He can’t have / might have / must have missed the bus.', 's'),
  'A certainty scale for guessing about the past: can’t have plus past participle means almost sure it did not happen; might or could have means maybe; must have means almost sure it did happen.', '');
V['en-paragraph'] = () => svg(400, 232,
  r(40, 6, 320, 48, 'fa', 24) + t(200, 36, 'Topic sentence — your main point', 's b') +
  [['First, … (+ example)', 62], ['In addition, … (+ example)', 104], ['However, … (+ example)', 146]].map(([a, y]) => r(52, y, 296, 36, 'f2', 6) + t(200, y + 23, a, 's')).join('') +
  r(40, 188, 320, 40, 'fa', 20) + t(200, 213, 'Conclusion — In short, …', 's b'),
  'A paragraph is like a burger: a topic sentence on top, two or three supporting points with linkers and examples in the middle (First, In addition, However), and a concluding sentence at the bottom.', '');

/* ================= Turkish & Atatürk ================= */
V['tr-lego'] = () => {
  let s = ''; [['ev', 'house', 'fa'], ['ler', 'plural', 'fok'], ['im', 'my', 'fw'], ['de', 'in', 'f2']].forEach(([a, b, c], i) => { const x = 40 + i * 90; s += r(x, 20, 90, 46, c, i === 0 ? 8 : 2) + t(x + 45, 50, a, 'big') + t(x + 45, 88, b, 's m'); });
  return svg(440, 120, s + t(220, 114, 'evlerimde  =  in my houses', 'b'), 'Turkish builds words like Lego: ev (house) + ler (plural) + im (my) + de (in) = evlerimde, in my houses.', '');
};
V['tr-harmony'] = () => svg(440, 166,
  r(0, 0, 210, 164, 'fa', 10) + t(105, 28, 'a ı o u  (back)', 'b') + t(105, 54, '→  -lar,  -da', 'b acc') + tl(105, 86, ['okul → okul-lar', 'kitap → kitap-lar', 'okul → okul-da'], 'mono s', 'middle', 22) +
  r(230, 0, 210, 164, 'fok', 10) + t(335, 28, 'e i ö ü  (front)', 'b') + t(335, 54, '→  -ler,  -de', 'b ok') + tl(335, 86, ['ev → ev-ler', 'göz → göz-ler', 'ev → ev-de'], 'mono s', 'middle', 22),
  'Great vowel harmony: after back vowels a, ı, o, u the suffix uses back vowels (-lar, -da: okullar, kitaplar, okulda). After front vowels e, i, ö, ü it uses front vowels (-ler, -de: evler, gözler, evde).', '');
V['ata-phases'] = () => {
  let s = ln(0, 22, 432, 22, 'e thick', 'b');
  [['Reform', '1789–1913', 'fa', ['1839 Tanzimat', '1876 Constitution', '1912 Balkan Wars']], ['Defeat', '1914–1919', 'fbad', ['1915 Çanakkale', '1918 Mudros', '1919 İzmir']], ['Resistance', '1919–1920', 'fw', ['19 May Samsun', 'Congresses', '1920 TBMM']], ['Victory', '1921–1923', 'fok', ['1921 Sakarya', '1922 Offensive', '1923 Lausanne']]].forEach(([h, d, c, items], i) => {
    const x = i * 110; s += circ(x + 52, 22, 7, 'fs') + r(x, 40, 104, 150, c, 8) + t(x + 52, 62, h, 'b s') + t(x + 52, 80, d, 'xs m') + items.map((it, k) => t(x + 52, 108 + k * 26, it, 'xs')).join('');
  });
  return svg(440, 196, s, 'Four phases: Reform 1789 to 1913 (1839 Tanzimat, 1876 Constitution, 1912 Balkan Wars); Defeat 1914 to 1919 (1915 Çanakkale, 1918 Mudros, 1919 İzmir occupied); Resistance 1919 to 1920 (19 May 1919 Samsun, Erzurum and Sivas congresses, 23 April 1920 TBMM); Victory 1921 to 1923 (1921 Sakarya, 1922 Great Offensive, 1923 Lausanne).', '');
};

CC.viz = V;
CC.widgets.viz = (el, a) => {
  const f = V[a.name]; if (!f) throw new Error('unknown diagram ' + a.name);
  el.innerHTML = f();
  const fig = el.querySelector('figure');
  fig.insertAdjacentHTML('beforeend', '<div class="viz-hint" aria-hidden="true">tap to enlarge ⤢</div>');
  fig.setAttribute('tabindex', '0');
  const toggle = () => { if (window.innerWidth > 560) return; fig.classList.toggle('zoom'); const h = fig.querySelector('.viz-hint'); h.textContent = fig.classList.contains('zoom') ? 'swipe sideways · tap to shrink' : 'tap to enlarge ⤢'; };
  fig.addEventListener('click', toggle);
  fig.addEventListener('keydown', e => { if (e.key === 'Enter') toggle(); });
};
})();
