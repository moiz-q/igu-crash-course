/* Drills and calculators: subnetting, number bases, maths generators, spreadsheet formulas, small diagrams. */
(function () {
'use strict';
const { $, $$, esc } = CC; const W = CC.widgets; const tex = CC.tex;
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };

/* =============== networks: subnetting =============== */
const ip2n = s => { const p = String(s).trim().split('.'); if (p.length !== 4) return null; let n = 0; for (const x of p) { if (!/^\d{1,3}$/.test(x) || +x > 255) return null; n = n * 256 + +x; } return n; };
const n2ip = n => [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.');
const maskOf = p => p === 0 ? 0 : (0xFFFFFFFF * Math.pow(2, 32 - p)) % 4294967296;
function subnet(ip, p) {
  const size = Math.pow(2, 32 - p); const net = Math.floor(ip / size) * size; const bc = net + size - 1;
  return { net, bc, size, mask: maskOf(p), hosts: p >= 31 ? (p === 31 ? 2 : 1) : size - 2, first: p >= 31 ? net : net + 1, last: p >= 31 ? bc : bc - 1, prefix: p };
}
const bin8 = n => n.toString(2).padStart(8, '0');
const ipBits = (n, p) => { const b = n2ip(n).split('.').map(x => bin8(+x)).join(''); let out = ''; for (let i = 0; i < 32; i++) { if (i && i % 8 === 0) out += '.'; out += `<span class="${i < p ? 'net' : 'host'}">${b[i]}</span>`; } return out; };
const ipClass = n => { const a = Math.floor(n / 16777216); return a < 128 ? 'A' : a < 192 ? 'B' : a < 224 ? 'C' : a < 240 ? 'D (multicast)' : 'E (reserved)'; };
const isPrivate = n => { const a = Math.floor(n / 16777216), b = Math.floor(n / 65536) % 256; return a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168); };
CC.net = { ip2n, n2ip, maskOf, subnet };
function subnetSteps(ip, p) {
  const s = subnet(ip, p); const oi = Math.min(3, Math.floor((p - 1) / 8)); const mo = +n2ip(s.mask).split('.')[oi]; const block = 256 - mo; const io = +n2ip(ip).split('.')[oi]; const no = Math.floor(io / block) * block;
  const nth = ['first', 'second', 'third', 'fourth'][oi];
  return `<ol class="steps"><li>The prefix <b>/${p}</b> means ${p} network bits and ${32 - p} host bits. Subnet mask: <b>${n2ip(s.mask)}</b>.</li>
<li>The “interesting” octet is the ${nth} one (mask value ${mo}). Block size = 256 − ${mo} = <b>${block}</b>.</li>
<li>Networks start at multiples of ${block} in that octet: ${[0, 1, 2, 3].map(k => k * block).filter(v => v < 256).join(', ')}${block * 4 < 256 ? ', …' : ''}. The address has ${io} there; the largest multiple of ${block} that is ≤ ${io} is <b>${no}</b>. Network address: <b>${n2ip(s.net)}</b>.</li>
<li>The next network starts ${block} later, so the broadcast is one address before it: <b>${n2ip(s.bc)}</b>.</li>
<li>First host = network + 1 = <b>${n2ip(s.first)}</b>. Last host = broadcast − 1 = <b>${n2ip(s.last)}</b>.</li>
<li>Usable hosts = 2<sup>${32 - p}</sup> − 2 = ${s.size} − 2 = <b>${s.hosts}</b> (network and broadcast addresses cannot be given to devices).</li></ol>
<p class="bits">IP &nbsp;&nbsp;${ipBits(ip, p)}<br>Mask ${ipBits(s.mask, p)}</p><p class="muted small"><span class="bits"><span class="net">Blue/bold</span></span> = network bits, <span class="bits"><span class="host">red</span></span> = host bits.</p>`;
}
W.subnetcalc = (el) => {
  el.innerHTML = `<div class="panel"><div class="inline-fields"><div class="field"><label for="sc-ip">IP address</label><input id="sc-ip" type="text" inputmode="decimal" value="192.168.10.77" autocomplete="off"></div><div class="field"><label for="sc-p">Prefix (CIDR)</label><select id="sc-p">${Array.from({ length: 30 }, (x, i) => i + 1).map(p => `<option value="${p}"${p === 26 ? ' selected' : ''}>/${p} — ${n2ip(maskOf(p))}</option>`).join('')}</select></div><button type="button" class="btn primary">Calculate</button></div><div class="sc-out" aria-live="polite"></div></div>`;
  const go = () => {
    const ip = ip2n($('#sc-ip', el).value), p = +$('#sc-p', el).value; const out = $('.sc-out', el);
    if (ip === null) { out.innerHTML = '<p class="msg bad">That is not a valid IPv4 address. Use four numbers from 0 to 255, like 192.168.1.10.</p>'; return; }
    const s = subnet(ip, p);
    out.innerHTML = `<div class="tablewrap"><table><tbody><tr><th>Network address</th><td>${n2ip(s.net)}/${p}</td></tr><tr><th>Subnet mask</th><td>${n2ip(s.mask)}</td></tr><tr><th>Broadcast address</th><td>${n2ip(s.bc)}</td></tr><tr><th>First usable host</th><td>${n2ip(s.first)}</td></tr><tr><th>Last usable host</th><td>${n2ip(s.last)}</td></tr><tr><th>Usable hosts</th><td>${s.hosts.toLocaleString('en')}</td></tr><tr><th>Class / type</th><td>Class ${ipClass(ip)}${isPrivate(ip) ? ', private address' : ''}</td></tr></tbody></table></div><details class="reveal" open><summary>How to work it out by hand</summary><div class="reveal-b">${subnetSteps(ip, p)}</div></details>`;
  };
  el.addEventListener('click', e => { if (e.target.closest('button')) go(); }); el.addEventListener('change', go); go();
};
CC.subnetQuestion = function (mode) {
  if (mode === 'mask') { const p = ri(8, 30); return Math.random() < .5 ? { kind: 'mask', text: `Write the subnet mask for the prefix <b>/${p}</b>.`, fields: [['Subnet mask', n2ip(maskOf(p))]], steps: `<p>/${p} means the first ${p} bits of the mask are 1. ${Math.floor(p / 8)} full octet(s) of 255${p % 8 ? `, then an octet with ${p % 8} one-bit(s): ${bin8(256 - Math.pow(2, 8 - p % 8))} = ${256 - Math.pow(2, 8 - p % 8)}` : ''}, the rest 0. Mask: <b>${n2ip(maskOf(p))}</b>.</p>` } : { kind: 'mask', text: `Write the prefix length (CIDR) for the mask <b>${n2ip(maskOf(p))}</b>.`, fields: [['Prefix (number only)', String(p)]], steps: `<p>Count the 1-bits: each 255 is 8 bits. ${n2ip(maskOf(p)).split('.').map(o => o + ' = ' + bin8(+o)).join(', ')}. Total: <b>/${p}</b>.</p>` }; }
  if (mode === 'hosts') { const need = pick([2, 5, 10, 12, 25, 28, 50, 60, 100, 120, 200, 250, 500, 1000]); let h = 2; while (Math.pow(2, h) - 2 < need) h++; return { kind: 'hosts', text: `A department needs <b>${need}</b> usable host addresses. What is the smallest subnet that fits? Give the prefix and the number of usable hosts it provides.`, fields: [['Prefix (number only)', String(32 - h)], ['Usable hosts', String(Math.pow(2, h) - 2)]], steps: `<p>Find the smallest h where 2<sup>h</sup> − 2 ≥ ${need}. 2<sup>${h - 1}</sup> − 2 = ${Math.pow(2, h - 1) - 2} is too small; 2<sup>${h}</sup> − 2 = <b>${Math.pow(2, h) - 2}</b> fits. So ${h} host bits, and the prefix is 32 − ${h} = <b>/${32 - h}</b> (mask ${n2ip(maskOf(32 - h))}).</p>` }; }
  const p = mode === 'hard' ? ri(17, 23) : ri(24, 30);
  const first = pick([10, 172, 192, 192, 192, 10]); const ip = ip2n(first === 10 ? `10.${ri(0, 255)}.${ri(0, 255)}.${ri(1, 254)}` : first === 172 ? `172.${ri(16, 31)}.${ri(0, 255)}.${ri(1, 254)}` : `192.168.${ri(0, 255)}.${ri(1, 254)}`);
  const s = subnet(ip, p);
  return { kind: 'full', ip, p, text: `A host has the address <b>${n2ip(ip)}/${p}</b>. Find:`, fields: [['Subnet mask', n2ip(s.mask)], ['Network address', n2ip(s.net)], ['Broadcast address', n2ip(s.bc)], ['First usable host', n2ip(s.first)], ['Last usable host', n2ip(s.last)], ['Number of usable hosts', String(s.hosts)]], steps: subnetSteps(ip, p) };
};
W.subnetdrill = (el, a) => {
  let q = null, solved = 0, tried = 0;
  el.innerHTML = `<div class="panel"><div class="inline-fields"><div class="field"><label for="sd-m">Drill type</label><select id="sd-m"><option value="easy">Network, broadcast, hosts (/24 to /30)</option><option value="hard">Harder prefixes (/17 to /23)</option><option value="mask">CIDR ↔ subnet mask</option><option value="hosts">How big must the subnet be?</option></select></div><span class="badge" data-score>0 solved</span></div><div class="sd-q" aria-live="polite"></div></div>`;
  const draw = () => {
    q = CC.subnetQuestion($('#sd-m', el).value);
    $('.sd-q', el).innerHTML = `<p>${q.text}</p><div class="drill-grid">${q.fields.map((f, i) => `<div class="field"><label for="sd-f${i}">${f[0]}</label><input id="sd-f${i}" type="text" inputmode="decimal" autocomplete="off" data-i="${i}"></div>`).join('')}</div><div class="btn-row"><button type="button" class="btn primary" data-act="check">Check</button><button type="button" class="btn" data-act="steps">Show steps</button><button type="button" class="btn" data-act="new">New question</button><span role="status"></span></div><div class="sd-steps"></div>`;
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'new') { draw(); $('input', el).focus(); return; }
    if (b.dataset.act === 'steps') { $('.sd-steps', el).innerHTML = `<div class="callout callout-example"><div class="callout-h">Worked solution</div>${q.steps}<p><b>Answers:</b> ${q.fields.map(f => f[0] + ': ' + f[1]).join(' · ')}</p></div>`; return; }
    let ok = 0; $$('.drill-grid input', el).forEach(inp => { const exp = q.fields[+inp.dataset.i][1]; const r = inp.value.trim().replace(/^\//, '').replace(/[ ,]/g, '') === exp; inp.className = r ? 'right' : 'wrong'; if (r) ok++; });
    tried++; if (ok === q.fields.length && !q.done) { q.done = true; solved++; const S = CC.S(); if (a.save) { S.ex[a.save] = Date.now(); CC.save(); } }
    $('[role=status]', el).innerHTML = ok === q.fields.length ? '<b style="color:var(--ok)">✓ All correct!</b> Try a new one.' : ok + ' of ' + q.fields.length + ' correct. Fix the red ones or show the steps.';
    $('[data-score]', el).textContent = solved + ' solved';
  });
  el.addEventListener('change', e => { if (e.target.id === 'sd-m') draw(); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('.drill-grid input')) $('[data-act="check"]', el).click(); });
  draw();
};

/* =============== number bases =============== */
const DIG = '0123456789ABCDEF';
function baseSteps(str, from) {
  const s = str.toUpperCase(); const n = parseInt(s, from); let h = '';
  if (from !== 10) h += `<li>To decimal: multiply each digit by its place value (powers of ${from}): ${s.split('').map((d, i) => `${DIG.indexOf(d)}×${from}<sup>${s.length - 1 - i}</sup>`).join(' + ')} = <b>${n}</b>.</li>`;
  [2, 8, 16].filter(b => b !== from).forEach(b => { let x = n, parts = []; if (x === 0) parts.push('0 ÷ ' + b + ' = 0 r 0'); while (x > 0) { parts.push(`${x} ÷ ${b} = ${Math.floor(x / b)} r <b>${DIG[x % b]}</b>`); x = Math.floor(x / b); } h += `<li>To base ${b}: divide by ${b} again and again and keep the remainders: ${parts.join('; ')}. Read the remainders from last to first: <b>${n.toString(b).toUpperCase()}</b>.</li>`; });
  return '<ol class="steps">' + h + '</ol>';
}
W.baseconv = (el) => {
  el.innerHTML = `<div class="panel"><div class="inline-fields"><div class="field"><label for="bc-v">Number</label><input id="bc-v" type="text" value="172" autocomplete="off" autocapitalize="characters"></div><div class="field"><label for="bc-b">It is written in</label><select id="bc-b"><option value="10">Decimal (base 10)</option><option value="2">Binary (base 2)</option><option value="8">Octal (base 8)</option><option value="16">Hexadecimal (base 16)</option></select></div></div><div class="bc-out" aria-live="polite"></div></div>`;
  const go = () => {
    const v = $('#bc-v', el).value.trim().toUpperCase().replace(/\s+/g, ''), b = +$('#bc-b', el).value; const out = $('.bc-out', el);
    if (!v) { out.innerHTML = ''; return; }
    if (![...v].every(ch => DIG.indexOf(ch) >= 0 && DIG.indexOf(ch) < b) || v.length > 31) { out.innerHTML = `<p class="msg bad">“${esc(v)}” is not a valid base-${b} number. Base ${b} uses only the digits ${DIG.slice(0, b).split('').join(' ')}.</p>`; return; }
    const n = parseInt(v, b);
    out.innerHTML = `<div class="tablewrap"><table><tbody><tr><th>Decimal (10)</th><td class="bits">${n}</td></tr><tr><th>Binary (2)</th><td class="bits">${n.toString(2).replace(/\B(?=(\d{4})+(?!\d))/g, ' ')}</td></tr><tr><th>Octal (8)</th><td class="bits">${n.toString(8)}</td></tr><tr><th>Hexadecimal (16)</th><td class="bits">${n.toString(16).toUpperCase()}</td></tr></tbody></table></div><details class="reveal" open><summary>Steps</summary><div class="reveal-b">${baseSteps(v, b)}</div></details>`;
  };
  el.addEventListener('input', go); el.addEventListener('change', go); go();
};

/* =============== maths generators =============== */
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
const fTex = (n, d) => { [n, d] = frac(n, d); return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`; };
const fStr = (n, d) => { [n, d] = frac(n, d); return d === 1 ? String(n) : n + '/' + d; };
const sg = (n, first) => n < 0 ? '- ' + Math.abs(n) : (first ? '' : '+ ') + n;
const term = (c, v, first) => c === 0 ? '' : (c < 0 ? '- ' : first ? '' : '+ ') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v;
const primeFactors = n => { const f = {}; let d = 2; while (n > 1) { while (n % d === 0) { f[d] = (f[d] || 0) + 1; n /= d; } d++; if (d * d > n && n > 1) { f[n] = (f[n] || 0) + 1; break; } } return f; };
const pfTex = n => Object.entries(primeFactors(n)).map(([p, e]) => e > 1 ? `${p}^{${e}}` : p).join(' \\cdot ') || '1';
const nz = (a, b) => { let v = 0; while (v === 0) v = ri(a, b); return v; };
const G = {};
G.sets = () => {
  if (Math.random() < .5) { const i = ri(2, 8), a = i + ri(3, 12), b = i + ri(3, 12); return { topic: 'Sets', q: `${tex('n(A) = ' + a)}, ${tex('n(B) = ' + b)} and ${tex('n(A \\cap B) = ' + i)}. Find ${tex('n(A \\cup B)')}.`, kind: 'num', ans: a + b - i, steps: [`Use ${tex('n(A \\cup B) = n(A) + n(B) - n(A \\cap B)')}.`, `${tex(`${a} + ${b} - ${i} = ${a + b - i}`)}. We subtract the intersection because those elements were counted twice.`], meta: { t: 'union', a, b, i } }; }
  const n = ri(3, 7); return { topic: 'Sets', q: `A set has ${n} elements. How many subsets does it have?`, kind: 'num', ans: Math.pow(2, n), steps: [`Each element is either in a subset or not: 2 choices for each of the ${n} elements.`, `${tex(`2^{${n}} = ${Math.pow(2, n)}`)} subsets (this includes the empty set and the set itself).`], meta: { t: 'subsets', n } };
};
G.fractions = () => {
  const a = ri(1, 9), b = ri(2, 9), c = ri(1, 9), d = ri(2, 9), op = pick(['+', '-', '\\cdot', '\\div']);
  let n, m, how;
  if (op === '+') { n = a * d + c * b; m = b * d; how = `Common denominator ${b * d}: ${tex(`\\frac{${a * d}}{${b * d}} + \\frac{${c * b}}{${b * d}} = \\frac{${n}}{${m}}`)}.`; }
  else if (op === '-') { n = a * d - c * b; m = b * d; how = `Common denominator ${b * d}: ${tex(`\\frac{${a * d}}{${b * d}} - \\frac{${c * b}}{${b * d}} = \\frac{${n}}{${m}}`)}.`; }
  else if (op === '\\cdot') { n = a * c; m = b * d; how = `Multiply tops and bottoms: ${tex(`\\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${n}}{${m}}`)}.`; }
  else { n = a * d; m = b * c; how = `Dividing by a fraction = multiplying by its reciprocal: ${tex(`\\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${n}}{${m}}`)}.`; }
  return { topic: 'Rational numbers', q: `Calculate and simplify: ${tex(`\\frac{${a}}{${b}} ${op} \\frac{${c}}{${d}}`)}`, kind: 'num', ans: n / m, ansText: fStr(n, m), hint: 'Type a fraction like 7/12 or a whole number.', steps: [how, `Simplify by the GCD (${gcd(n, m) || 1}): ${tex(fTex(n, m))}.`], meta: { a, b, c, d, op } };
};
G.divisibility = () => {
  const d = pick([3, 4, 5, 8, 9, 11]), n = ri(1000, 99999); const ds = String(n).split('').map(Number); const sum = ds.reduce((x, y) => x + y, 0);
  const rule = { 3: `Add the digits: ${ds.join(' + ')} = ${sum}. The remainder of ${sum} ÷ 3 is ${sum % 3}, and the number has the same remainder.`, 9: `Add the digits: ${ds.join(' + ')} = ${sum}. The remainder of ${sum} ÷ 9 is ${sum % 9}, and the number has the same remainder.`, 4: `Only the last two digits matter: ${n % 100}. ${n % 100} ÷ 4 leaves remainder ${n % 4}.`, 8: `Only the last three digits matter: ${n % 1000}. ${n % 1000} ÷ 8 leaves remainder ${n % 8}.`, 5: `Only the last digit matters: ${n % 10}. ${n % 10} ÷ 5 leaves remainder ${n % 5}.`, 11: (() => { let alt = 0; ds.slice().reverse().forEach((x, i) => alt += i % 2 ? -x : x); return `From the right, add and subtract digits in turn: ${ds.slice().reverse().map((x, i) => (i ? (i % 2 ? '− ' : '+ ') : '') + x).join(' ')} = ${alt}. ${alt} mod 11 = ${((alt % 11) + 11) % 11}.`; })() }[d];
  return { topic: 'Divisibility', q: `What is the remainder when ${tex(String(n))} is divided by ${tex(String(d))}?`, kind: 'num', ans: n % d, steps: [rule, `Remainder: ${tex(String(n % d))}${n % d === 0 ? ` — so ${n} is divisible by ${d}.` : '.'}`], meta: { n, d } };
};
G.bases = () => {
  const b = pick([2, 2, 8, 16]); const n = b === 2 ? ri(5, 255) : ri(20, 4000);
  if (Math.random() < .5) return { topic: 'Number bases', q: `Convert ${tex(`(${n.toString(b).toUpperCase().replace(/[A-F]/g, m => '\\text{' + m + '}')})_{${b}}`)} to decimal (base 10).`, kind: 'num', ans: n, steps: [baseSteps(n.toString(b), b).replace(/<li>To base[\s\S]*$/, '</ol>')], meta: { n, b, dir: 'to10' } };
  return { topic: 'Number bases', q: `Convert the decimal number ${tex(String(n))} to base ${b}.`, kind: 'text', ans: [n.toString(b).toUpperCase()], steps: [(() => { let x = n, parts = []; while (x > 0) { parts.push(`${x} ÷ ${b} = ${Math.floor(x / b)} remainder <b>${DIG[x % b]}</b>`); x = Math.floor(x / b); } return 'Divide by ' + b + ' repeatedly: ' + parts.join('; ') + '.'; })(), `Read the remainders from the last one to the first: <b>${n.toString(b).toUpperCase()}</b>.`], meta: { n, b, dir: 'from10' } };
};
G.modular = () => {
  if (Math.random() < .5) { const m = ri(3, 12), a = ri(20, 200), b = ri(20, 200); return { topic: 'Modular arithmetic', q: `Find ${tex(`(${a} + ${b}) \\bmod ${m}`)}.`, kind: 'num', ans: (a + b) % m, steps: [`Reduce each number first: ${tex(`${a} \\bmod ${m} = ${a % m}`)} and ${tex(`${b} \\bmod ${m} = ${b % m}`)}.`, `${tex(`${a % m} + ${b % m} = ${a % m + b % m}`)}, and ${tex(`${a % m + b % m} \\bmod ${m} = ${(a + b) % m}`)}.`], meta: { t: 'add', a, b, m } }; }
  const m = pick([5, 7, 9, 10]), a = ri(2, 9), e = ri(5, 30); let r = 1; for (let i = 0; i < e; i++) r = r * a % m;
  const cyc = []; let x = a % m; do { cyc.push(x); x = x * a % m; } while (x !== cyc[0] && cyc.length < 12);
  return { topic: 'Modular arithmetic', q: `Find the remainder when ${tex(`${a}^{${e}}`)} is divided by ${tex(String(m))}.`, kind: 'num', ans: r, steps: [`Look at the remainders of the powers of ${a}: ${cyc.map((v, i) => tex(`${a}^{${i + 1}} \\equiv ${v}`)).join(', ')} … then they repeat.`, `The pattern has length ${cyc.length}${cyc[cyc.length - 1] === 0 ? ' and stays at 0' : ''}. Use the exponent ${e} to find the position in the pattern: the remainder is ${tex(String(r))}.`], meta: { t: 'pow', a, e, m } };
};
G.primes = () => {
  const t = pick(['div', 'zeros', 'fact']);
  if (t === 'div') { const n = pick([12, 18, 24, 36, 48, 60, 72, 84, 90, 96, 100, 108, 120, 144, 150, 180, 200, 210, 240, 360]); const f = primeFactors(n); const cnt = Object.values(f).reduce((x, e) => x * (e + 1), 1); return { topic: 'Primes and divisors', q: `How many positive divisors does ${tex(String(n))} have?`, kind: 'num', ans: cnt, steps: [`Prime factorization: ${tex(`${n} = ${pfTex(n)}`)}.`, `Add 1 to each exponent and multiply: ${tex(Object.values(f).map(e => `(${e}+1)`).join(' \\cdot ') + ' = ' + cnt)}.`], meta: { t, n } }; }
  if (t === 'zeros') { const n = ri(10, 130); let z = 0, parts = []; for (let p = 5; p <= n; p *= 5) { z += Math.floor(n / p); parts.push(`\\lfloor ${n}/${p} \\rfloor = ${Math.floor(n / p)}`); } return { topic: 'Factorials', q: `How many zeros are at the end of ${tex(n + '!')}?`, kind: 'num', ans: z, steps: ['Each zero at the end comes from a factor 10 = 2 × 5. There are plenty of 2s, so count the 5s.', `${tex(parts.join(',\\; '))}. Total: ${tex(String(z))} zeros.`], meta: { t, n } }; }
  const n = ri(5, 9), k = ri(2, 3); let v = 1; for (let i = n; i > n - k; i--) v *= i; return { topic: 'Factorials', q: `Calculate ${tex(`\\frac{${n}!}{${n - k}!}`)}.`, kind: 'num', ans: v, steps: [`Write the top as ${tex(`${n}! = ${Array.from({ length: k }, (x, i) => n - i).join(' \\cdot ')} \\cdot ${n - k}!`)} and cancel ${tex(`${n - k}!`)}.`, `${tex(Array.from({ length: k }, (x, i) => n - i).join(' \\cdot ') + ' = ' + v)}.`], meta: { t, n, k } };
};
G.gcdlcm = () => {
  const g = ri(2, 12), a = g * ri(2, 9), b = g * ri(2, 9); const gg = gcd(a, b), l = a * b / gg; const want = pick(['GCD', 'LCM']);
  let x = Math.max(a, b), y = Math.min(a, b), eu = []; while (y) { eu.push(`${x} = ${Math.floor(x / y)} \\cdot ${y} + ${x % y}`);[x, y] = [y, x % y]; }
  return { topic: 'GCD and LCM', q: `Find the ${want} of ${tex(String(a))} and ${tex(String(b))}.`, kind: 'num', ans: want === 'GCD' ? gg : l, steps: [`Prime factors: ${tex(`${a} = ${pfTex(a)}`)} and ${tex(`${b} = ${pfTex(b)}`)}.`, `GCD = common primes with the <b>smallest</b> exponents = ${tex(String(gg))}. (Euclid’s way: ${tex(eu.join(',\\; '))}; the last non-zero remainder is ${gg}.)`, `LCM = all primes with the <b>largest</b> exponents = ${tex(String(l))}. Check: ${tex(`\\text{GCD} \\cdot \\text{LCM} = ${gg} \\cdot ${l} = ${a} \\cdot ${b}`)}.`], meta: { a, b, want } };
};
G.exponents = () => {
  const t = pick(['mul', 'neg', 'eq', 'pow']);
  if (t === 'mul') { const b = pick([2, 3, 5]), m = ri(2, 6), n = ri(2, 6), k = ri(1, m + n - 1); return { topic: 'Exponents', q: `Simplify to a single number: ${tex(`\\frac{${b}^{${m}} \\cdot ${b}^{${n}}}{${b}^{${k}}}`)}`, kind: 'num', ans: Math.pow(b, m + n - k), steps: [`Same base: add exponents when multiplying, subtract when dividing: ${tex(`${b}^{${m}+${n}-${k}} = ${b}^{${m + n - k}}`)}.`, `${tex(`${b}^{${m + n - k}} = ${Math.pow(b, m + n - k)}`)}.`], meta: { t, b, m, n, k } }; }
  if (t === 'neg') { const b = pick([2, 3, 4, 5, 10]), n = ri(1, 3); return { topic: 'Exponents', q: `Write as a fraction: ${tex(`${b}^{-${n}}`)}`, kind: 'num', ans: 1 / Math.pow(b, n), ansText: '1/' + Math.pow(b, n), hint: 'Type a fraction like 1/8.', steps: [`A negative exponent means “one over”: ${tex(`a^{-n} = \\frac{1}{a^{n}}`)}.`, `${tex(`${b}^{-${n}} = \\frac{1}{${b}^{${n}}} = \\frac{1}{${Math.pow(b, n)}}`)}.`], meta: { t, b, n } }; }
  if (t === 'eq') { const b = pick([2, 3, 5]), x = ri(1, 4), c = ri(1, 3); return { topic: 'Exponents', q: `Solve for ${tex('x')}: ${tex(`${b}^{x+${c}} = ${Math.pow(b, x + c)}`)}`, kind: 'num', ans: x, steps: [`Write the right side as a power of ${b}: ${tex(`${Math.pow(b, x + c)} = ${b}^{${x + c}}`)}.`, `Same base, so the exponents are equal: ${tex(`x + ${c} = ${x + c}`)}, so ${tex('x = ' + x)}.`], meta: { t, b, x, c } }; }
  const b = pick([2, 3]), m = ri(2, 3), n = ri(2, 3); return { topic: 'Exponents', q: `Calculate: ${tex(`(${b}^{${m}})^{${n}}`)}`, kind: 'num', ans: Math.pow(b, m * n), steps: [`Power of a power: multiply the exponents: ${tex(`${b}^{${m} \\cdot ${n}} = ${b}^{${m * n}}`)}.`, `${tex(`${b}^{${m * n}} = ${Math.pow(b, m * n)}`)}.`], meta: { t, b, m, n } };
};
G.radicals = () => {
  const r = pick([2, 3, 5, 6, 7]);
  if (Math.random() < .5) { const k = ri(2, 9); return { topic: 'Radicals', q: `Simplify ${tex(`\\sqrt{${k * k * r}}`)}. Write it like 3√2.`, kind: 'text', ans: [k + '√' + r], hint: 'Type √ as sqrt if you like: 3sqrt2', steps: [`Find the largest square factor: ${tex(`${k * k * r} = ${k * k} \\cdot ${r}`)}.`, `${tex(`\\sqrt{${k * k} \\cdot ${r}} = \\sqrt{${k * k}} \\cdot \\sqrt{${r}} = ${k}\\sqrt{${r}}`)}.`], meta: { t: 'simp', k, r } }; }
  const a = ri(2, 6), b = ri(2, 6), s = pick([1, -1]); if (s < 0 && a === b) return G.radicals();
  const tot = a + s * b;
  return { topic: 'Radicals', q: `Simplify ${tex(`\\sqrt{${a * a * r}} ${s > 0 ? '+' : '-'} \\sqrt{${b * b * r}}`)}. Write it like 3√2.`, kind: 'text', ans: [(tot === 1 ? '' : tot === -1 ? '-' : tot) + '√' + r, tot + '√' + r], hint: 'Type √ as sqrt if you like: 3sqrt2', steps: [`Simplify each root: ${tex(`\\sqrt{${a * a * r}} = ${a}\\sqrt{${r}}`)} and ${tex(`\\sqrt{${b * b * r}} = ${b}\\sqrt{${r}}`)}.`, `Like roots add like like terms: ${tex(`${a}\\sqrt{${r}} ${s > 0 ? '+' : '-'} ${b}\\sqrt{${r}} = ${tot === 1 ? '' : tot === -1 ? '-' : tot}\\sqrt{${r}}`)}.`], meta: { t: 'add', a, b, r, s } };
};
const binom = (p) => p === 0 ? 'x' : `(x ${sg(p)})`.replace('(x + ', '(x+').replace('(x - ', '(x-');
G.factoring = () => {
  if (Math.random() < .3) { const a = ri(2, 12); return { topic: 'Factoring', q: `Factor: ${tex(`x^2 - ${a * a}`)}`, kind: 'text', ans: [`(x-${a})(x+${a})`, `(x+${a})(x-${a})`], hint: 'Type it like (x-3)(x+3).', steps: [`This is a difference of two squares: ${tex('a^2 - b^2 = (a-b)(a+b)')} with ${tex('a = x')}, ${tex('b = ' + a)}.`, `${tex(`x^2 - ${a * a} = (x-${a})(x+${a})`)}.`], meta: { t: 'dsq', a } }; }
  const p = nz(-9, 9), q = nz(-9, 9); const b = p + q, c = p * q;
  return { topic: 'Factoring', q: `Factor: ${tex(`x^2 ${term(b, 'x')} ${sg(c)}`.replace(/\s+/g, ' '))}`, kind: 'text', ans: p === q ? [`(x${p > 0 ? '+' : '-'}${Math.abs(p)})^2`, binom(p) + binom(q)] : [binom(p) + binom(q), binom(q) + binom(p)], hint: 'Type it like (x+2)(x-5).', steps: [`Find two numbers whose product is ${tex(String(c))} and whose sum is ${tex(String(b))}.`, `They are ${tex(String(p))} and ${tex(String(q))}: ${tex(`${p} \\cdot ${q < 0 ? '(' + q + ')' : q} = ${c}`)} and ${tex(`${p} + ${q < 0 ? '(' + q + ')' : q} = ${b}`)}.`, `So ${tex(`x^2 ${term(b, 'x')} ${sg(c)} = ${binom(p)}${binom(q)}`)}.`], meta: { t: 'tri', p, q } };
};
G.linear = () => {
  if (Math.random() < .6) { const x = nz(-9, 9), a = nz(2, 9), c = nz(-5, 5) || 1; if (a === c) return G.linear(); const b = nz(-12, 12), d = (a - c) * x + b; return { topic: 'First-degree equations', q: `Solve: ${tex(`${term(a, 'x', true)} ${sg(b)} = ${term(c, 'x', true)} ${sg(d)}`)}`, kind: 'num', ans: x, steps: [`Collect the x terms on the left and the numbers on the right: ${tex(`${a}x ${sg(-c)}x = ${d} ${sg(-b)}`)}.`, `${tex(`${a - c}x = ${d - b}`)}.`, `Divide by ${tex(String(a - c))}: ${tex('x = ' + x)}.`], meta: { t: 'one', a, b, c, d } }; }
  const x = ri(-5, 8), y = ri(-5, 8), a = ri(1, 4), b = ri(1, 4);
  return { topic: 'First-degree equations', q: `Solve the system: ${tex(`\\begin{cases} ${term(a, 'x', true)} + ${term(b, 'y', true)} = ${a * x + b * y} \\\\ ${term(a, 'x', true)} - ${term(b, 'y', true)} = ${a * x - b * y} \\end{cases}`)} Type x and y separated by a comma.`, kind: 'list', ans: [x, y], hint: 'Example: 3, -2', steps: [`Add the two equations — the y terms cancel: ${tex(`${2 * a}x = ${2 * a * x}`)}, so ${tex('x = ' + x)}.`, `Put x back into the first equation: ${tex(`${a * x} + ${term(b, 'y', true)} = ${a * x + b * y}`)}, so ${tex(`${term(b, 'y', true)} = ${b * y}`)} and ${tex('y = ' + y)}.`], meta: { t: 'two', a, b, x, y } };
};
G.quadratic = () => {
  const p = nz(-8, 8), q = nz(-8, 8); const b = -(p + q), c = p * q; const eq = `x^2 ${term(b, 'x')} ${sg(c)} = 0`.replace(/\s+/g, ' ');
  if (Math.random() < .25) { const D = b * b - 4 * c; return { topic: 'Second-degree equations', q: `What is the discriminant ${tex('\\Delta')} of ${tex(eq)}?`, kind: 'num', ans: D, steps: [`${tex('\\Delta = b^2 - 4ac')} with ${tex(`a = 1,\\; b = ${b},\\; c = ${c}`)}.`, `${tex(`\\Delta = (${b})^2 - 4 \\cdot 1 \\cdot (${c}) = ${b * b} ${sg(-4 * c)} = ${D}`)}. ${D > 0 ? 'Positive, so there are two different real roots.' : D === 0 ? 'Zero, so there is one repeated root.' : 'Negative, so no real roots.'}`], meta: { t: 'disc', b, c } }; }
  return { topic: 'Second-degree equations', q: `Solve: ${tex(eq)}. Type the root(s) separated by a comma.`, kind: 'set', ans: p === q ? [p] : [p, q], hint: 'Example: -2, 5', steps: [`Factor: find two numbers with product ${tex(String(c))} and sum ${tex(String(b))}: ${tex(String(-p))} and ${tex(String(-q))}.`, `${tex(`${binom(-p)}${binom(-q)} = 0`)}, so ${tex('x = ' + p)}${p === q ? ' (a repeated root)' : ' or ' + tex('x = ' + q)}.`, `Check with the formula: ${tex(`x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${-b} \\pm \\sqrt{${b * b - 4 * c}}}{2}`)}. Sum of roots ${tex(`= -b/a = ${-b}`)}, product ${tex(`= c/a = ${c}`)}.`], meta: { t: 'roots', b, c, p, q } };
};
G.inequalities = () => {
  const a = nz(-6, 6), x0 = ri(-8, 8), b = ri(-10, 10), c = a * x0 + b; const op = pick(['<', '>', '\\le', '\\ge']); const flip = { '<': '>', '>': '<', '\\le': '\\ge', '\\ge': '\\le' }; const res = a < 0 ? flip[op] : op; const txt = { '<': '<', '>': '>', '\\le': '<=', '\\ge': '>=' };
  return { topic: 'Inequalities', q: `Solve: ${tex(`${term(a, 'x', true)} ${sg(b)} ${op} ${c}`)}. Type your answer like x > 3 or x <= -2.`, kind: 'text', ans: ['x' + txt[res] + x0], hint: 'Use <= and >= for ≤ and ≥.', steps: [`Move ${tex(String(b))} to the other side: ${tex(`${term(a, 'x', true)} ${op} ${c - b}`)}.`, `Divide by ${tex(String(a))}${a < 0 ? ' — it is <b>negative</b>, so the inequality sign flips' : ''}: ${tex(`x ${res} ${x0}`)}.`, `Interval notation: ${tex(res === '<' ? `(-\\infty, ${x0})` : res === '\\le' ? `(-\\infty, ${x0}]` : res === '>' ? `(${x0}, \\infty)` : `[${x0}, \\infty)`)}.`], meta: { a, b, c, op } };
};
G.absolute = () => {
  const a = ri(-9, 9), b = ri(1, 9);
  if (Math.random() < .5) return { topic: 'Absolute value', q: `Solve: ${tex(`|x ${sg(-a)}| = ${b}`.replace('x + 0', 'x').replace('x - 0', 'x'))}. Type the solutions separated by a comma.`, kind: 'set', ans: [a - b, a + b], hint: 'Example: -2, 8', steps: [`${tex('|A| = b')} means ${tex('A = b')} or ${tex('A = -b')}.`, `${tex(`x ${sg(-a)} = ${b}`)} gives ${tex('x = ' + (a + b))}; ${tex(`x ${sg(-a)} = -${b}`)} gives ${tex('x = ' + (a - b))}.`, `On the number line: the two points at distance ${b} from ${a}.`], meta: { t: 'eq', a, b } };
  const strict = Math.random() < .5; const cnt = strict ? 2 * b - 1 : 2 * b + 1;
  return { topic: 'Absolute value', q: `How many integers satisfy ${tex(`|x ${sg(-a)}| ${strict ? '<' : '\\le'} ${b}`.replace('x + 0', 'x').replace('x - 0', 'x'))}?`, kind: 'num', ans: cnt, steps: [`${tex(`|A| ${strict ? '<' : '\\le'} b`)} means ${tex(`-b ${strict ? '<' : '\\le'} A ${strict ? '<' : '\\le'} b`)}.`, `${tex(`-${b} ${strict ? '<' : '\\le'} x ${sg(-a)} ${strict ? '<' : '\\le'} ${b}`)}, so ${tex(`${a - b} ${strict ? '<' : '\\le'} x ${strict ? '<' : '\\le'} ${a + b}`)}.`, `Integers from ${strict ? a - b + 1 : a - b} to ${strict ? a + b - 1 : a + b}: ${tex(String(cnt))} of them.`], meta: { t: 'ineq', a, b, strict } };
};
G.ratio = () => {
  const t = pick(['inc', 'dec', 'of', 'profit', 'direct', 'inverse', 'share']);
  if (t === 'inc' || t === 'dec') { const base = pick([40, 50, 60, 80, 120, 150, 200, 250, 400]), p = pick([5, 10, 15, 20, 25, 30, 40, 50]); const v = t === 'inc' ? base * (100 + p) / 100 : base * (100 - p) / 100; return { topic: 'Percentages', q: `A price of ${base} TL is ${t === 'inc' ? 'increased' : 'reduced'} by ${p}%. What is the new price?`, kind: 'num', ans: v, steps: [`${p}% of ${base} = ${tex(`${base} \\cdot \\frac{${p}}{100} = ${base * p / 100}`)}.`, `${t === 'inc' ? 'Add' : 'Subtract'} it: ${tex(`${base} ${t === 'inc' ? '+' : '-'} ${base * p / 100} = ${v}`)}. (Shortcut: multiply by ${tex(String((t === 'inc' ? 100 + p : 100 - p) / 100))}.)`], meta: { t, base, p } }; }
  if (t === 'of') { const b = pick([20, 25, 40, 50, 80, 200]), part = b * pick([1, 2, 3, 4]) / pick([4, 5, 10]); if (part !== Math.floor(part)) return G.ratio(); return { topic: 'Percentages', q: `${part} is what percent of ${b}?`, kind: 'num', ans: 100 * part / b, steps: [`${tex(`\\frac{${part}}{${b}} \\cdot 100 = ${100 * part / b}`)}%.`], meta: { t, part, b } }; }
  if (t === 'profit') { const cost = pick([80, 120, 150, 200, 250, 400, 500]), p = pick([10, 20, 25, 30, 40]); const loss = Math.random() < .4; const sell = cost * (100 + (loss ? -p : p)) / 100; return { topic: 'Profit and loss', q: `A shop buys a product for ${cost} TL and sells it for ${sell} TL. What is the ${loss ? 'loss' : 'profit'} as a percentage of the cost?`, kind: 'num', ans: p, steps: [`${loss ? 'Loss' : 'Profit'} = ${tex(`${Math.max(sell, cost)} - ${Math.min(sell, cost)} = ${Math.abs(sell - cost)}`)} TL.`, `Percent of the <b>cost</b>: ${tex(`\\frac{${Math.abs(sell - cost)}}{${cost}} \\cdot 100 = ${p}`)}%.`], meta: { t, cost, sell } }; }
  if (t === 'direct') { const a = ri(2, 9), k = ri(2, 12), c = ri(2, 12); if (c === a) return G.ratio(); return { topic: 'Direct proportion', q: `${a} notebooks cost ${a * k} TL. How much do ${c} notebooks cost (same price each)?`, kind: 'num', ans: c * k, steps: [`Direct proportion: more notebooks → more money, and the ratio stays the same. One notebook costs ${tex(`${a * k} \\div ${a} = ${k}`)} TL.`, `${tex(`${c} \\cdot ${k} = ${c * k}`)} TL.`], meta: { t, a, k, c } }; }
  if (t === 'inverse') { const w = pick([2, 3, 4, 6]), d = pick([6, 12, 18, 24]), w2 = pick([2, 3, 4, 6, 9, 12].filter(v => v !== w && (w * d) % v === 0)); return { topic: 'Inverse proportion', q: `${w} workers finish a job in ${d} days. How many days do ${w2} workers need (same speed)?`, kind: 'num', ans: w * d / w2, steps: [`Inverse proportion: more workers → fewer days, and workers × days stays the same. Total work = ${tex(`${w} \\cdot ${d} = ${w * d}`)} worker-days.`, `${tex(`${w * d} \\div ${w2} = ${w * d / w2}`)} days.`], meta: { t, w, d, w2 } }; }
  const a = ri(1, 5), b = ri(1, 5), u = ri(5, 30); if (a === b) return G.ratio(); return { topic: 'Ratio', q: `Two friends share ${(a + b) * u} TL in the ratio ${a} : ${b}. How much does the first friend get?`, kind: 'num', ans: a * u, steps: [`The ratio has ${tex(`${a} + ${b} = ${a + b}`)} equal parts. One part = ${tex(`${(a + b) * u} \\div ${a + b} = ${u}`)} TL.`, `The first friend gets ${a} parts: ${tex(`${a} \\cdot ${u} = ${a * u}`)} TL.`], meta: { t, a, b, u } };
};
CC.mathgen = G;
const TOPICS = [['sets', 'Sets'], ['fractions', 'Rational numbers (fractions)'], ['divisibility', 'Divisibility and remainders'], ['bases', 'Number bases'], ['modular', 'Modular arithmetic'], ['primes', 'Divisors and factorials'], ['gcdlcm', 'GCD and LCM'], ['exponents', 'Exponents'], ['radicals', 'Radicals'], ['factoring', 'Factoring'], ['linear', 'First-degree equations'], ['quadratic', 'Second-degree equations'], ['inequalities', 'Inequalities'], ['absolute', 'Absolute value'], ['ratio', 'Ratio, proportion, percentages']];
CC.mathTopics = TOPICS;
const parseNum = s => { s = String(s).trim().replace(/−/g, '-').replace(/,(\d)/g, '.$1').replace(/\s|%|tl$/gi, ''); let m = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(s); if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2]; return /^-?\d+(\.\d+)?$/.test(s) ? +s : NaN; };
const normT = s => String(s).toLowerCase().replace(/\s+/g, '').replace(/−/g, '-').replace(/\*/g, '').replace(/sqrt\(?(\d+)\)?/g, '√$1').replace(/≥|=>/g, '>=').replace(/≤|=</g, '<=').replace(/²|\^2/g, '^2');
CC.mathCheck = function (q, input) {
  if (q.kind === 'num') { const v = parseNum(input); return !isNaN(v) && Math.abs(v - q.ans) < 1e-6; }
  if (q.kind === 'text') return q.ans.some(a => normT(a) === normT(input));
  const parts = String(input).replace(/−/g, '-').split(/\s*(?:,|;|\bor\b|\band\b|\bve\b)\s*|\s+(?=-?\d)/i).map(s => s.replace(/^[xy]\s*=\s*/i, '')).filter(s => s.trim() !== '').map(parseNum);
  if (parts.some(isNaN) || parts.length !== q.ans.length) return false;
  if (q.kind === 'list') return parts.every((v, i) => Math.abs(v - q.ans[i]) < 1e-6);
  const a = parts.slice().sort((x, y) => x - y), b = q.ans.slice().sort((x, y) => x - y); return a.every((v, i) => Math.abs(v - b[i]) < 1e-6);
};
const ansText = q => q.ansText || (q.kind === 'num' ? String(Math.round(q.ans * 1e6) / 1e6) : q.kind === 'text' ? q.ans[0] : q.ans.join(', '));
W.mathdrill = (el, a) => {
  const fixed = a.topic && G[a.topic] ? a.topic : null; let q = null, right = 0, tried = 0;
  el.innerHTML = `<div class="panel">${fixed ? '' : `<div class="field"><label for="md-t">Topic</label><select id="md-t">${TOPICS.map(t => `<option value="${t[0]}">${t[1]}</option>`).join('')}<option value="mix">Mixed (all topics)</option></select></div>`}<div class="md-q" aria-live="polite"></div><span class="badge" data-score>0 correct</span></div>`;
  const draw = async () => {
    let t = fixed || $('#md-t', el).value; if (t === 'mix') t = pick(TOPICS)[0]; q = G[t]();
    $('.md-q', el).innerHTML = `<p class="q-n">${esc(q.topic)}</p><p style="font-size:1.1rem">${q.q}</p><div class="inline-fields"><div class="field"><label for="md-a">Your answer</label><input id="md-a" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"></div><button type="button" class="btn primary" data-act="check">Check</button></div>${q.hint ? `<p class="muted small">${esc(q.hint)}</p>` : ''}<div class="md-fb" role="status"></div><div class="btn-row"><button type="button" class="btn" data-act="steps">Show full solution</button><button type="button" class="btn" data-act="new">New question</button></div><div class="md-steps"></div>`;
    await CC.enhance(el);
  };
  const showSteps = async () => { $('.md-steps', el).innerHTML = `<div class="callout callout-example"><div class="callout-h">Step-by-step solution</div><ol class="steps">${q.steps.map(s => /^<ol/.test(s) ? '</ol>' + s + '<ol class="steps">' : '<li>' + s + '</li>').join('')}</ol><p><b>Answer:</b> ${esc(ansText(q))}</p></div>`.replace(/<ol class="steps"><\/ol>/g, ''); await CC.enhance(el); };
  el.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'new') { await draw(); $('#md-a', el).focus(); }
    else if (b.dataset.act === 'steps') showSteps();
    else { const ok = CC.mathCheck(q, $('#md-a', el).value); if (!q.tried) { q.tried = true; tried++; if (ok) right++; } $('#md-a', el).className = ok ? 'right' : 'wrong'; $('.md-fb', el).innerHTML = ok ? '<div class="msg ok"><b>✓ Correct!</b></div>' : '<div class="msg bad"><b>Not yet.</b> Check your working, or open the full solution.</div>'; $('[data-score]', el).textContent = right + ' of ' + tried + ' correct on the first try'; if (ok && a.save) { CC.S().ex[a.save] = Date.now(); CC.save(); } }
  });
  el.addEventListener('change', e => { if (e.target.id === 'md-t') draw(); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'md-a') $('[data-act="check"]', el).click(); });
  return draw();
};

