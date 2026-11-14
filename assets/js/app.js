/* Crash course app core: storage, router, pages. Content lives in /data (built from /content). */
window.CC = (function () {
'use strict';
const CC = { data: { index: null, c: {} }, widgets: {}, lib: {}, leave: [] };
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
CC.$ = $; CC.$$ = $$; CC.esc = esc;

/* ---------- progress store (localStorage, always wrapped in try/catch) ---------- */
const KEY = 'igu-cc-v1';
const blank = () => ({ v: 1, done: {}, quiz: {}, ex: {}, checks: {}, cards: {}, mocks: {}, drafts: {}, plan: { start: null }, theme: null, last: null });
let S;
try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = blank(); }
let storageOk = true;
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); storageOk = true; } catch (e) { storageOk = false; }
  if (CC.data.index) chrome();
}
CC.S = () => S; CC.save = save;

/* ---------- loaders ---------- */
const loaded = {};
function loadScript(src) {
  return loaded[src] || (loaded[src] = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = () => res();
    s.onerror = () => { delete loaded[src]; rej(new Error('Could not load ' + src)); };
    document.head.appendChild(s);
  }));
}
function loadCss(href) { if (!loaded[href]) { loaded[href] = true; const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); } }
CC.provideIndex = d => { CC.data.index = d; start(); };
CC.provideCourse = (id, d) => { CC.data.c[id] = d; };
CC.course = async id => { if (!CC.data.c[id]) await loadScript('data/' + id + '.js'); return CC.data.c[id]; };
CC.lib.katex = () => { loadCss('vendor/katex/katex.min.css'); return loadScript('vendor/katex/katex.min.js'); };
CC.lib.cm = async () => { loadCss('vendor/codemirror/codemirror.css'); await loadScript('vendor/codemirror/codemirror.js'); await Promise.all(['clike', 'sql', 'matchbrackets', 'closebrackets'].map(f => loadScript('vendor/codemirror/' + f + '.js'))); };
CC.lib.minic = () => loadScript('assets/js/minic.js');
CC.lib.sql = async () => {
  if (CC.SQL) return CC.SQL;
  await loadScript('vendor/sqljs/sql-wasm-b64.js'); await loadScript('vendor/sqljs/sql-wasm.js');
  const bin = Uint8Array.from(atob(window.SQL_WASM_B64), c => c.charCodeAt(0));
  CC.SQL = await window.initSqlJs({ wasmBinary: bin });
  return CC.SQL;
};

/* ---------- syntax highlighting for static code blocks ---------- */
const KWS = {
  c: new Set('int char float double void long short unsigned signed const static struct typedef if else while do for switch case default break continue return sizeof enum NULL'.split(' ')),
  java: new Set('int char float double void long short boolean byte final static class public private protected new this super extends implements interface if else while do for switch case default break continue return import package true false null String'.split(' ')),
  sql: new Set('SELECT FROM WHERE AND OR NOT IN BETWEEN LIKE IS NULL ORDER BY GROUP HAVING DISTINCT AS JOIN INNER LEFT RIGHT FULL OUTER ON INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DATABASE ALTER ADD COLUMN DROP TRUNCATE PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT CHECK CONSTRAINT INT INTEGER VARCHAR NVARCHAR CHAR TEXT DATE DATETIME DECIMAL REAL BIT ASC DESC LIMIT TOP COUNT SUM AVG MIN MAX EXISTS BEGIN COMMIT ROLLBACK TRANSACTION TRAN GRANT REVOKE DENY TO USE VIEW INDEX IDENTITY AUTOINCREMENT UNION ALL CASE WHEN THEN ELSE END LOGIN USER ROLE WITH PASSWORD BACKUP RESTORE DISK EXEC PROCEDURE GO OFFSET CROSS NATURAL'.split(' '))
};
function highlight(src, lang) {
  const kws = KWS[lang]; if (!kws) return esc(src);
  const sql = lang === 'sql';
  const re = sql ? /(--[^\n]*|\/\*[\s\S]*?\*\/)|('(?:''|[^'])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g
    : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?[fFuUlL]*\b)|([A-Za-z_]\w*)|(^[ \t]*#[ \t]*\w+)/gm;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += esc(src.slice(last, m.index)); last = re.lastIndex; const t = m[0];
    if (m[1]) out += '<span class="tk-com">' + esc(t) + '</span>';
    else if (m[2]) out += '<span class="tk-str">' + esc(t) + '</span>';
    else if (m[3]) out += '<span class="tk-num">' + esc(t) + '</span>';
    else if (m[5]) out += '<span class="tk-pre">' + esc(t) + '</span>';
    else if (kws.has(sql ? t.toUpperCase() : t)) out += '<span class="tk-kw">' + esc(t) + '</span>';
    else if (!sql && src[re.lastIndex] === '(') out += '<span class="tk-fn">' + esc(t) + '</span>';
    else out += esc(t);
  }
  return out + esc(src.slice(last));
}
CC.highlight = highlight;

/* ---------- enhance rendered HTML: highlight code, render maths, start widgets ---------- */
CC.enhance = async function (root, ctx) {
  $$('pre.code', root).forEach(p => { if (p.dataset.hl) return; p.dataset.hl = 1; const c = p.firstElementChild || p; c.innerHTML = highlight(c.textContent, p.dataset.lang); });
  const maths = $$('.math', root).filter(el => !el.dataset.done);
  if (maths.length) {
    try { await CC.lib.katex(); maths.forEach(el => { try { window.katex.render(el.dataset.tex, el, { displayMode: el.classList.contains('display'), throwOnError: false }); } catch (e) { el.textContent = el.dataset.tex; } el.dataset.done = 1; }); }
    catch (e) { maths.forEach(el => { el.textContent = el.dataset.tex; el.dataset.done = 1; }); }
  }
  for (const el of $$('[data-widget]', root)) {
    if (el.dataset.ready) continue; el.dataset.ready = 1;
    const fn = CC.widgets[el.dataset.widget];
    if (!fn) { el.insertAdjacentHTML('beforeend', '<p class="msg warn">Unknown interactive block: ' + esc(el.dataset.widget) + '</p>'); continue; }
    try { await fn(el, Object.assign({}, el.dataset), ctx || {}); }
    catch (e) { console.error(e); el.insertAdjacentHTML('beforeend', '<p class="msg bad">This interactive part could not load (' + esc(e.message) + '). The rest of the lesson still works.</p>'); }
  }
};
CC.tex = t => '<span class="math" data-tex="' + esc(t) + '"></span>';

