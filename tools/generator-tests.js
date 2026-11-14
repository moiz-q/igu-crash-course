// Unit tests for the subnetting and maths generators. Open tools/generator-tests.html.
(function () {
  const out = []; let pass = 0, fail = 0;
  const ok = (cond, msg) => { if (cond) pass++; else { fail++; if (out.length < 40) out.push('FAIL ' + msg); } };
  const N = CC.net;
  // --- subnetting: compare with an independent bitwise implementation ---
  const toInt = s => s.split('.').reduce((a, o) => ((a << 8) | +o) >>> 0, 0);
  const toIp = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.');
  const ref = (ip, p) => { const mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; const net = (ip & mask) >>> 0; const bc = (net | (~mask >>> 0)) >>> 0; return { mask: toIp(mask), net: toIp(net), bc: toIp(bc), first: toIp(net + 1), last: toIp(bc - 1), hosts: String(Math.pow(2, 32 - p) - 2) }; };
  // fixed known answers
  const known = [['192.168.10.77', 26, '192.168.10.64', '192.168.10.127', '62'], ['10.1.2.3', 8, '10.0.0.0', '10.255.255.255', '16777214'], ['172.16.45.200', 20, '172.16.32.0', '172.16.47.255', '4094'], ['192.168.1.130', 30, '192.168.1.128', '192.168.1.131', '2']];
  known.forEach(([ip, p, net, bc, h]) => { const s = N.subnet(N.ip2n(ip), p); ok(N.n2ip(s.net) === net && N.n2ip(s.bc) === bc && String(s.hosts) === h, 'known ' + ip + '/' + p); });
  for (let i = 0; i < 3000; i++) {
    const mode = ['easy', 'hard', 'mask', 'hosts'][i % 4]; const q = CC.subnetQuestion(mode);
    if (q.kind === 'full') { const r = ref(q.ip, q.p); const f = Object.fromEntries(q.fields.map(x => [x[0], x[1]])); ok(f['Subnet mask'] === r.mask && f['Network address'] === r.net && f['Broadcast address'] === r.bc && f['First usable host'] === r.first && f['Last usable host'] === r.last && f['Number of usable hosts'] === r.hosts, 'subnet ' + toIp(q.ip) + '/' + q.p + ' ' + JSON.stringify(q.fields)); }
    else if (mode === 'mask') { const v = q.fields[0][1]; if (v.includes('.')) { const p = +q.text.match(/\/(\d+)/)[1]; ok(ref(0, p).mask === v, 'mask /' + p); } else { const m = q.text.match(/<b>([\d.]+)<\/b>/)[1]; ok(ref(0, +v).mask === m, 'prefix for ' + m); } }
    else { const need = +q.text.match(/<b>(\d+)<\/b>/)[1]; const p = +q.fields[0][1], h = +q.fields[1][1]; ok(h === Math.pow(2, 32 - p) - 2 && h >= need && (Math.pow(2, 31 - p) - 2 < need || p === 30), 'hosts need ' + need + ' got /' + p); }
  }
  // --- maths generators: the stated answer must satisfy the problem, checked independently ---
  const G = CC.mathgen; const near = (a, b) => Math.abs(a - b) < 1e-9;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const checkers = {
    sets: (q, m) => m.t === 'union' ? q.ans === m.a + m.b - m.i : q.ans === Math.pow(2, m.n),
    fractions: (q, m) => { const v = { '+': m.a / m.b + m.c / m.d, '-': m.a / m.b - m.c / m.d, '\\cdot': (m.a / m.b) * (m.c / m.d), '\\div': (m.a / m.b) / (m.c / m.d) }[m.op]; return near(q.ans, v); },
    divisibility: (q, m) => q.ans === m.n % m.d,
    bases: (q, m) => m.dir === 'to10' ? q.ans === m.n : q.ans[0] === m.n.toString(m.b).toUpperCase(),
    modular: (q, m) => { if (m.t === 'add') return q.ans === (m.a + m.b) % m.m; let r = 1; for (let i = 0; i < m.e; i++) r = (r * m.a) % m.m; return q.ans === r; },
    primes: (q, m) => { if (m.t === 'div') { let c = 0; for (let d = 1; d <= m.n; d++) if (m.n % d === 0) c++; return q.ans === c; } if (m.t === 'zeros') { let f = 1n; for (let i = 2n; i <= BigInt(m.n); i++) f *= i; const s = f.toString(); return q.ans === s.length - s.replace(/0+$/, '').length; } let v = 1; for (let i = m.n; i > m.n - m.k; i--) v *= i; return q.ans === v; },
    gcdlcm: (q, m) => q.ans === (m.want === 'GCD' ? gcd(m.a, m.b) : m.a * m.b / gcd(m.a, m.b)),
    exponents: (q, m) => m.t === 'mul' ? q.ans === Math.pow(m.b, m.m + m.n - m.k) : m.t === 'neg' ? near(q.ans, Math.pow(m.b, -m.n)) : m.t === 'eq' ? Math.pow(m.b, q.ans + m.c) === Math.pow(m.b, m.x + m.c) : q.ans === Math.pow(Math.pow(m.b, m.m), m.n),
    radicals: (q, m) => { const s = q.ans[0].replace('√', ' ').split(' '); const k = s[0] === '' ? 1 : s[0] === '-' ? -1 : +s[0]; const r = +s[1]; return m.t === 'simp' ? near(k * Math.sqrt(r), Math.sqrt(m.k * m.k * m.r)) : near(k * Math.sqrt(r), Math.sqrt(m.a * m.a * m.r) + m.s * Math.sqrt(m.b * m.b * m.r)); },
    factoring: (q, m) => { const roots = [...q.ans[0].matchAll(/\(x([+-]\d+)\)/g)].map(x => -+x[1]); const sq = /\^2$/.test(q.ans[0]); const rs = sq ? [roots[0], roots[0]] : roots; const b = m.t === 'dsq' ? 0 : m.p + m.q, c = m.t === 'dsq' ? -m.a * m.a : m.p * m.q; return rs.length === 2 && [-3, 0, 2, 7].every(x => near((x - rs[0]) * (x - rs[1]), x * x + b * x + c)); },
    linear: (q, m) => m.t === 'one' ? near(m.a * q.ans + m.b, m.c * q.ans + m.d) : near(m.a * q.ans[0] + m.b * q.ans[1], m.a * m.x + m.b * m.y) && near(m.a * q.ans[0] - m.b * q.ans[1], m.a * m.x - m.b * m.y),
    quadratic: (q, m) => m.t === 'disc' ? q.ans === m.b * m.b - 4 * m.c : q.ans.every(x => near(x * x + m.b * x + m.c, 0)) && (q.ans.length === 2 || m.b * m.b - 4 * m.c === 0),
    inequalities: (q, m) => { const mt = q.ans[0].match(/^x(<=|>=|<|>)(-?\d+)$/); if (!mt) return false; const x0 = +mt[2], op = mt[1]; const holds = x => { const L = m.a * x + m.b; return { '<': L < m.c, '>': L > m.c, '\\le': L <= m.c, '\\ge': L >= m.c }[m.op]; }; const claim = x => ({ '<': x < x0, '>': x > x0, '<=': x <= x0, '>=': x >= x0 })[op]; for (let x = -30; x <= 30; x += 0.5) if (holds(x) !== claim(x)) return false; return true; },
    absolute: (q, m) => { if (m.t === 'eq') return q.ans.every(x => Math.abs(x - m.a) === m.b) && q.ans.length === 2; let c = 0; for (let x = -100; x <= 100; x++) { const v = Math.abs(x - m.a); if (m.strict ? v < m.b : v <= m.b) c++; } return q.ans === c; },
    ratio: (q, m) => { switch (m.t) { case 'inc': return near(q.ans, m.base * (1 + m.p / 100)); case 'dec': return near(q.ans, m.base * (1 - m.p / 100)); case 'of': return near(q.ans * m.b / 100, m.part); case 'profit': return near(q.ans, Math.abs(m.sell - m.cost) / m.cost * 100); case 'direct': return q.ans === m.c * m.k; case 'inverse': return near(q.ans * m.w2, m.w * m.d); case 'share': return q.ans === m.a * m.u; } return false; }
  };
  CC.mathTopics.forEach(([t]) => {
    for (let i = 0; i < 400; i++) {
      const q = G[t](); const m = q.meta || {};
      let good = false; try { good = checkers[t](q, m); } catch (e) { good = false; }
      ok(good, t + ' ' + JSON.stringify({ ans: q.ans, meta: m }));
      const typed = q.ansText || (q.kind === 'num' ? String(q.ans) : q.kind === 'text' ? q.ans[0] : q.ans.join(', '));
      ok(CC.mathCheck(q, typed), t + ' answer checker rejects its own answer: ' + typed);
      ok(q.steps && q.steps.length, t + ' has no steps');
    }
  });
  // spreadsheet engine
  const E = CC.sheetEngine({ A1: '10', A2: '20', A3: '', A4: 'x', B1: '=SUM(A1:A3)', B2: '=AVERAGE(A1:A2)', B3: '=A1/A3', B4: '=IF(A1>5,"big","small")', B5: '=ROUND(2.345,2)', B6: '=COUNTA(A1:A4)', B7: '=COUNT(A1:A4)', B8: '=A4+1', B9: '=SUMM(A1)', C1: '=$A$1*2', C2: '=TOPLA(A1;A2)' }, 3, 10);
  [['B1', 30], ['B2', 15], ['B3', '#DIV/0!'], ['B4', 'big'], ['B5', 2.35], ['B6', 3], ['B7', 2], ['B8', '#VALUE!'], ['B9', '#NAME?'], ['C1', 20], ['C2', 30]].forEach(([c, v]) => ok(E.value(c) === v, 'sheet ' + c + ' = ' + E.value(c) + ' expected ' + v));
  window.GEN_RESULT = pass + ' passed, ' + fail + ' failed\n' + out.join('\n');
  document.getElementById('o').textContent = window.GEN_RESULT;
})();