/* =============== spreadsheet formula sandbox =============== */
function sheetEngine(cells, nCols, nRows) {
  const cache = {}; const visiting = new Set();
  const colN = c => c.charCodeAt(0) - 65;
  const inGrid = ref => { const m = /^([A-Z])(\d+)$/.exec(ref); return m && colN(m[1]) < nCols && +m[2] >= 1 && +m[2] <= nRows; };
  function value(ref) {
    if (!inGrid(ref)) throw '#REF!';
    if (ref in cache) { if (typeof cache[ref] === 'string' && cache[ref][0] === '#' && /^#(DIV\/0!|VALUE!|REF!|NAME\?|NUM!|ERROR!)$/.test(cache[ref])) throw cache[ref]; return cache[ref]; }
    const raw = (cells[ref] || '').trim(); let v;
    if (raw === '') v = null;
    else if (raw[0] === '=') { if (visiting.has(ref)) throw '#REF!'; visiting.add(ref); try { v = evalFormula(raw.slice(1)); } catch (e) { visiting.delete(ref); cache[ref] = typeof e === 'string' ? e : '#ERROR!'; throw cache[ref]; } visiting.delete(ref); }
    else if (/^-?\d+([.,]\d+)?%?$/.test(raw)) v = parseFloat(raw.replace(',', '.')) / (raw.endsWith('%') ? 100 : 1);
    else v = raw;
    cache[ref] = v; return v;
  }
  function evalFormula(src) {
    const toks = []; const re = /\s*(?:(\d+(?:\.\d+)?)|"([^"]*)"|(\$?[A-Za-z]\$?\d+(?::\$?[A-Za-z]\$?\d+)?)|([A-Za-z_][A-Za-z0-9_.]*)|(<=|>=|<>|[-+*\/^&=<>(),;%:]))/y; let m, pos = 0;
    while (pos < src.length) { re.lastIndex = pos; m = re.exec(src); if (!m) { if (/^\s*$/.test(src.slice(pos))) break; throw '#NAME?'; } pos = re.lastIndex; if (m[1] !== undefined) toks.push({ t: 'n', v: +m[1] }); else if (m[2] !== undefined) toks.push({ t: 's', v: m[2] }); else if (m[3]) toks.push({ t: 'r', v: m[3].toUpperCase().replace(/\$/g, '') }); else if (m[4]) toks.push({ t: 'f', v: m[4].toUpperCase() }); else toks.push({ t: 'o', v: m[5] }); }
    let p = 0; const peek = () => toks[p], isO = v => toks[p] && toks[p].t === 'o' && toks[p].v === v;
    const num = v => { if (v === null) return 0; if (typeof v === 'number') return v; if (typeof v === 'boolean') return v ? 1 : 0; if (Array.isArray(v)) throw '#VALUE!'; const n = Number(v); if (v === '' || isNaN(n)) throw '#VALUE!'; return n; };
    const range = r => { const [a, b] = r.split(':'); const c1 = colN(a[0]), r1 = +a.slice(1), c2 = colN(b[0]), r2 = +b.slice(1); const out = []; for (let rr = Math.min(r1, r2); rr <= Math.max(r1, r2); rr++) for (let cc = Math.min(c1, c2); cc <= Math.max(c1, c2); cc++) out.push(value(String.fromCharCode(65 + cc) + rr)); return out; };
    const flat = args => [].concat(...args.map(a => Array.isArray(a) ? a : [a]));
    const nums = args => flat(args).filter(v => typeof v === 'number');
    const FN = {
      SUM: a => nums(a).reduce((x, y) => x + y, 0), AVERAGE: a => { const n = nums(a); if (!n.length) throw '#DIV/0!'; return n.reduce((x, y) => x + y, 0) / n.length; },
      MIN: a => { const n = nums(a); return n.length ? Math.min(...n) : 0; }, MAX: a => { const n = nums(a); return n.length ? Math.max(...n) : 0; },
      COUNT: a => nums(a).length, COUNTA: a => flat(a).filter(v => v !== null && v !== '').length,
      IF: a => { if (a.length < 2) throw '#VALUE!'; const c = a[0]; const t = typeof c === 'boolean' ? c : num(c) !== 0; return t ? a[1] : (a.length > 2 ? a[2] : false); },
      ROUND: a => { if (a.length < 2) throw '#VALUE!'; const f = Math.pow(10, num(a[1])); const x = num(a[0]); return Math.sign(x) * Math.round(Math.abs(x) * f + 1e-9) / f; },
      ABS: a => Math.abs(num(a[0])), COUNTIF: a => { const crit = String(a[1]); const m = /^(<=|>=|<>|<|>|=)?(.*)$/.exec(crit); const op = m[1] || '=', rv = m[2]; const n = Number(rv); return flat([a[0]]).filter(v => { if (v === null) return false; if (!isNaN(n) && rv !== '' && typeof v === 'number') return op === '=' ? v === n : op === '<>' ? v !== n : op === '<' ? v < n : op === '>' ? v > n : op === '<=' ? v <= n : v >= n; return op === '=' ? String(v).toLowerCase() === rv.toLowerCase() : op === '<>' ? String(v).toLowerCase() !== rv.toLowerCase() : false; }).length; }
    };
    FN.TOPLA = FN.SUM; FN.ORTALAMA = FN.AVERAGE; FN.EĞER = FN.IF;
    function primary() {
      const t = toks[p++]; if (!t) throw '#ERROR!';
      if (t.t === 'n' || t.t === 's') return t.v;
      if (t.t === 'r') { if (t.v.includes(':')) return range(t.v); return value(t.v); }
      if (t.t === 'f') { if (t.v === 'TRUE') return true; if (t.v === 'FALSE') return false; if (!isO('(')) throw '#NAME?'; p++; const args = []; if (!isO(')')) { for (;;) { args.push(cmp()); if (isO(',') || isO(';')) { p++; continue; } break; } } if (!isO(')')) throw '#ERROR!'; p++; if (!FN[t.v]) throw '#NAME?'; return FN[t.v](args); }
      if (t.t === 'o' && t.v === '(') { const v = cmp(); if (!isO(')')) throw '#ERROR!'; p++; return v; }
      if (t.t === 'o' && t.v === '-') return -num(unary());
      if (t.t === 'o' && t.v === '+') return num(unary());
      throw '#ERROR!';
    }
    function unary() { let v = primary(); while (isO('%')) { p++; v = num(v) / 100; } return v; }
    function pow() { let v = unary(); while (isO('^')) { p++; v = Math.pow(num(v), num(unary())); } return v; }
    function mul() { let v = pow(); while (isO('*') || isO('/')) { const o = toks[p++].v; const r = num(pow()); if (o === '/') { if (r === 0) throw '#DIV/0!'; v = num(v) / r; } else v = num(v) * r; } return v; }
    function add() { let v = mul(); while (isO('+') || isO('-')) { const o = toks[p++].v; const r = num(mul()); v = o === '+' ? num(v) + r : num(v) - r; } return v; }
    function cat() { let v = add(); while (isO('&')) { p++; const r = add(); v = String(v === null ? '' : v) + String(r === null ? '' : r); } return v; }
    function cmp() { let v = cat(); while (toks[p] && toks[p].t === 'o' && ['=', '<>', '<', '>', '<=', '>='].includes(toks[p].v)) { const o = toks[p++].v; let r = cat(); let a = v === null ? 0 : v, b = r === null ? 0 : r; if (typeof a === 'string' && typeof b === 'string') { a = a.toLowerCase(); b = b.toLowerCase(); } v = o === '=' ? a === b : o === '<>' ? a !== b : o === '<' ? a < b : o === '>' ? a > b : o === '<=' ? a <= b : a >= b; } return v; }
    const v = cmp(); if (p < toks.length) throw '#ERROR!'; if (Array.isArray(v)) throw '#VALUE!'; return v;
  }
  return { value: ref => { try { return value(ref); } catch (e) { return typeof e === 'string' ? e : '#ERROR!'; } }, evalIn: f => { try { return evalFormula(f.replace(/^=/, '')); } catch (e) { return typeof e === 'string' ? e : '#ERROR!'; } } };
}
CC.sheetEngine = sheetEngine;
const showVal = v => v === null ? '' : typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : typeof v === 'number' ? String(Math.round(v * 1e6) / 1e6) : String(v);
W.formula = (el, a, ctx) => {
  const d = ctx.course.extra.formula; const cells = Object.assign({}, d.cells); const S = CC.S();
  const cols = Array.from({ length: d.cols }, (x, i) => String.fromCharCode(65 + i));
  el.innerHTML = `<div class="panel"><p class="muted small">Click a cell and type. Formulas start with <code>=</code>. You can use <code>,</code> or <code>;</code> between arguments (Excel in Turkish uses <code>;</code>). Blue cells are where the tasks ask you to write.</p><div class="tablewrap"><table class="sheet"><thead><tr><th></th>${cols.map(c => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: d.rows }, (x, r) => `<tr><th scope="row">${r + 1}</th>${cols.map(c => `<td data-ref="${c}${r + 1}"><input type="text" aria-label="Cell ${c}${r + 1}" data-ref="${c}${r + 1}" autocomplete="off" autocapitalize="off" spellcheck="false"></td>`).join('')}</tr>`).join('')}</tbody></table></div><ol class="list sheet-tasks">${d.tasks.map((t, i) => `<li class="row" data-t="${i}"><span class="tick" aria-hidden="true">✓</span><span class="grow"><b>Cell ${t.cell}:</b> ${t.prompt}<small class="fb"></small></span></li>`).join('')}</ol><div class="btn-row"><button type="button" class="btn primary" data-act="check">Check my formulas</button><button type="button" class="btn" data-act="reset">Reset sheet</button><span role="status"></span></div></div>`;
  d.tasks.forEach(t => $(`td[data-ref="${t.cell}"]`, el).classList.add('target'));
  const redraw = () => { const eng = sheetEngine(cells, d.cols, d.rows); $$('input[data-ref]', el).forEach(inp => { if (document.activeElement === inp) return; const v = eng.value(inp.dataset.ref); inp.value = showVal(v); inp.classList.toggle('err', typeof v === 'string' && v[0] === '#'); inp.style.textAlign = typeof v === 'number' ? 'right' : ''; }); };
  el.addEventListener('focusin', e => { const r = e.target.dataset && e.target.dataset.ref; if (r && e.target.tagName === 'INPUT') { e.target.value = cells[r] || ''; e.target.style.textAlign = ''; } });
  el.addEventListener('focusout', e => { const r = e.target.dataset && e.target.dataset.ref; if (r && e.target.tagName === 'INPUT') { cells[r] = e.target.value; setTimeout(redraw, 0); } });
  el.addEventListener('keydown', e => { const r = e.target.dataset && e.target.dataset.ref; if (!r || e.target.tagName !== 'INPUT') return; if (e.key === 'Enter') { e.preventDefault(); const nx = $(`input[data-ref="${r[0]}${+r.slice(1) + 1}"]`, el); if (nx) nx.focus(); else e.target.blur(); } });
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'reset') { Object.keys(cells).forEach(k => delete cells[k]); Object.assign(cells, d.cells); $$('.sheet-tasks .tick', el).forEach(t => t.classList.remove('done')); $$('.sheet-tasks .fb', el).forEach(t => t.textContent = ''); redraw(); return; }
    const eng = sheetEngine(cells, d.cols, d.rows); let ok = 0;
    d.tasks.forEach((t, i) => {
      const raw = (cells[t.cell] || '').trim(); const row = $(`[data-t="${i}"]`, el); let msg = '';
      const want = eng.evalIn(t.model), got = eng.value(t.cell);
      if (!raw) msg = 'Empty — write a formula here.';
      else if (raw[0] !== '=') msg = 'Type a formula (start with =), not the number itself.';
      else if (typeof got === 'string' && got[0] === '#') msg = 'The cell shows ' + got + ({ '#NAME?': ' — a function name is misspelled.', '#DIV/0!': ' — something is divided by zero or an empty cell.', '#VALUE!': ' — text is used where a number is needed.', '#REF!': ' — a cell reference is invalid or refers to itself.' }[got] || ' — check brackets and commas.');
      else if (t.must && !t.must.split('|').some(f => raw.toUpperCase().includes(f))) msg = 'Use the ' + t.must.split('|')[0] + ' function for this task.';
      else if (!(typeof want === 'number' && typeof got === 'number' ? Math.abs(want - got) < 1e-6 : want === got)) msg = 'The result is ' + showVal(got) + ', but it should be ' + showVal(want) + '.';
      $('.tick', row).classList.toggle('done', !msg); $('.fb', row).textContent = msg; if (!msg) ok++;
    });
    $('[role=status]', el).textContent = ok + ' of ' + d.tasks.length + ' tasks correct'; if (ok === d.tasks.length && a.save) { S.ex[a.save] = Date.now(); CC.save(); }
    redraw();
  });
  redraw();
};