/* ---------- progress helpers ---------- */
const idx = () => CC.data.index;
const courseMeta = id => idx().courses.find(c => c.id === id);
const mainCourses = () => idx().courses.filter(c => !c.extra);
const prog = c => { const t = c.lessons.length, d = c.lessons.filter(l => S.done[l]).length; return { d, t, p: t ? Math.round(100 * d / t) : 0 }; };
const overall = () => { let d = 0, t = 0; mainCourses().forEach(c => { const p = prog(c); d += p.d; t += p.t; }); return { d, t, p: t ? Math.round(100 * d / t) : 0 }; };
const R = 27, CIRC = 2 * Math.PI * R;
const ring = (p, big) => `<span class="ring ${big ? 'big' : ''}" role="img" aria-label="${p}% complete"><svg viewBox="0 0 64 64" aria-hidden="true"><circle class="trk" cx="32" cy="32" r="${R}"/><circle class="val" cx="32" cy="32" r="${R}" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${(CIRC * (1 - p / 100)).toFixed(1)}"/></svg><b>${p}%</b></span>`;
CC.courseMeta = courseMeta;
function planOrder() { const out = []; const pl = idx().plan; if (pl) pl.weeks.forEach(w => w.items.forEach(it => (it.lessons || []).forEach(l => { if (!out.includes(l)) out.push(l); }))); idx().courses.forEach(c => c.lessons.forEach(l => { if (!out.includes(l)) out.push(l); })); return out; }
function nextLesson(courseId) {
  if (courseId) { const c = courseMeta(courseId); return c.lessons.find(l => !S.done[l]) || null; }
  if (S.last && idx().lessons[S.last] && !S.done[S.last]) return S.last;
  return planOrder().find(l => !S.done[l]) || null;
}
const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const parseIso = s => { const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
function planStart() { let d = parseIso(S.plan.start); if (!d) { d = today(); S.plan.start = iso(d); save(); } return d; }
function planWeek() { const days = Math.floor((today() - planStart()) / 864e5); return days < 0 ? -1 : Math.floor(days / 7); }

/* ---------- chrome: sidebar, top bar ---------- */
function chrome() {
  const here = location.hash || '#/';
  const o = overall();
  $('#top-progress').textContent = o.p + '%';
  $('#top-progress').setAttribute('aria-label', 'Overall progress ' + o.p + ' percent');
  const cur = h => here === h || (h !== '#/' && here.startsWith(h)) ? ' aria-current="page"' : '';
  let h = `<a href="#/"${here === '#/' || here === '' ? ' aria-current="page"' : ''}>⌂ Home</a><h3>Courses</h3>`;
  const curLesson = /^#\/lesson\/(.+)$/.exec(here); const lc = curLesson && idx().lessons[curLesson[1]] ? idx().lessons[curLesson[1]].course : null;
  mainCourses().forEach(c => { const on = here === '#/course/' + c.id || lc === c.id; h += `<a href="#/course/${c.id}" data-course="${c.id}"${on ? ' aria-current="page"' : ''}><span class="dot"></span>${esc(c.short)}<span class="pct">${prog(c).p}%</span></a>`; });
  h += `<h3>Practise</h3><a href="#/practice"${cur('#/practice')}>✎ Practice hub</a><a href="#/mocks"${cur('#/mock')}>⏱ Mock exams</a><a href="#/flashcards"${cur('#/flashcards')}>❏ Flashcards</a>
<h3>Reference</h3><a href="#/cheats"${cur('#/cheat')}>▦ Cheat sheets</a><a href="#/glossary"${cur('#/glossary')}>Aa Glossary (EN ↔ TR)</a><a href="#/sql"${cur('#/sql')}>⛁ SQL playground</a>
<h3>Plan ahead</h3><a href="#/plan"${cur('#/plan')}>🗓 Study plan</a><a href="#/course/bridge" data-course="bridge"${here === '#/course/bridge' || lc === 'bridge' ? ' aria-current="page"' : ''}><span class="dot"></span>Semester 2 bridge</a><a href="#/lesson/en-ready">English readiness test</a><a href="#/more"${cur('#/more')}>⚙ Backup &amp; settings</a>`;
  $('#sidebar').innerHTML = h;
  const tab = /^#\/(course|lesson|courses)/.test(here) ? 'courses' : /^#\/(practice|exercise|challenge|quiz|tool|mock|sql)/.test(here) ? 'practice' : /^#\/flashcards/.test(here) ? 'flashcards' : here === '#/' || here === '' ? 'home' : 'more';
  $$('#tabbar a').forEach(a => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#theme-ico').textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
}

/* ---------- router ---------- */
const routes = []; const route = (re, fn) => routes.push([re, fn]);
let token = 0;
async function render() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const qi = hash.indexOf('?'); const path = qi < 0 ? hash : hash.slice(0, qi); const params = new URLSearchParams(qi < 0 ? '' : hash.slice(qi + 1));
  const main = $('#main'); const my = ++token;
  CC.leave.splice(0).forEach(fn => { try { fn(); } catch (e) { } });
  chrome();
  for (const [re, fn] of routes) {
    const m = re.exec(path); if (!m) continue;
    try {
      const v = await fn(m, params); if (my !== token) return;
      if (v.redirect) { location.replace('#' + v.redirect); return; }
      main.className = v.wide ? 'wide' : '';
      if (v.course) main.setAttribute('data-course', v.course); else main.removeAttribute('data-course');
      main.innerHTML = v.html;
      document.title = v.title + ' — Semester 1 Crash Course';
      if (!params.get('keep')) window.scrollTo(0, 0);
      await CC.enhance(main, v.ctx);
      if (my !== token) return;
      if (v.after) v.after(main);
      if (v.anchor) { const a = document.getElementById(v.anchor); if (a) a.scrollIntoView(); }
    } catch (e) {
      console.error(e);
      main.innerHTML = `<h1>Something went wrong</h1><p class="msg bad">${esc(e.message)}</p><p>If you opened the site as a file, check that the <code>data</code> folder is next to <code>index.html</code>. <a href="#/">Go home</a></p>`;
    }
    return;
  }
  main.innerHTML = '<h1>Page not found</h1><p><a class="btn primary" href="#/">Go to the dashboard</a></p>';
}
CC.go = h => { location.hash = h; };

/* ---------- pages ---------- */
const crumbs = (...parts) => '<nav class="crumbs" aria-label="Breadcrumb">' + parts.map(p => p[1] ? `<a href="${p[1]}">${esc(p[0])}</a>` : esc(p[0])).join(' › ') + '</nav>';
function courseCard(c) {
  const p = prog(c);
  return `<a class="card course-card" data-course="${c.id}" href="#/course/${c.id}">${ring(p.p)}<span class="grow"><h3>${esc(c.name)}</h3><span class="muted small">${p.d} of ${p.t} lessons done</span><span class="meta">${c.code ? `<span class="badge">${esc(c.code)}</span>` : ''}${c.ects ? `<span class="badge">${c.ects} ECTS</span>` : ''}${c.exam ? `<span class="badge accent">${esc(c.exam)} exam</span>` : ''}</span></span></a>`;
}
function todayCard() {
  const pl = idx().plan; if (!pl) return '';
  const w = planWeek(); const start = planStart();
  if (w < 0) return `<div class="card"><h2>Today's plan</h2><p>Your study plan starts on <b>${fmtDate(start)}</b>. You can start earlier — just open any lesson.</p><a class="btn small" href="#/plan">Open study plan</a></div>`;
  if (w >= pl.weeks.length) return `<div class="card"><h2>Today's plan</h2><p>You are past week ${pl.weeks.length} of the plan. Use the time for weak spots: redo mock exams and drills.</p><div class="btn-row"><a class="btn small" href="#/mocks">Mock exams</a><a class="btn small" href="#/plan">Study plan</a></div></div>`;
  const wk = pl.weeks[w]; let rows = '', n = 0;
  wk.items.forEach(it => { const todo = (it.lessons || []).filter(l => !S.done[l]); if (!todo.length && (it.lessons || []).length) return; if (n >= 5) return; n++; const first = todo[0]; rows += `<li>${first ? `<a class="row" href="#/lesson/${first}">` : '<span class="row">'}<span class="grow"><b>${esc(it.col)}</b><small>${esc(it.text)}${todo.length ? ' · ' + todo.length + ' lesson' + (todo.length > 1 ? 's' : '') + ' left' : ''}</small></span>${first ? '<span aria-hidden="true">›</span></a>' : '</span>'}</li>`; });
  if (!rows) rows = '<li class="row"><span class="grow">Everything for this week is done. 🎉 Try a mock exam or move on to next week.</span></li>';
  return `<div class="card"><h2>Today's plan <span class="badge">Week ${wk.week} of ${pl.weeks.length}</span></h2><ul class="list">${rows}</ul><a class="btn small" href="#/plan">Open study plan</a></div>`;
}
route(/^\/$/, async () => {
  const o = overall(); const nl = nextLesson(); const lm = nl && idx().lessons[nl];
  const started = o.d > 0 || S.last;
  const cta = lm ? `<a class="btn primary" href="#/lesson/${lm.id}">${started ? 'Continue' : 'Start first lesson'}: ${esc(lm.title)}</a>` : `<a class="btn primary" href="#/mocks">All lessons done — take a mock exam</a>`;
  const html = `<h1>Semester 1 crash course</h1>
<p class="lead">Everything your classmates learned in the fall semester of Computer Programming (English) at İGÜ, in short lessons with practice.</p>
<div class="card hero">${ring(o.p, true)}<div class="grow"><h2>${started ? 'Continue where you left off' : 'Start here'}</h2><p class="muted">${o.d} of ${o.t} lessons done${lm ? ' · next: <b>' + esc(courseMeta(lm.course).short) + '</b>' : ''}</p>${cta}</div></div>
<div class="grid two" style="margin-top:.9rem">${todayCard()}<div class="card"><h2>How each lesson works</h2><ol class="steps"><li>Read the short explanation</li><li>Study the worked example</li><li>Try it yourself</li><li>Answer the quick check</li><li>Mark it complete</li></ol></div></div>
<h2>Courses <span class="muted small">(most important first)</span></h2>
<div class="grid two">${mainCourses().map(courseCard).join('')}</div>
<h2>Practise and review</h2>
<div class="grid three">
<a class="card course-card" href="#/practice"><span class="grow"><h3>Practice hub</h3><span class="muted small">All exercises, filter by course and difficulty</span></span></a>
<a class="card course-card" href="#/mocks"><span class="grow"><h3>Mock exams</h3><span class="muted small">Midterm and final for every course</span></span></a>
<a class="card course-card" href="#/flashcards"><span class="grow"><h3>Flashcards</h3><span class="muted small">Key terms with spaced repetition</span></span></a>
<a class="card course-card" href="#/cheats"><span class="grow"><h3>Cheat sheets</h3><span class="muted small">One printable page per course</span></span></a>
<a class="card course-card" href="#/glossary"><span class="grow"><h3>Glossary</h3><span class="muted small">English ↔ Turkish terms</span></span></a>
<a class="card course-card" data-course="bridge" href="#/course/bridge"><span class="grow"><h3>Semester 2 bridge</h3><span class="muted small">What spring courses expect + previews</span></span></a>
<a class="card course-card" data-course="en" href="#/lesson/en-ready"><span class="grow"><h3>English readiness test</h3><span class="muted small">General B2 practice (not the real IGUYET)</span></span></a>
<a class="card course-card" href="#/plan"><span class="grow"><h3>Study plan</h3><span class="muted small">8 weeks, you choose the start date</span></span></a>
</div>
<div class="callout callout-note" style="margin-top:1.4rem"><div class="callout-h">Ask your department</div><p>Ask the department secretary whether you will take the fall courses next autumn, or whether credits can transfer. This site helps you either way: you will know the material your classmates already know.</p></div>
${storageOk ? '' : '<p class="msg warn">Your browser is blocking storage, so progress cannot be saved on this device.</p>'}`;
  return { title: 'Dashboard', html, wide: true };
});
route(/^\/courses$/, async () => ({ title: 'Courses', wide: true, html: `<h1>Courses</h1><p class="lead">In priority order for semester 2.</p><div class="grid two">${mainCourses().map(courseCard).join('')}${courseCard(courseMeta('bridge'))}</div>` }));

route(/^\/course\/([\w-]+)$/, async (m) => {
  const c = courseMeta(m[1]); if (!c) throw new Error('Unknown course');
  const data = await CC.course(c.id); const p = prog(c); const nl = nextLesson(c.id);
  let list = ''; let mid = false; const hasMid = c.lessons.some(l => idx().lessons[l].wk >= 8) && c.lessons.some(l => idx().lessons[l].wk && idx().lessons[l].wk <= 6);
  const mockLink = k => (c.mock && c.mock[k]) || (c.writtenMocks || []).includes(k) ? ` <a href="#/mock/${c.id}/${k}">Take the ${k} mock →</a>` : '';
  c.lessons.forEach((lid, i) => {
    const l = idx().lessons[lid];
    if (hasMid && !mid && l.wk >= 8) { mid = true; list += `<li><div class="marker">Week 7 — Midterm exam (covers weeks 1–6, 50% of the grade)${mockLink('midterm')}</div></li>`; }
    list += `<li><a class="row" href="#/lesson/${lid}"><span class="tick ${S.done[lid] ? 'done' : ''}" aria-hidden="true">✓</span><span class="grow"><b>${esc(l.title)}</b><small>${l.week ? 'Week ' + esc(l.week) + ' · ' : ''}${l.min} min${S.done[lid] ? ' · done' : ''}</small></span><span aria-hidden="true">›</span></a></li>`;
  });
  if (hasMid) list += `<li><div class="marker">Weeks 16–17 — Final exam (covers everything, 50% of the grade)${mockLink('final')}</div></li>`;
  const links = [];
  if (c.hasCheat) links.push(`<a class="btn" href="#/cheat/${c.id}">Cheat sheet</a>`);
  if (idx().practice.some(x => x.c === c.id)) links.push(`<a class="btn" href="#/practice?course=${c.id}">Practice set</a>`);
  if (mockLink('midterm')) links.push(`<a class="btn" href="#/mock/${c.id}/midterm">Midterm mock</a>`);
  if (mockLink('final')) links.push(`<a class="btn" href="#/mock/${c.id}/final">Final mock</a>`);
  if (c.id === 'db') links.push('<a class="btn" href="#/sql">SQL playground</a>');
  if (c.id === 'en') links.push('<a class="btn" href="#/lesson/en-ready">English readiness test</a>');
  const html = `${crumbs(['Home', '#/'], [c.short])}
<div class="hero">${ring(p.p, true)}<div class="grow"><h1>${esc(c.name)}</h1><p class="muted">${[c.code, c.ects ? c.ects + ' ECTS' : '', c.exam ? c.exam + ' exams (midterm 50% + final 50%)' : ''].filter(Boolean).map(esc).join(' · ')}</p></div></div>
<div class="course-intro">${c.introHtml}</div>
<div class="btn-row">${nl ? `<a class="btn primary" href="#/lesson/${nl}">${p.d ? 'Continue' : 'Start'}: ${esc(idx().lessons[nl].title)}</a>` : '<span class="badge easy">All lessons complete ✓</span>'}</div>
${data.extra.index ? data.extra.index.html : ''}
<h2>Lessons</h2><ul class="list card">${list}</ul>
${links.length ? '<h2>Review tools</h2><div class="btn-row">' + links.join('') + '</div>' : ''}`;
  return { title: c.name, html, course: c.id, ctx: { courseId: c.id, course: data, page: data.extra.index || {} } };
});

route(/^\/lesson\/([\w-]+)$/, async (m) => {
  const l = idx().lessons[m[1]]; if (!l) throw new Error('Unknown lesson: ' + m[1]);
  const c = courseMeta(l.course); const data = await CC.course(c.id); const page = data.lessons[l.id];
  const i = c.lessons.indexOf(l.id); const prev = c.lessons[i - 1], next = c.lessons[i + 1];
  S.last = l.id; save();
  const nav = () => {
    const done = !!S.done[l.id];
    const nextBtn = next ? `<a class="btn ${done ? 'primary' : ''}" href="#/lesson/${next}">Next lesson: ${esc(idx().lessons[next].title)} →</a>` : `<a class="btn ${done ? 'primary' : ''}" href="#/course/${c.id}">Back to ${esc(c.short)} ✓</a>`;
    return `<button class="btn ${done ? '' : 'primary'}" id="mark" type="button" aria-pressed="${done}">${done ? '✓ Completed (tap to undo)' : 'Mark complete'}</button>${nextBtn}`;
  };
  const html = `${crumbs(['Home', '#/'], [c.short, '#/course/' + c.id], [l.title])}
<h1>${esc(l.title)}</h1>
<p class="muted">${l.week ? 'Week ' + esc(l.week) + ' of the syllabus · ' : ''}about ${l.min} minutes${prev ? ` · <a href="#/lesson/${prev}">← previous lesson</a>` : ''}</p>
${l.goal ? `<div class="goal"><b>Learning goal</b>After this lesson you can ${esc(l.goal)}.</div>` : ''}
<article class="lesson">${page.html}</article>
<div class="lesson-nav" id="lesson-nav">${nav()}</div>`;
  return {
    title: l.title, html, course: c.id, ctx: { courseId: c.id, lessonId: l.id, course: data, page },
    after(main) {
      $('#lesson-nav', main).addEventListener('click', e => {
        if (e.target.id !== 'mark') return;
        if (S.done[l.id]) delete S.done[l.id]; else S.done[l.id] = Date.now();
        save(); $('#lesson-nav', main).innerHTML = nav(); $('#mark', main).focus();
      });
    }
  };
});

/* practice hub */
route(/^\/practice$/, async (m, params) => {
  const P = idx().practice; const fc = params.get('course') || '', fd = params.get('diff') || '', ft = params.get('topic') || '';
  const topics = fc ? courseMeta(fc).lessons.filter(l => P.some(x => x.topic === l)) : [];
  const items = P.filter(x => (!fc || x.c === fc) && (!fd || x.diff === fd) && (!ft || x.topic === ft));
  const kindName = { run: 'Write code', predict: 'Predict output', bug: 'Find the bug', fill: 'Fill the blank', sql: 'SQL query', quiz: 'Quiz', mock: 'Mock exam', drill: 'Drill', flow: 'Flowchart', written: 'Written' };
  const isDone = x => S.ex[x.id] || (S.quiz[x.id] && S.quiz[x.id].best === S.quiz[x.id].n) || S.mocks[x.id];
  const rows = items.map(x => `<li><a class="row" href="${x.href}"><span class="tick ${isDone(x) ? 'done' : ''}" aria-hidden="true">✓</span><span class="grow"><b>${esc(x.title)}</b><small>${esc(courseMeta(x.c).short)}${x.topic && idx().lessons[x.topic] ? ' · ' + esc(idx().lessons[x.topic].title) : ''}</small></span><span class="badge">${kindName[x.kind] || x.kind}</span><span class="badge ${x.diff}">${x.diff === 'exam' ? 'exam-level' : x.diff}</span></a></li>`).join('');
  const opt = (v, t, cur) => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(t)}</option>`;
  const html = `<h1>Practice hub</h1><p class="lead">Every exercise on the site. ${items.filter(isDone).length} of ${items.length} shown are done.</p>
<form class="filters" id="pf"><div class="field"><label for="f-c">Course</label><select id="f-c" name="course">${opt('', 'All courses', fc)}${idx().courses.filter(c => P.some(x => x.c === c.id)).map(c => opt(c.id, c.short, fc)).join('')}</select></div>
<div class="field"><label for="f-t">Topic</label><select id="f-t" name="topic" ${topics.length ? '' : 'disabled'}>${opt('', fc ? 'All topics' : 'Choose a course first', ft)}${topics.map(t => opt(t, idx().lessons[t].title, ft)).join('')}</select></div>
<div class="field"><label for="f-d">Difficulty</label><select id="f-d" name="diff">${opt('', 'Any', fd)}${opt('easy', 'Easy', fd)}${opt('medium', 'Medium', fd)}${opt('exam', 'Exam-level', fd)}</select></div></form>
<ul class="list card">${rows || '<li class="row">No exercises match these filters.</li>'}</ul>`;
  return {
    title: 'Practice hub', html, wide: true, after(main) {
      $('#pf', main).addEventListener('change', e => {
        const q = new URLSearchParams(); const c = $('#f-c').value, d = $('#f-d').value, t = e.target.id === 'f-c' ? '' : $('#f-t').value;
        if (c) q.set('course', c); if (t) q.set('topic', t); if (d) q.set('diff', d);
        location.hash = '#/practice' + (q.toString() ? '?' + q : '');
      });
    }
  };
});
const sib = (id, kind) => { const P = idx().practice.filter(x => kind.includes(x.kind)); const i = P.findIndex(x => x.id === id); return { prev: P[i - 1], next: P[i + 1], me: P[i] }; };
CC.exNav = (id, kinds) => { const s = sib(id, kinds); return `<div class="lesson-nav">${s.prev ? `<a class="btn" href="${s.prev.href}">← Previous</a>` : '<span></span>'}<a class="btn" href="#/practice?course=${s.me ? s.me.c : ''}">All exercises</a>${s.next ? `<a class="btn" href="${s.next.href}">Next exercise →</a>` : '<span></span>'}</div>`; };
route(/^\/exercise\/([\w-]+)$/, async (m) => {
  const data = await CC.course('c'); const ex = data.exercises.find(x => x.id === m[1]); if (!ex) throw new Error('Unknown exercise');
  const l = idx().lessons[ex.lesson];
  return { title: ex.title, course: 'c', ctx: { ex, course: data }, html: `${crumbs(['Home', '#/'], ['Practice', '#/practice?course=c'], [l ? l.title : 'C', l ? '#/lesson/' + l.id : null], [ex.title])}<h1>${esc(ex.title)}</h1><div class="widget" data-widget="cexercise"></div>${CC.exNav(ex.id, ['run', 'predict', 'bug', 'fill'])}` };
});
route(/^\/challenge\/([\w-]+)$/, async (m) => {
  const data = await CC.course('db'); const ch = data.challenges.find(x => x.id === m[1]); if (!ch) throw new Error('Unknown challenge');
  const l = idx().lessons[ch.lesson];
  return { title: ch.title, course: 'db', ctx: { ch, course: data }, html: `${crumbs(['Home', '#/'], ['Practice', '#/practice?course=db'], [l ? l.title : 'SQL', l ? '#/lesson/' + l.id : null], [ch.title])}<h1>${esc(ch.title)}</h1><div class="widget" data-widget="sqlchallenge"></div>${CC.exNav(ch.id, ['sql'])}` };
});
route(/^\/quiz\/([\w-]+)\/([\w-]+)$/, async (m) => {
  const c = courseMeta(m[1]); const data = await CC.course(c.id); const l = idx().lessons[c.id + '-' + m[2]];
  return { title: 'Quiz', course: c.id, ctx: { course: data, courseId: c.id }, html: `${crumbs(['Home', '#/'], ['Practice', '#/practice?course=' + c.id], [l ? l.title : 'Quiz', l ? '#/lesson/' + l.id : null])}<h1>Quiz: ${esc(l ? l.title : c.short)}</h1><p class="lead">10 questions at a time from the question bank. Every answer is explained, and you can retry.</p><div class="widget" data-widget="mcq" data-course="${c.id}" data-tag="${esc(m[2])}" data-n="10" data-save="quiz-${c.id}-${esc(m[2])}"></div>` };
});
route(/^\/tool\/([\w-]+)$/, async (m) => {
  const t = idx().tools.find(x => x.id === m[1]); if (!t) throw new Error('Unknown tool');
  const data = await CC.course(t.course);
  const args = Object.entries(t.args || {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('');
  return { title: t.title, course: t.course, ctx: { course: data, courseId: t.course }, html: `${crumbs(['Home', '#/'], ['Practice', '#/practice?course=' + t.course], [t.title])}<h1>${esc(t.title)}</h1>${t.intro ? '<p class="lead">' + esc(t.intro) + '</p>' : ''}<div class="widget" data-widget="${esc(t.widget)}"${args} data-save="tool-${esc(t.id)}"></div>` };
});
route(/^\/sql$/, async () => {
  const data = await CC.course('db');
  return { title: 'SQL playground', course: 'db', wide: true, ctx: { course: data, courseId: 'db' }, html: `<h1>SQL playground</h1><p class="lead">A real SQL database (SQLite) running in your browser, loaded with the sample university data. Nothing you do here can break anything — press “Reset database” to start again.</p><div class="widget" data-widget="sqlrun" data-free="1"><pre hidden class="src">SELECT first_name, last_name, city\nFROM Students\nORDER BY last_name\nLIMIT 10;</pre></div><div class="callout callout-tsql"><div class="callout-h">In SQL Server (T-SQL)</div><p>The university will probably use Microsoft SQL Server. Almost everything is the same, but a few things differ: <code>SELECT TOP 10 ...</code> instead of <code>LIMIT 10</code>, <code>GETDATE()</code> instead of <code>date('now')</code>, <code>IDENTITY(1,1)</code> instead of <code>AUTOINCREMENT</code>. The <a href="#/cheat/db">SQL cheat sheet</a> lists them all.</p></div>` };
});

/* mock exams */
route(/^\/mocks$/, async () => {
  const rows = mainCourses().map(c => {
    const ks = ['midterm', 'final'].filter(k => (c.mock && c.mock[k]) || (c.writtenMocks || []).includes(k)); if (!ks.length) return '';
    return `<div class="card" data-course="${c.id}" style="border-left:5px solid var(--accent)"><h3>${esc(c.name)}</h3><p class="muted small">${esc(c.exam || '')} format${c.mock ? ' · timed' : ' · write, then compare with model answers'}</p><div class="btn-row">${ks.map(k => { const r = S.mocks['mock-' + c.id + '-' + k]; return `<a class="btn" href="#/mock/${c.id}/${k}">${k === 'midterm' ? 'Midterm (weeks 1–6)' : 'Final (everything)'}${r ? ` <span class="badge ${r.score / r.total >= .5 ? 'easy' : 'exam'}">${r.score}/${r.total}</span>` : ''}</a>`; }).join('')}</div></div>`;
  }).join('');
  return { title: 'Mock exams', wide: true, html: `<h1>Mock exams</h1><p class="lead">Each course has a midterm mock (weeks 1–6) and a final mock (all topics), in the same format as the real exam. Real exams: midterm in week 7, final in weeks 16–17, each worth 50%.</p><div class="grid two">${rows}</div>` };
});
route(/^\/mock\/([\w-]+)\/(midterm|final)$/, async (m) => {
  const c = courseMeta(m[1]); const data = await CC.course(c.id); const kind = m[2]; const id = 'mock-' + c.id + '-' + kind;
  const head = `${crumbs(['Home', '#/'], ['Mock exams', '#/mocks'], [c.short + ' ' + kind])}<h1>${esc(c.short)}: ${kind} mock exam</h1>`;
  if (data.mocks[kind]) {
    const pg = data.mocks[kind];
    return { title: c.short + ' ' + kind + ' mock', course: c.id, ctx: { course: data, courseId: c.id, page: pg }, html: `${head}<div class="callout callout-exam"><div class="callout-h">How to use this written mock</div><p>Take paper and a pen${pg.minutes ? ', set a timer for <b>' + pg.minutes + ' minutes</b>' : ''} and answer every question <b>before</b> you open a model answer. Then tick the marking checklist honestly.</p></div><article>${pg.html}</article><div class="btn-row"><button class="btn primary" id="mock-done" type="button">${S.mocks[id] ? '✓ Marked as taken' : 'I finished this mock'}</button></div>`, after(main) { $('#mock-done', main).addEventListener('click', e => { const boxes = $$('.rubric input', main); S.mocks[id] = { score: boxes.filter(b => b.checked).length, total: boxes.length || 1, ts: Date.now() }; save(); e.target.textContent = '✓ Saved: ' + S.mocks[id].score + ' of ' + S.mocks[id].total + ' checklist points'; }); } };
  }
  if (!c.mock || !c.mock[kind]) throw new Error('This course has no ' + kind + ' mock');
  return { title: c.short + ' ' + kind + ' mock', course: c.id, ctx: { course: data, courseId: c.id }, html: `${head}<div class="widget" data-widget="mockexam" data-course="${c.id}" data-kind="${kind}"></div>` };
});

/* cheat sheets */
route(/^\/cheats$/, async () => ({ title: 'Cheat sheets', wide: true, html: `<h1>Cheat sheets</h1><p class="lead">One page per course. Open one and press “Print” — it prints clean black on white.</p><div class="grid three">${idx().courses.filter(c => c.hasCheat).map(c => `<a class="card course-card" data-course="${c.id}" href="#/cheat/${c.id}"><span class="grow"><h3>${esc(c.short)}</h3><span class="muted small">${esc(c.code || '')}</span></span></a>`).join('')}</div>` }));
route(/^\/cheat\/([\w-]+)$/, async (m) => {
  const c = courseMeta(m[1]); const data = await CC.course(c.id); if (!data.cheat) throw new Error('No cheat sheet for this course');
  return { title: c.short + ' cheat sheet', course: c.id, wide: true, ctx: { course: data, courseId: c.id, page: data.cheat }, html: `<div class="no-print">${crumbs(['Home', '#/'], ['Cheat sheets', '#/cheats'], [c.short])}</div><h1>${esc(c.name)} — cheat sheet</h1><div class="btn-row no-print"><button class="btn primary" type="button" onclick="window.print()">Print this page</button><a class="btn" href="#/course/${c.id}">Back to course</a></div><article class="cheat">${data.cheat.html}</article>`, };
});

/* glossary */
route(/^\/glossary$/, async (m, params) => {
  const G = idx().glossary; const q0 = params.get('q') || '';
  const html = `<h1>Glossary</h1><p class="lead">${G.length} key terms from all courses, English ↔ Turkish.</p>
<div class="filters"><div class="field grow"><label for="g-q">Search (English or Turkish)</label><input id="g-q" type="search" value="${esc(q0)}" placeholder="e.g. pointer, değişken"></div>
<div class="field"><label for="g-c">Course</label><select id="g-c"><option value="">All</option>${idx().courses.map(c => `<option value="${c.id}">${esc(c.short)}</option>`).join('')}</select></div>
<div class="field"><label for="g-s">Sort by</label><select id="g-s"><option value="t">English</option><option value="tr">Turkish</option></select></div></div>
<div class="tablewrap"><table><thead><tr><th>English</th><th>Turkish</th><th>Meaning</th><th>Course</th></tr></thead><tbody id="g-b"></tbody></table></div><p class="muted small" id="g-n"></p>`;
  return {
    title: 'Glossary', html, wide: true, after(main) {
      const draw = () => {
        const q = $('#g-q').value.trim().toLocaleLowerCase('tr'), c = $('#g-c').value, s = $('#g-s').value;
        let rows = G.filter(g => (!c || g.c === c) && (!q || (g.t + ' ' + g.tr + ' ' + g.m).toLocaleLowerCase('tr').includes(q)));
        rows = rows.slice().sort((a, b) => a[s].localeCompare(b[s], s === 'tr' ? 'tr' : 'en'));
        $('#g-b').innerHTML = rows.map(g => `<tr><td><b>${esc(g.t)}</b></td><td lang="tr">${esc(g.tr)}</td><td>${esc(g.m)}</td><td><a href="#/lesson/${g.l[0]}">${esc(courseMeta(g.c).short)}</a></td></tr>`).join('') || '<tr><td colspan="4">No terms match.</td></tr>';
        $('#g-n').textContent = rows.length + ' term' + (rows.length === 1 ? '' : 's') + ' shown';
      };
      ['input', 'change'].forEach(ev => main.addEventListener(ev, e => { if (/^g-/.test(e.target.id)) draw(); })); draw();
    }
  };
});

/* flashcards (Leitner spaced repetition) */
const GAPS = [0, 1, 2, 4, 8, 16, 32];
function deck() {
  const d = idx().glossary.map(g => ({ id: 'g:' + g.t.toLowerCase(), c: g.c, f: esc(g.t), b: esc(g.m) + '<small lang="tr">Turkish: ' + esc(g.tr) + '</small>', tr: esc(g.tr), en: esc(g.t) }));
  idx().flash.forEach((f, i) => d.push({ id: 'f:' + i + ':' + f.f.slice(0, 12), c: f.c, f: f.f, b: f.b }));
  return d;
}
route(/^\/flashcards$/, async (m, params) => {
  const fc = params.get('course') || ''; const D = deck().filter(c => !fc || c.c === fc); const now = Date.now();
  const due = D.filter(c => S.cards[c.id] && S.cards[c.id].due <= now), fresh = D.filter(c => !S.cards[c.id]);
  const learned = D.length - fresh.length;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const queue = shuffle(due).concat(shuffle(fresh.slice()).slice(0, Math.max(0, 15 - Math.min(due.length, 15)) || (due.length ? 0 : 15)));
  const html = `<h1>Flashcards</h1><p class="lead">Spaced repetition: cards you know come back later, cards you miss come back sooner.</p>
<div class="filters"><div class="field"><label for="fc-c">Deck</label><select id="fc-c"><option value="">All courses</option>${idx().courses.filter(c => deck().some(x => x.c === c.id)).map(c => `<option value="${c.id}"${c.id === fc ? ' selected' : ''}>${esc(c.short)}</option>`).join('')}</select></div>
<div class="field"><label for="fc-dir">Front side</label><select id="fc-dir"><option value="en">English term</option><option value="tr">Turkish term</option></select></div>
<span class="badge">${due.length} due</span><span class="badge">${fresh.length} new</span><span class="badge easy">${learned} learned</span></div>
<div id="fc-stage" class="fc" aria-live="polite"></div>`;
  return {
    title: 'Flashcards', html, after(main) {
      let i = 0, shown = false, doneN = 0;
      const stage = $('#fc-stage', main);
      const draw = () => {
        if (i >= queue.length) { stage.innerHTML = `<div class="card center"><h2>${queue.length ? 'Session finished 🎉' : 'Nothing due right now'}</h2><p>${doneN} card${doneN === 1 ? '' : 's'} reviewed. ${fresh.length > queue.length ? 'There are more new cards when you are ready.' : 'Come back tomorrow for the next review.'}</p><div class="btn-row" style="justify-content:center"><a class="btn primary" href="#/flashcards?${fc ? 'course=' + fc + '&' : ''}r=${Date.now() % 1000}">Start another session</a></div></div>`; return; }
        const c = queue[i]; const dir = $('#fc-dir').value; const front = dir === 'tr' && c.tr ? c.tr : c.f; const back = dir === 'tr' && c.tr ? '<b>' + c.en + '</b><br>' + c.b : c.b;
        stage.innerHTML = `<p class="muted small">Card ${i + 1} of ${queue.length} · ${esc(courseMeta(c.c) ? courseMeta(c.c).short : '')}</p><button type="button" class="fc-card" id="fc-flip" aria-label="Flashcard. ${shown ? 'Answer shown' : 'Press to show the answer'}"><span>${shown ? '<span class="fc-back">' + back + '</span>' : '<b>' + front + '</b><small>tap to show the answer</small>'}</span></button>
<div class="btn-row" style="justify-content:center">${shown ? '<button class="btn" data-g="0" type="button">Again</button><button class="btn primary" data-g="1" type="button">Good</button><button class="btn" data-g="2" type="button">Easy</button>' : '<button class="btn primary" id="fc-show" type="button">Show answer</button>'}</div>`;
        CC.enhance(stage);
      };
      stage.addEventListener('click', e => {
        const g = e.target.closest('[data-g]');
        if (g) {
          const c = queue[i]; const st = S.cards[c.id] || { box: 0 }; const grade = +g.dataset.g;
          st.box = grade === 0 ? 0 : Math.min(st.box + grade, GAPS.length - 1); st.due = Date.now() + GAPS[st.box] * 864e5; S.cards[c.id] = st; save();
          if (grade === 0) queue.push(c); else doneN++;
          i++; shown = false; draw(); const f = $('#fc-flip', stage); if (f) f.focus(); return;
        }
        if (e.target.closest('#fc-flip') || e.target.closest('#fc-show')) { shown = !shown || !!e.target.closest('#fc-show'); draw(); const b = $('[data-g="1"]', stage) || $('#fc-flip', stage); if (b) b.focus(); }
      });
      $('#fc-c', main).addEventListener('change', e => { location.hash = '#/flashcards' + (e.target.value ? '?course=' + e.target.value : ''); });
      $('#fc-dir', main).addEventListener('change', () => { shown = false; draw(); });
      draw();
    }
  };
});

/* study plan */
route(/^\/plan$/, async () => {
  const pl = idx().plan; const start = planStart(); const cw = planWeek();
  const weeks = pl.weeks.map((w, i) => {
    const a = new Date(start.getTime()); a.setDate(a.getDate() + i * 7); const b = new Date(a.getTime()); b.setDate(b.getDate() + 6);
    const items = w.items.map(it => { const ls = it.lessons || []; const dn = ls.filter(l => S.done[l]).length; return `<div class="plan-item"><span class="col">${esc(it.col)}</span><span class="grow">${esc(it.text)}${ls.length ? `<br><span class="small">${ls.map(l => `<a href="#/lesson/${l}">${S.done[l] ? '✓ ' : ''}${esc(idx().lessons[l].title)}</a>`).join(' · ')}</span>` : ''}${it.href ? `<br><a class="small" href="${esc(it.href)}">${esc(it.link || 'Open')}</a>` : ''}</span>${ls.length ? `<span class="badge ${dn === ls.length ? 'easy' : ''}">${dn}/${ls.length}</span>` : ''}</div>`; }).join('');
    return `<div class="card plan-week ${i === cw ? 'now' : ''}"><h3>Week ${w.week} <span class="muted small">${fmtDate(a)} – ${fmtDate(b)}</span>${i === cw ? '<span class="badge accent">this week</span>' : ''}</h3>${items}</div>`;
  }).join('');
  return {
    title: 'Study plan', wide: true, html: `<h1>8-week study plan</h1><p class="lead">About 10–12 hours a week. Change the start date and the weeks move with it.</p>
<div class="filters"><div class="field"><label for="pl-start">Start date</label><input id="pl-start" type="date" value="${esc(iso(start))}"></div><a class="btn" href="#/">Back to dashboard</a></div><div class="grid">${weeks}</div>`,
    after(main) { $('#pl-start', main).addEventListener('change', e => { if (parseIso(e.target.value)) { S.plan.start = e.target.value; save(); render(); } }); }
  };
});

/* more: backup, settings */
route(/^\/more$/, async () => ({
  title: 'More', html: `<h1>More</h1>
<div class="grid two"><a class="card course-card" href="#/mocks"><span class="grow"><h3>Mock exams</h3></span></a><a class="card course-card" href="#/cheats"><span class="grow"><h3>Cheat sheets</h3></span></a><a class="card course-card" href="#/glossary"><span class="grow"><h3>Glossary (EN ↔ TR)</h3></span></a><a class="card course-card" href="#/plan"><span class="grow"><h3>Study plan</h3></span></a><a class="card course-card" data-course="bridge" href="#/course/bridge"><span class="grow"><h3>Semester 2 bridge</h3></span></a><a class="card course-card" data-course="en" href="#/lesson/en-ready"><span class="grow"><h3>English readiness test</h3></span></a><a class="card course-card" data-course="db" href="#/sql"><span class="grow"><h3>SQL playground</h3></span></a></div>
<h2>Back up your progress</h2><p>Progress is saved in this browser only. Export it to a file to move to another phone or computer, then import it there.</p>
<div class="btn-row"><button class="btn primary" id="exp" type="button">Export progress</button><label class="btn" for="imp">Import progress<input id="imp" type="file" accept="application/json,.json" class="vh"></label></div><p id="io-msg" role="status"></p>
<h2>Appearance</h2><div class="btn-row"><button class="btn" id="th2" type="button">Switch light / dark mode</button></div>
<h2>Start again</h2><div class="btn-row"><button class="btn" id="reset" type="button">Reset all progress…</button></div>
<h2>About</h2><p class="muted small">Unofficial study aid built from the public İGÜ course syllabi (checked 14 Nov 2026). All lesson text and exercises are original. Further reading named by the syllabi: Deitel &amp; Deitel, <i>C How to Program</i>; Kurose &amp; Ross, <i>Computer Networking: A Top-Down Approach</i>.</p>`,
  after(main) {
    const msg = (t, k) => { $('#io-msg', main).className = 'msg ' + k; $('#io-msg', main).textContent = t; };
    $('#exp', main).addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'crash-course-progress-' + iso(today()) + '.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      msg('Progress exported. Keep the file somewhere safe.', 'ok');
    });
    $('#imp', main).addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (!d || typeof d !== 'object' || typeof d.done !== 'object') throw new Error('not a progress file'); S = Object.assign(blank(), d); save(); applyTheme(); msg('Progress imported: ' + Object.keys(S.done).length + ' completed lessons.', 'ok'); } catch (err) { msg('That file is not a valid progress export (' + err.message + ').', 'bad'); } };
      r.readAsText(f); e.target.value = '';
    });
    $('#th2', main).addEventListener('click', toggleTheme);
    $('#reset', main).addEventListener('click', () => { if (confirm('Delete all progress on this device? Export first if you want a backup.')) { const th = S.theme; S = blank(); S.theme = th; save(); msg('Progress reset.', 'info'); } });
  }
}));
route(/^\/bridge$/, async () => ({ redirect: '/course/bridge' }));

/* search */
let SI = null;
function searchIndex() {
  if (SI) return SI; SI = [];
  Object.values(idx().lessons).forEach(l => SI.push({ k: 'Lessons', t: l.title, s: courseMeta(l.course).short + (l.week ? ' · week ' + l.week : ''), h: '#/lesson/' + l.id, x: (l.title + ' ' + l.goal).toLowerCase() }));
  idx().glossary.forEach(g => SI.push({ k: 'Glossary', t: g.t + ' — ' + g.tr, s: g.m, h: '#/glossary?q=' + encodeURIComponent(g.t), x: (g.t + ' ' + g.tr + ' ' + g.m).toLowerCase() }));
  idx().practice.forEach(p => SI.push({ k: 'Exercises', t: p.title, s: courseMeta(p.c).short + ' · ' + p.diff, h: p.href, x: p.title.toLowerCase() }));
  return SI;
}
function search(q, per) {
  const ws = q.toLowerCase().split(/\s+/).filter(Boolean); if (!ws.length) return {};
  const out = {}; for (const it of searchIndex()) { if (ws.every(w => it.x.includes(w))) { (out[it.k] = out[it.k] || []); if (out[it.k].length < per) out[it.k].push(it); } }
  return out;
}
const searchHtml = res => Object.keys(res).length ? ['Lessons', 'Glossary', 'Exercises'].filter(k => res[k]).map(k => `<h4>${k}</h4>` + res[k].map(it => `<a href="${it.h}"><b>${esc(it.t)}</b><small>${esc(it.s)}</small></a>`).join('')).join('') : '<p class="muted" style="padding:.6rem">No results. Try a shorter word.</p>';
route(/^\/search$/, async (m, params) => { const q = params.get('q') || ''; return { title: 'Search', html: `<h1>Search results for “${esc(q)}”</h1><div class="card search-page">${searchHtml(search(q, 40))}</div>` }; });

/* theme */
function applyTheme() { const t = S.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.setAttribute('data-theme', t); if (CC.data.index) chrome(); }
function toggleTheme() { S.theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; save(); applyTheme(); }

function start() {
  applyTheme();
  $('#theme-btn').addEventListener('click', toggleTheme);
  const q = $('#q'), box = $('#q-results');
  const close = () => { box.hidden = true; q.setAttribute('aria-expanded', 'false'); };
  q.addEventListener('input', () => { const v = q.value.trim(); if (v.length < 2) return close(); box.innerHTML = searchHtml(search(v, 5)); box.hidden = false; q.setAttribute('aria-expanded', 'true'); });
  q.addEventListener('keydown', e => { if (e.key === 'Enter' && q.value.trim()) { close(); location.hash = '#/search?q=' + encodeURIComponent(q.value.trim()); } if (e.key === 'Escape') close(); if (e.key === 'ArrowDown') { const a = $('a', box); if (a) { e.preventDefault(); a.focus(); } } });
  box.addEventListener('keydown', e => { const as = $$('a', box), i = as.indexOf(document.activeElement); if (e.key === 'ArrowDown' && as[i + 1]) { e.preventDefault(); as[i + 1].focus(); } if (e.key === 'ArrowUp') { e.preventDefault(); (as[i - 1] || q).focus(); } if (e.key === 'Escape') { close(); q.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) close(); else if (e.target.closest('.search-results a')) { close(); q.value = ''; } });
  window.addEventListener('hashchange', render);
  render();
}
CC.render = render; CC.ring = ring; CC.loadScript = loadScript;
return CC;
})();