/* =============== small diagrams =============== */
W.topology = (el, a) => {
  const t = a.type; const N = (x, y, l) => `<circle class="n acc" cx="${x}" cy="${y}" r="15"/><text text-anchor="middle" x="${x}" y="${y + 4}">${l || 'PC'}</text>`; const L = (x1, y1, x2, y2) => `<line class="e" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  let g = '', alt = '', Wd = 320, Hd = 190; const ringPts = (n, cx, cy, r) => Array.from({ length: n }, (x, i) => [cx + r * Math.cos(2 * Math.PI * i / n - Math.PI / 2), cy + r * Math.sin(2 * Math.PI * i / n - Math.PI / 2)]);
  if (t === 'bus') { g = L(20, 95, 300, 95) + [50, 110, 170, 230, 290].map((x, i) => L(x, 95, x, i % 2 ? 140 : 50) + N(x, i % 2 ? 150 : 40)).join(''); alt = 'Bus topology: five computers each connected by a short line to one shared backbone cable.'; }
  else if (t === 'star') { const ps = ringPts(6, 160, 95, 72); g = ps.map(p => L(160, 95, p[0], p[1])).join('') + ps.map(p => N(p[0], p[1])).join('') + `<rect class="n" x="132" y="80" width="56" height="30" rx="4"/><text text-anchor="middle" x="160" y="100">Switch</text>`; alt = 'Star topology: six computers each connected by its own cable to a central switch.'; }
  else if (t === 'ring') { const ps = ringPts(6, 160, 95, 70); g = ps.map((p, i) => L(p[0], p[1], ps[(i + 1) % 6][0], ps[(i + 1) % 6][1])).join('') + ps.map(p => N(p[0], p[1])).join(''); alt = 'Ring topology: six computers connected in a closed circle, each to its two neighbours.'; }
  else if (t === 'mesh') { const ps = ringPts(5, 160, 98, 72); for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) g += L(ps[i][0], ps[i][1], ps[j][0], ps[j][1]); g += ps.map(p => N(p[0], p[1])).join(''); alt = 'Full mesh topology: five computers, each connected directly to every other computer.'; }
  else if (t === 'tree') { g = L(160, 30, 90, 90) + L(160, 30, 230, 90) + [[90, 50], [90, 130], [230, 190], [230, 270]].map(p => L(p[0], 90, p[1], 155)).join('') + `<rect class="n" x="130" y="15" width="60" height="28" rx="4"/><text text-anchor="middle" x="160" y="34">Core</text>` + [90, 230].map(x => `<rect class="n" x="${x - 30}" y="76" width="60" height="28" rx="4"/><text text-anchor="middle" x="${x}" y="95">Switch</text>`).join('') + [50, 130, 190, 270].map(x => N(x, 160)).join(''); alt = 'Tree topology: a core switch at the top connects to two switches, and each switch connects to two computers.'; }
  else { const ps = ringPts(4, 90, 95, 55); g = ps.map(p => L(90, 95, p[0], p[1])).join('') + L(90, 95, 200, 95) + L(200, 95, 300, 95) + [230, 280].map((x, i) => L(x, 95, x, i ? 140 : 50) + N(x, i ? 150 : 40)).join('') + ps.map(p => N(p[0], p[1])).join('') + `<rect class="n" x="64" y="81" width="52" height="28" rx="4"/><text text-anchor="middle" x="90" y="100">Sw</text>`; alt = 'Hybrid topology: a star network (four computers around a switch) joined to a bus segment with two computers.'; }
  el.innerHTML = `<figure class="diagram"><svg viewBox="0 0 ${Wd} ${Hd}" width="${Wd}" role="img" aria-label="${esc(alt)}">${g}</svg><figcaption>${esc(alt)}</figcaption></figure>`;
};
W.venn = (el, a) => {
  const types = (a.types || a.type || 'inner').split(','); const cap = { inner: 'INNER JOIN — only rows that match in both tables', left: 'LEFT JOIN — all rows of the left table, plus matches', right: 'RIGHT JOIN — all rows of the right table, plus matches', full: 'FULL JOIN — all rows of both tables' };
  el.innerHTML = '<div class="grid three">' + types.map(t => { const id = 'vn' + Math.random().toString(36).slice(2, 7); const fill = t === 'inner' ? `<circle class="fill" cx="52" cy="40" r="30" clip-path="url(#${id})"/>` : t === 'left' ? '<circle class="fill" cx="52" cy="40" r="30"/>' : t === 'right' ? '<circle class="fill" cx="88" cy="40" r="30"/>' : '<circle class="fill" cx="52" cy="40" r="30"/><circle class="fill" cx="88" cy="40" r="30"/>'; return `<figure class="diagram venn"><svg viewBox="0 0 140 80" width="170" role="img" aria-label="${esc(cap[t])}"><defs><clipPath id="${id}"><circle cx="88" cy="40" r="30"/></clipPath></defs>${fill}<circle cx="52" cy="40" r="30"/><circle cx="88" cy="40" r="30"/><text x="30" y="44" text-anchor="middle">A</text><text x="110" y="44" text-anchor="middle">B</text></svg><figcaption>${esc(cap[t])}</figcaption></figure>`; }).join('') + '</div>';
};
})();
