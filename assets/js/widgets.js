/* Interactive widgets. Each one is CC.widgets[name](el, args, ctx). */
(function () {
'use strict';
const { $, $$, esc } = CC; const W = CC.widgets;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
CC.shuffle = shuffle;
const src = el => { const p = $('pre.src', el); return p ? p.textContent : ''; };
const LET = 'ABCDEFGH';

/* ---------- quizzes ---------- */
function qCode(q) { return q.code ? `<pre class="code" data-lang="${esc(q.code.lang)}"><code>${esc(q.code.src)}</code></pre>` : ''; }
CC.quiz = function (el, questions, opts) {
  opts = opts || {}; const state = questions.map(() => ({ first: null, done: false }));
  const host = document.createElement('div'); el.appendChild(host);
  const drawQ = (i) => {
    const q = questions[i]; const order = shuffle(q.opts.map((o, k) => k));
    const box = $('[data-q="' + i + '"]', host);
    box.innerHTML = `<div class="q-n">Question ${i + 1} of ${questions.length}</div><div class="q-t">${q.q}</div>${qCode(q)}<div class="opts" role="group" aria-label="Answer options">${order.map((k, n) => `<button type="button" class="opt" data-k="${k}"><span class="k">${LET[n]}</span><span>${q.opts[k].h}</span></button>`).join('')}</div><div class="q-fb" aria-live="polite"></div>`;
    CC.enhance(box);
  };
  const score = () => {
    const done = state.filter(s => s.done).length, right = state.filter(s => s.first === true).length;
    const bar = $('.quiz-score', host);
    if (done < questions.length) { bar.hidden = true; return; }
    bar.hidden = false;
    bar.innerHTML = `<span>You got ${right} of ${questions.length} right on the first try.</span><button type="button" class="btn small" data-act="retry-all">Try all again</button>${opts.more ? '<button type="button" class="btn small" data-act="more">New questions</button>' : ''}`;
    if (opts.saveId) { const S = CC.S(); const prev = S.quiz[opts.saveId]; if (!prev || right > prev.best || prev.n !== questions.length) { S.quiz[opts.saveId] = { best: Math.max(right, prev && prev.n === questions.length ? prev.best : 0), n: questions.length }; CC.save(); } }
    if (opts.onDone) opts.onDone(right, questions.length);
  };
  host.innerHTML = questions.map((q, i) => `<div class="q" data-q="${i}"></div>`).join('') + '<div class="quiz-score" hidden role="status"></div>';
  questions.forEach((q, i) => drawQ(i));
  host.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (act) {
      if (act.dataset.act === 'retry-all') { state.forEach(s => { s.first = null; s.done = false; }); questions.forEach((q, i) => drawQ(i)); score(); $('.q', host).scrollIntoView({ block: 'nearest' }); }
      else if (act.dataset.act === 'retry') { const i = +act.closest('.q').dataset.q; state[i].done = false; drawQ(i); score(); }
      else if (act.dataset.act === 'more' && opts.more) opts.more();
      return;
    }
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    const box = b.closest('.q'); const i = +box.dataset.q; const q = questions[i]; const k = +b.dataset.k; const ok = !!q.opts[k].ok;
    if (state[i].first === null) state[i].first = ok; state[i].done = true;
    $$('.opt', box).forEach(o => { const kk = +o.dataset.k; o.disabled = true; if (q.opts[kk].ok) o.classList.add('right'); else if (kk === k) o.classList.add('wrong'); if (q.opts[kk].why) o.lastElementChild.insertAdjacentHTML('beforeend', `<span class="opt-why">${q.opts[kk].why}</span>`); });
    $('.q-fb', box).innerHTML = `<div class="q-why"><b class="${ok ? 'ok' : 'bad'}">${ok ? '✓ Correct.' : '✗ Not quite.'}</b> ${q.why || ''}${ok ? '' : ' <button type="button" class="btn small" data-act="retry">Try this one again</button>'}</div>`;
    CC.enhance(box); score();
  });
};
W.quiz = (el, a, ctx) => { const qs = ctx.page && ctx.page.quizzes && ctx.page.quizzes[+a.k]; if (!qs) throw new Error('quiz data missing'); CC.quiz(el, qs, { saveId: (ctx.lessonId || 'page') + ':' + a.k }); };
function bankPick(bank, tag) { if (!tag || tag === 'all') return bank; const tags = tag.split(','); return bank.filter(q => tags.includes(q.tag)); }
W.mcq = async (el, a, ctx) => {
  const data = ctx.course && ctx.courseId === a.course ? ctx.course : await CC.course(a.course);
  const pool = bankPick(data.bank, a.tag); const n = Math.min(+a.n || 5, pool.length);
  if (!pool.length) { el.innerHTML = '<p class="msg warn">No questions for this topic yet.</p>'; return; }
  const draw = () => { el.innerHTML = ''; CC.quiz(el, shuffle(pool).slice(0, n), { saveId: a.save || ((ctx.lessonId || a.course) + ':mcq:' + a.tag), more: pool.length > n ? () => { draw(); el.scrollIntoView({ block: 'start' }); } : null }); };
  draw();
};
W.mockexam = async (el, a, ctx) => {
  const c = CC.courseMeta(a.course); const cfg = c.mock[a.kind]; const data = ctx.course; const L = CC.data.index.lessons;
  const pool = data.bank.filter(q => { const l = L[c.id + '-' + q.tag]; return a.kind === 'final' || (l && l.wk <= 6); });
  const id = 'mock-' + c.id + '-' + a.kind; let timer = null;
  const startScreen = () => {
    const prev = CC.S().mocks[id];
    el.innerHTML = `<div class="card"><h2>Before you start</h2><dl class="kv"><dt>Questions</dt><dd>${Math.min(cfg.n, pool.length)} multiple-choice, one correct answer each</dd><dt>Time</dt><dd>${cfg.minutes} minutes (the timer starts when you press Start)</dd><dt>Covers</dt><dd>${a.kind === 'midterm' ? 'Weeks 1–6' : 'The whole semester'}</dd><dt>Format</dt><dd>Like the real optical-form exam: no feedback until you submit.</dd>${prev ? `<dt>Last result</dt><dd>${prev.score} / ${prev.total}</dd>` : ''}</dl><div class="btn-row"><button type="button" class="btn primary" data-act="start">Start the mock exam</button></div></div>`;
  };
  const run = () => {
    const qs = shuffle(pool).slice(0, Math.min(cfg.n, pool.length)).map(q => ({ q, order: shuffle(q.opts.map((o, k) => k)), pick: null }));
    const end = Date.now() + cfg.minutes * 60000;
    el.innerHTML = `<div class="timer" role="timer" aria-live="off"><span>⏱</span><span id="mk-t"></span></div>` + qs.map((x, i) => `<div class="q" data-q="${i}"><div class="q-n">Question ${i + 1} of ${qs.length}</div><div class="q-t">${x.q.q}</div>${qCode(x.q)}<div class="opts" role="radiogroup">${x.order.map((k, n) => `<button type="button" class="opt" aria-pressed="false" data-k="${k}"><span class="k">${LET[n]}</span><span>${x.q.opts[k].h}</span></button>`).join('')}</div></div>`).join('') + '<div class="btn-row"><button type="button" class="btn primary" data-act="submit">Submit answers</button><span class="muted" id="mk-left"></span></div>';
    CC.enhance(el);
    const tick = () => { const left = Math.max(0, end - Date.now()); const mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000); const t = $('#mk-t', el); if (!t) return; t.textContent = mm + ':' + String(ss).padStart(2, '0') + ' left'; t.parentNode.classList.toggle('low', left < 5 * 60000); if (left <= 0) finish(true); };
    const finish = (timeUp) => {
      clearInterval(timer); let score = 0;
      const review = qs.map((x, i) => { const ok = x.pick !== null && x.q.opts[x.pick].ok; if (ok) score++; return `<div class="q"><div class="q-n">Question ${i + 1} — ${ok ? '<b style="color:var(--ok)">correct</b>' : x.pick === null ? '<b style="color:var(--bad)">not answered</b>' : '<b style="color:var(--bad)">wrong</b>'}</div><div class="q-t">${x.q.q}</div>${qCode(x.q)}<div class="opts">${x.order.map((k, n) => `<div class="opt ${x.q.opts[k].ok ? 'right' : k === x.pick ? 'wrong' : ''}"><span class="k">${LET[n]}</span><span>${x.q.opts[k].h}${k === x.pick ? ' <b>(your answer)</b>' : ''}${x.q.opts[k].why ? `<span class="opt-why">${x.q.opts[k].why}</span>` : ''}</span></div>`).join('')}</div>${x.q.why ? `<div class="q-why">${x.q.why}</div>` : ''}</div>`; }).join('');
      const pct = Math.round(100 * score / qs.length);
      CC.S().mocks[id] = { score, total: qs.length, ts: Date.now() }; CC.save();
      el.innerHTML = `<div class="card" role="status"><h2>${timeUp ? 'Time is up. ' : ''}Your score: ${score} / ${qs.length} (${pct}%)</h2><p>${pct >= 80 ? 'Strong result. Review the few you missed below.' : pct >= 50 ? 'A pass, but there are gaps. Read the explanations below, then revisit those lessons.' : 'Not there yet — that is what a mock is for. Read every explanation below, redo the lessons, and try again.'}</p><div class="btn-row"><button type="button" class="btn primary" data-act="start">Try again with new questions</button><a class="btn" href="#/course/${c.id}">Back to the course</a></div></div><h2>Review</h2>${review}`;
      CC.enhance(el); el.scrollIntoView();
    };
    el._finish = finish; el._qs = qs;
    timer = setInterval(tick, 1000); tick(); CC.leave.push(() => clearInterval(timer));
  };
  el.addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (act) { if (act.dataset.act === 'start') run(); else if (act.dataset.act === 'submit') { const un = el._qs.filter(x => x.pick === null).length; if (!un || confirm(un + ' question(s) are not answered. Submit anyway?')) el._finish(false); } return; }
    const b = e.target.closest('button.opt'); if (!b || !el._qs) return;
    const box = b.closest('.q'); const x = el._qs[+box.dataset.q]; x.pick = +b.dataset.k;
    $$('.opt', box).forEach(o => o.setAttribute('aria-pressed', o === b ? 'true' : 'false'));
    const left = el._qs.filter(q => q.pick === null).length; const ml = $('#mk-left', el); if (ml) ml.textContent = left ? left + ' not answered yet' : 'All answered';
  });
  startScreen();
};

/* gap-fill */
const norm = s => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').replace(/[.!?]+$/, '').trim();
W.gaps = (el, a, ctx) => {
  const items = ctx.page && ctx.page.gaps && ctx.page.gaps[+a.k]; if (!items) throw new Error('practice data missing');
  let n = 0;
  el.innerHTML = '<div class="panel">' + items.map((it, i) => `<div class="gap" data-i="${i}"><b>${i + 1}.</b> ${it.t.map((part, k) => part + (k < it.a.length ? `<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Item ${i + 1}, blank ${k + 1}" data-b="${k}">` : '')).join('')}<span class="fb" aria-live="polite"></span></div>`).join('') + '<div class="btn-row"><button type="button" class="btn primary" data-act="check">Check answers</button><button type="button" class="btn" data-act="show">Show answers</button><button type="button" class="btn" data-act="reset">Clear</button><span class="muted" role="status"></span></div></div>';
  el.addEventListener('click', e => {
    const act = e.target.closest('[data-act]'); if (!act) return;
    if (act.dataset.act === 'reset') { $$('input', el).forEach(i => { i.value = ''; i.className = ''; }); $$('.fb', el).forEach(f => f.textContent = ''); $('[role=status]', el).textContent = ''; return; }
    let right = 0, total = 0; const show = act.dataset.act === 'show';
    items.forEach((it, i) => {
      const row = $('[data-i="' + i + '"]', el); let allOk = true;
      $$('input', row).forEach((inp, k) => { total++; const ok = it.a[k].some(x => norm(x) === norm(inp.value)); if (show && !ok) { inp.value = it.a[k][0]; inp.className = ''; allOk = false; } else { inp.className = ok ? 'right' : inp.value.trim() ? 'wrong' : ''; if (ok) right++; else allOk = false; } });
      $('.fb', row).innerHTML = show || allOk ? (it.note ? it.note : (allOk && !show ? '✓' : '')) : ($$('input', row).some(x => x.value.trim()) ? 'Not yet — try again or press “Show answers”.' : '');
    });
    $('[role=status]', el).textContent = show ? 'Answers shown.' : right + ' of ' + total + ' correct';
  });
};
W.checklist = (el, a) => {
  const S = CC.S(); const upd = () => { const bs = $$('input', el); const d = bs.filter(b => b.checked).length; let n = $('.rubric-score', el); if (!n) { n = document.createElement('div'); n.className = 'rubric-score'; el.appendChild(n); } n.textContent = d + ' of ' + bs.length + ' tasks done'; };
  $$('input', el).forEach(b => { b.checked = !!S.checks[a.id + ':' + b.dataset.i]; });
  el.addEventListener('change', e => { const b = e.target; if (b.checked) S.checks[a.id + ':' + b.dataset.i] = 1; else delete S.checks[a.id + ':' + b.dataset.i]; CC.save(); upd(); }); upd();
};
W.rubric = (el) => { const upd = () => { const bs = $$('input', el); $('.rubric-score', el).textContent = bs.filter(b => b.checked).length + ' of ' + bs.length + ' points'; }; el.addEventListener('change', upd); upd(); };

/* ---------- code editor (CodeMirror with a plain-textarea fallback) ---------- */
CC.editor = async function (host, opts) {
  const ta = document.createElement('textarea'); ta.value = opts.value || ''; ta.spellcheck = false; ta.setAttribute('aria-label', opts.label || 'Code editor'); ta.rows = Math.max(6, (opts.value || '').split('\n').length + 1);
  host.appendChild(ta);
  let cm = null, marked = null;
  try {
    await CC.lib.cm();
    cm = window.CodeMirror.fromTextArea(ta, { mode: opts.mode === 'sql' ? 'text/x-sql' : 'text/x-csrc', lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true, autoCloseBrackets: true, lineWrapping: false, viewportMargin: Infinity, readOnly: !!opts.readOnly, extraKeys: { Tab: cmi => cmi.replaceSelection('    '), 'Ctrl-Enter': () => opts.onRun && opts.onRun(), 'Cmd-Enter': () => opts.onRun && opts.onRun(), Esc: cmi => { cmi.getInputField().blur(); const nx = host.parentNode.querySelector('button'); if (nx) nx.focus(); } }, screenReaderLabel: opts.label || 'Code editor' });
    if (opts.onChange) cm.on('change', () => opts.onChange(cm.getValue()));
  } catch (e) {
    ta.addEventListener('keydown', ev => { if (ev.key === 'Tab' && !ev.shiftKey) { ev.preventDefault(); const s = ta.selectionStart; ta.setRangeText('    ', s, ta.selectionEnd, 'end'); } if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && opts.onRun) opts.onRun(); });
    if (opts.onChange) ta.addEventListener('input', () => opts.onChange(ta.value));
  }
  return {
    get: () => cm ? cm.getValue() : ta.value,
    set: v => { if (cm) cm.setValue(v); else ta.value = v; },
    mark: line => { if (!cm) return; if (marked !== null) cm.removeLineClass(marked, 'background', 'cm-errline'); marked = null; if (line > 0 && line <= cm.lineCount()) { marked = line - 1; cm.addLineClass(marked, 'background', 'cm-errline'); } },
    refresh: () => cm && cm.refresh()
  };
};
const copyBtn = (getText) => async (e) => { const b = e.currentTarget; try { await navigator.clipboard.writeText(getText()); b.textContent = 'Copied ✓'; } catch (err) { b.textContent = 'Select the code and copy it'; } setTimeout(() => { b.textContent = 'Copy code'; }, 1800); };
const ONLINE_C = 'https://www.onlinegdb.com/online_c_compiler';

/* ---------- C runner ---------- */
CC.cPanel = async function (el, opts) {
  el.innerHTML = `<div class="runner"><div class="ed"></div><details class="stdin" ${opts.stdin ? 'open' : ''}><summary>Program input (what the user types)</summary><textarea rows="2" aria-label="Program input (stdin)" spellcheck="false" placeholder="Type the input here before you press Run, e.g. 5 7">${esc(opts.stdin || '')}</textarea></details><div class="runner-bar"><button type="button" class="btn primary small" data-act="run">▶ Run</button>${opts.extraButtons || ''}<button type="button" class="btn small" data-act="viz">See memory step by step</button><button type="button" class="btn small" data-act="copy">Copy code</button>${opts.starter !== undefined ? '<button type="button" class="btn small" data-act="reset">Reset code</button>' : ''}</div><div class="outp" aria-live="polite"><h4>Output</h4><pre class="out">Press Run to see the output here.</pre><div class="run-msg"></div></div></div><div class="viz"></div>`;
  const ed = await CC.editor($('.ed', el), { value: opts.code, mode: 'c', label: 'C code editor', onRun: () => run(), onChange: opts.onChange });
  const out = $('pre.out', el), msg = $('.run-msg', el), stdin = $('.stdin textarea', el);
  async function exec(code, input, trace) { await CC.lib.minic(); return window.MiniC.run(code, { stdin: input, trace: !!trace }); }
  async function run() {
    const r = await exec(ed.get(), stdin.value); ed.mark(0);
    out.textContent = r.output || (r.ok ? '(the program printed nothing)' : '');
    let h = '';
    if (!r.ok) { ed.mark(r.error.line); h = `<div class="msg bad"><b>${r.error.phase === 'compile' ? 'Compile error' : 'Runtime error'}${r.error.line ? ' on line ' + r.error.line : ''}:</b> ${esc(r.error.message)}</div>`; if (r.error.phase === 'internal') h += `<div class="msg info">This runner supports the C used in this course, but not everything. <a href="${ONLINE_C}" target="_blank" rel="noopener">Open a full online C compiler</a> and paste your code there.</div>`; }
    else if (r.needMoreInput) h = '<div class="msg info">The program asked for more input than you gave. Type the values in “Program input” above (separated by spaces or new lines), then run again.</div>';
    else if (r.exitCode) h = `<div class="msg info">The program ended with exit code ${r.exitCode}.</div>`;
    msg.innerHTML = h; return r;
  }
  el.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'run') run();
    else if (b.dataset.act === 'copy') copyBtn(() => ed.get())({ currentTarget: b });
    else if (b.dataset.act === 'reset') { if (confirm('Replace your code with the starting code?')) { ed.set(opts.starter); if (opts.onChange) opts.onChange(opts.starter); } }
    else if (b.dataset.act === 'viz') { const v = $('.viz', el); v.innerHTML = ''; await CC.memviz(v, ed.get(), stdin.value); v.scrollIntoView({ block: 'nearest' }); }
  });
  return { ed, run, exec, stdin: () => stdin.value, setMsg: h => { msg.innerHTML = h; }, out };
};
W.crun = async (el, a) => { const code = src(el); await CC.cPanel(el, { code, starter: code, stdin: (a.stdin || '').replace(/\\n/g, '\n') }); };

const normOut = s => s.replace(/\r/g, '').split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n+$/, '');
W.cexercise = async (el, a, ctx) => {
  const ex = ctx.ex; const S = CC.S(); await CC.lib.minic();
  const done = () => { S.ex[ex.id] = Date.now(); CC.save(); };
  const kindLabel = { run: 'Write the program', bug: 'Find and fix the bug', fill: 'Fill in the blanks (replace every ____)', predict: 'Predict the output — without running it' }[ex.kind];
  let h = `<p><span class="badge ${ex.diff}">${ex.diff === 'exam' ? 'exam-level' : ex.diff}</span> <span class="badge">${kindLabel}</span> ${S.ex[ex.id] ? '<span class="badge easy">solved ✓</span>' : ''}</p><div class="prompt">${ex.prompt}</div>`;
  if (ex.kind === 'predict') {
    h += `<pre class="code" data-lang="c"><code>${esc(ex.code)}</code></pre>${ex.stdin ? `<p>Input typed by the user: <code>${esc(ex.stdin)}</code></p>` : ''}<div class="field"><label for="pred">What does this program print? Type it exactly.</label><textarea id="pred" rows="4" spellcheck="false"></textarea></div><div class="btn-row"><button type="button" class="btn primary" data-act="pcheck">Check my prediction</button><button type="button" class="btn" data-act="preveal">Show the real output</button></div><div class="fb" aria-live="polite"></div>`;
    el.innerHTML = h; await CC.enhance(el);
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return; const r = window.MiniC.run(ex.code, { stdin: ex.stdin || '' }); const real = r.ok ? r.output : r.output + '\n[error: ' + r.error.message + ']';
      const fb = $('.fb', el);
      if (b.dataset.act === 'preveal') { fb.innerHTML = `<div class="outbox"><div class="outbox-h">Real output</div><pre>${esc(real)}</pre></div><p class="muted">Trace the program line by line until you see why. Then press “See memory step by step”.</p><div class="pv"></div><button type="button" class="btn small" data-act="pviz">See memory step by step</button>`; return; }
      if (b.dataset.act === 'pviz') { CC.memviz($('.pv', el), ex.code, ex.stdin || ''); return; }
      const ok = normOut($('#pred', el).value) === normOut(real);
      if (ok) { done(); fb.innerHTML = '<div class="msg ok"><b>✓ Correct!</b> That is exactly what it prints.</div>'; } else fb.innerHTML = '<div class="msg bad"><b>Not yet.</b> Go through the code one line at a time and write down each variable’s value. Try again, or show the real output.</div>';
    });
    return;
  }
  h += `<div class="cx"></div><div class="fb" aria-live="polite"></div>${ex.hint ? `<details class="reveal"><summary>Hint</summary><div class="reveal-b"><p>${ex.hint}</p></div></details>` : ''}<details class="reveal"><summary>Show the expected output</summary><div class="reveal-b exp"></div></details><details class="reveal"><summary>Show a model solution</summary><div class="reveal-b"><p class="muted">Try for at least 10 minutes first — you learn the most from your own attempt.</p><pre class="code" data-lang="c"><code>${esc(ex.solution)}</code></pre></div></details>${ex.checklist ? `<div class="widget rubric" data-widget="rubric"><div class="checklist-h">Marking checklist (how an examiner would give points)</div><ul class="checks">${ex.checklist.map(c => `<li><label><input type="checkbox"><span>${c}</span></label></li>`).join('')}</ul><div class="rubric-score"></div></div>` : ''}<p class="muted small">Runs in your browser. Need a full compiler? <a href="${ONLINE_C}" target="_blank" rel="noopener">Open an online C compiler</a>.</p>`;
  el.innerHTML = h;
  const model = () => window.MiniC.run(ex.solution, { stdin: ex.stdin || '' });
  const draft = S.drafts[ex.id];
  let t = null; const onChange = v => { clearTimeout(t); t = setTimeout(() => { if (v === ex.starter) delete S.drafts[ex.id]; else S.drafts[ex.id] = v; CC.save(); }, 800); };
  const panel = await CC.cPanel($('.cx', el), { code: draft || ex.starter, starter: ex.starter, stdin: ex.stdin || '', onChange, extraButtons: '<button type="button" class="btn small" data-act="check" style="border-color:var(--accent)">✓ Check answer</button>' });
  const m = model(); $('.exp', el).innerHTML = (ex.stdin ? `<p>With the input <code>${esc(ex.stdin)}</code> the program must print:</p>` : '<p>The program must print:</p>') + `<pre class="out">${esc(m.output)}</pre>`;
  await CC.enhance(el);
  el.addEventListener('click', async e => {
    const b = e.target.closest('[data-act="check"]'); if (!b) return; const fb = $('.fb', el);
    const code = panel.ed.get();
    if (code.includes('____')) { fb.innerHTML = '<div class="msg warn">Replace every <code>____</code> with real code first.</div>'; return; }
    const r = window.MiniC.run(code, { stdin: ex.stdin || '' }); panel.out.textContent = r.output; panel.ed.mark(r.ok ? 0 : r.error.line);
    if (!r.ok) { fb.innerHTML = `<div class="msg bad"><b>Your program stopped with an error${r.error.line ? ' on line ' + r.error.line : ''}:</b> ${esc(r.error.message)}</div>`; return; }
    if (normOut(r.output) === normOut(m.output)) { done(); fb.innerHTML = '<div class="msg ok"><b>✓ Correct!</b> Your output matches the expected output. Compare your code with the model solution to see another way to write it.</div>'; }
    else fb.innerHTML = `<div class="msg bad"><b>Not yet.</b> Your output is different from the expected output. Check spaces, new lines (\\n) and spelling carefully.</div><div class="grid two"><div><b>Your output</b><pre class="out">${esc(r.output)}</pre></div><div><b>Expected output</b><pre class="out">${esc(m.output)}</pre></div></div>`;
  });
};
W.exercises = async (el, a, ctx) => {
  const data = await CC.course('c'); const S = CC.S(); const list = data.exercises.filter(x => x.lesson === (a.lesson || ctx.lessonId));
  if (!list.length) { el.innerHTML = ''; return; }
  const kind = { run: 'write code', bug: 'find the bug', fill: 'fill the blank', predict: 'predict output' };
  el.innerHTML = `<ul class="list card">${list.map(x => `<li><a class="row" href="#/exercise/${x.id}"><span class="tick ${S.ex[x.id] ? 'done' : ''}" aria-hidden="true">✓</span><span class="grow"><b>${esc(x.title)}</b><small>${kind[x.kind]}</small></span><span class="badge ${x.diff}">${x.diff === 'exam' ? 'exam-level' : x.diff}</span></a></li>`).join('')}</ul><p class="muted small">${list.filter(x => S.ex[x.id]).length} of ${list.length} solved. Each exercise opens in its own page with a code editor.</p>`;
};

/* ---------- memory visualizer ---------- */
CC.memviz = async function (el, code, stdin) {
  await CC.lib.minic();
  const r = window.MiniC.run(code, { stdin: stdin || '', trace: true }); const steps = r.steps; const lines = code.replace(/\r/g, '').split('\n');
  if (!steps.length) { el.innerHTML = `<div class="msg bad">Could not trace this program${r.error ? ': ' + esc(r.error.message) + (r.error.line ? ' (line ' + r.error.line + ')' : '') : ''}.</div>`; return; }
  let i = 0;
  el.innerHTML = `<div class="panel"><h4>Memory step by step</h4><p class="muted small">The highlighted line is the one that runs <b>next</b>. Addresses are shown the way a debugger shows them (hexadecimal).</p><div class="btn-row"><button type="button" class="btn small" data-s="first">⏮ Start</button><button type="button" class="btn small" data-s="prev">◀ Back</button><button type="button" class="btn primary small" data-s="next">Next ▶</button><span class="muted tabnum" role="status" data-pos></span></div><div class="mv"><div class="mv-code" tabindex="0" aria-label="Program code"></div><div><div data-frames></div><h4>Output so far</h4><pre class="out" data-out></pre></div></div>${r.error ? `<div class="msg bad">The program stops with an error on line ${r.error.line}: ${esc(r.error.message)}</div>` : ''}${r.stepsCut ? '<div class="msg info">Only the first ' + steps.length + ' steps are shown.</div>' : ''}</div>`;
  const cell = v => v.el ? `<span class="mv-cells">${v.el.map((x, k) => `<span>${cell(x)}<sub>[${k}]</sub></span>`).join('')}${v.n > v.el.length ? '<span>…</span>' : ''}</span>` : v.f ? '{ ' + v.f.map(x => esc(x.name) + ': ' + cell(x)).join(', ') + ' }' : v.p !== undefined && v.p !== 0 ? `<span class="mv-ptr">${esc(v.s)}</span>` : esc(v.s);
  const flat = (st) => { const m = new Map(); st.frames.forEach(f => f.vars.forEach(v => { const walk = (x, nm) => { m.set(x.a !== undefined ? x.a : v.addr, nm); if (x.el) x.el.forEach((y, k) => walk(y, nm + '[' + k + ']')); if (x.f) x.f.forEach(y => walk(y, nm + '.' + y.name)); }; walk(Object.assign({ a: v.addr }, v), v.name); })); return m; };
  const sig = v => JSON.stringify([v.s, v.el, v.f]);
  const draw = () => {
    const st = steps[i], prev = steps[i - 1]; const names = flat(st);
    $('.mv-code', el).innerHTML = lines.map((l, n) => `<div class="mv-line ${n + 1 === st.line ? 'cur' : ''}"><i>${n + 1}</i>${CC.highlight(l, 'c') || ' '}</div>`).join('');
    const pm = new Map(); if (prev) prev.frames.forEach(f => f.vars.forEach(v => pm.set(f.fn + '/' + v.name + '/' + v.addr, sig(v))));
    $('[data-frames]', el).innerHTML = st.frames.length ? st.frames.map(f => `<div class="mv-frame"><h4>${esc(f.fn)}</h4><div class="tablewrap" style="border:0;margin:0"><table><thead><tr><th>Name</th><th>Type</th><th>Address</th><th>Value</th></tr></thead><tbody>${f.vars.map(v => { const chg = prev && pm.get(f.fn + '/' + v.name + '/' + v.addr) !== sig(v); const tgt = v.p ? names.get(v.p) : null; return `<tr class="${chg ? 'chg' : ''}"><td><b>${esc(v.name)}</b></td><td>${esc(v.type)}</td><td>0x${v.addr.toString(16)}</td><td>${cell(v)}${v.p ? ` <span class="mv-ptr">→ ${tgt ? esc(tgt) : 'memory'}</span>` : ''}</td></tr>`; }).join('') || '<tr><td colspan="4">no variables yet</td></tr>'}</tbody></table></div></div>`).join('') : '<p class="muted">The program has finished; its variables no longer exist.</p>';
    $('[data-out]', el).textContent = st.outText || '';
    $('[data-pos]', el).textContent = 'Step ' + (i + 1) + ' of ' + steps.length + (st.note ? ' — ' + st.note : ' — next: line ' + st.line);
    const cur = $('.mv-line.cur', el); if (cur && cur.scrollIntoView) { const box = $('.mv-code', el); if (cur.offsetTop < box.scrollTop || cur.offsetTop > box.scrollTop + box.clientHeight - 30) box.scrollTop = cur.offsetTop - 40; }
  };
  el.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b) return; i = b.dataset.s === 'first' ? 0 : b.dataset.s === 'prev' ? Math.max(0, i - 1) : Math.min(steps.length - 1, i + 1); draw(); });
  el.addEventListener('keydown', e => { if (e.target.closest('.mv-code')) { if (e.key === 'ArrowRight') { i = Math.min(steps.length - 1, i + 1); draw(); } if (e.key === 'ArrowLeft') { i = Math.max(0, i - 1); draw(); } } });
  draw();
};
W.memviz = async (el, a) => { const code = src(el); const host = document.createElement('div'); el.appendChild(host); await CC.memviz(host, code, (a.stdin || '').replace(/\\n/g, '\n')); };

/* ---------- SQL ---------- */
CC.db = {
  async fresh() { const SQL = await CC.lib.sql(); const data = await CC.course('db'); const db = new SQL.Database(); db.run(data.extra.seed); return db; },
  async shared() { if (!this._db) this._db = await this.fresh(); return this._db; },
  async reset() { if (this._db) this._db.close(); this._db = null; return this.shared(); }
};
function resTable(r, max) {
  if (!r) return '<p class="muted">No rows returned.</p>'; max = max || 200;
  return `<div class="sqlres" tabindex="0" role="region" aria-label="Query result"><table><thead><tr>${r.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${r.values.slice(0, max).map(row => `<tr>${row.map(v => v === null ? '<td class="null">NULL</td>' : `<td${typeof v === 'number' ? ' class="num"' : ''}>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="muted small">${r.values.length} row${r.values.length === 1 ? '' : 's'}${r.values.length > max ? ' (first ' + max + ' shown)' : ''}</p>`;
}
function sqlHint(msg, sql) {
  const s = sql.toUpperCase();
  if (/\bTOP\s+\d/.test(s)) return 'This playground runs SQLite. <code>TOP n</code> is SQL Server syntax — here, put <code>LIMIT n</code> at the end of the query instead.';
  if (/GETDATE\(\)/.test(s)) return 'This playground runs SQLite. Use <code>date(\'now\')</code> here; <code>GETDATE()</code> is the SQL Server version.';
  if (/IDENTITY\s*\(/.test(s)) return 'This playground runs SQLite. Use <code>INTEGER PRIMARY KEY AUTOINCREMENT</code> here; <code>IDENTITY(1,1)</code> is the SQL Server version.';
  if (/\b(GRANT|REVOKE|DENY)\b/.test(s)) return 'SQLite has no users or permissions, so GRANT / REVOKE / DENY cannot run here. They work in SQL Server.';
  if (/no such table/i.test(msg)) return 'Check the table name in the schema list (Students, Courses, Instructors, Enrollments, Departments).';
  if (/no such column/i.test(msg)) return 'Check the column name in the schema list. Text values need single quotes: <code>\'Istanbul\'</code>.';
  if (/syntax error/i.test(msg)) return 'Check commas between columns, matching parentheses and quotes, and the clause order: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY.';
  if (/(FOREIGN KEY|UNIQUE|NOT NULL|CHECK) constraint/i.test(msg)) return 'A constraint stopped this change. That is the database protecting the data — read which rule was broken.';
  return '';
}
async function schemaHtml(db) {
  const t = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
  if (!t.length) return '';
  return '<ul class="schema">' + t[0].values.map(([n]) => { const cols = db.exec('PRAGMA table_info(' + JSON.stringify(n) + ')')[0].values; const fks = db.exec('PRAGMA foreign_key_list(' + JSON.stringify(n) + ')'); const fk = new Map(fks.length ? fks[0].values.map(v => [v[3], v[2]]) : []); return `<li><b>${esc(n)}</b> (${cols.map(c => `<code>${esc(c[1])}</code>${c[5] ? ' <span class="badge">PK</span>' : ''}${fk.has(c[1]) ? ` <span class="badge">FK → ${esc(fk.get(c[1]))}</span>` : ''}`).join(', ')})</li>`; }).join('') + '</ul>';
}
function execAll(db, sql) {
  const res = db.exec(sql); return { res, changed: db.getRowsModified() };
}
CC.sqlPanel = async function (el, opts) {
  el.innerHTML = `<div class="runner"><div class="ed"></div><div class="runner-bar"><button type="button" class="btn primary small" data-act="run">▶ Run</button>${opts.extraButtons || ''}<button type="button" class="btn small" data-act="resetdb">Reset database</button><button type="button" class="btn small" data-act="copy">Copy code</button></div><div class="outp" aria-live="polite"><h4>Result</h4><div class="sql-out"><p class="muted">Press Run (or Ctrl+Enter) to see the result.</p></div></div></div><details class="reveal" ${opts.schemaOpen ? 'open' : ''}><summary>Tables in the sample database</summary><div class="reveal-b sch"><p class="muted">Loading…</p></div></details>`;
  const ed = await CC.editor($('.ed', el), { value: opts.code, mode: 'sql', label: 'SQL editor', onRun: () => run(), onChange: opts.onChange });
  const out = $('.sql-out', el);
  const refreshSchema = async () => { $('.sch', el).innerHTML = await schemaHtml(await CC.db.shared()); };
  async function run() {
    const db = await CC.db.shared(); const sql = ed.get();
    try {
      const { res, changed } = execAll(db, sql);
      out.innerHTML = res.length ? res.map(r => resTable(r)).join('') : (/^\s*(select|with)\b/i.test(sql.replace(/--.*$/gm, '')) ? '<p class="msg info">The query ran, but no rows match.</p>' : `<p class="msg ok">Done. ${changed} row${changed === 1 ? '' : 's'} changed.</p>`);
      if (!/^\s*select\b/i.test(sql)) refreshSchema();
    } catch (e) { const hint = sqlHint(e.message, sql); out.innerHTML = `<div class="msg bad"><b>SQL error:</b> ${esc(e.message)}</div>${hint ? `<div class="msg info">${hint}</div>` : ''}`; }
  }
  el.addEventListener('click', async e => {
    const b = e.target.closest('[data-act]'); if (!b) return;
    if (b.dataset.act === 'run') run();
    else if (b.dataset.act === 'copy') copyBtn(() => ed.get())({ currentTarget: b });
    else if (b.dataset.act === 'resetdb') { await CC.db.reset(); await refreshSchema(); out.innerHTML = '<p class="msg info">Database reset to the original sample data.</p>'; }
  });
  refreshSchema();
  return { ed, run, out };
};
W.sqlrun = async (el, a) => { const code = src(el); const host = document.createElement('div'); el.appendChild(host); await CC.sqlPanel(host, { code, schemaOpen: !!a.free }); };
const lastSet = res => res.length ? res[res.length - 1] : { columns: [], values: [] };
const normRow = row => JSON.stringify(row.map(v => typeof v === 'number' ? Math.round(v * 1e6) / 1e6 : v));
CC.sqlEval = async function (sql, ch) { const db = await CC.db.fresh(); try { let res = db.exec(sql); if (ch.check) res = db.exec(ch.check); return { set: lastSet(res) }; } catch (e) { return { err: e.message }; } finally { db.close(); } };
CC.sqlCompare = function (a, b, ordered) {
  if (a.values.length && b.values.length && a.columns.length !== b.columns.length) return `Your result has ${a.columns.length} column${a.columns.length === 1 ? '' : 's'}, but ${b.columns.length} ${b.columns.length === 1 ? 'is' : 'are'} expected. Select exactly the columns the task asks for.`;
  if (a.values.length !== b.values.length) return `Your result has ${a.values.length} row${a.values.length === 1 ? '' : 's'}, but ${b.values.length} ${b.values.length === 1 ? 'is' : 'are'} expected. Check your WHERE / JOIN conditions.`;
  const x = a.values.map(normRow), y = b.values.map(normRow);
  if (x.every((r, i) => r === y[i])) return '';
  const xs = x.slice().sort(), ys = y.slice().sort();
  if (xs.every((r, i) => r === ys[i])) return ordered ? 'You have the right rows, but in the wrong order. Check your ORDER BY.' : '';
  return 'The number of rows is right, but some values are different. Compare your result with the expected result below.';
};
W.sqlchallenge = async (el, a, ctx) => {
  const ch = ctx.ch; const S = CC.S();
  el.innerHTML = `<p><span class="badge ${ch.diff}">${ch.diff === 'exam' ? 'exam-level' : ch.diff}</span> <span class="badge">${esc(ch.topic)}</span> ${S.ex[ch.id] ? '<span class="badge easy">solved ✓</span>' : ''}</p><div class="prompt">${ch.prompt}</div><div class="sx"></div><div class="fb" aria-live="polite"></div>${ch.hint ? `<details class="reveal"><summary>Hint</summary><div class="reveal-b"><p>${ch.hint}</p></div></details>` : ''}<details class="reveal"><summary>Show the expected result</summary><div class="reveal-b exp"></div></details><details class="reveal"><summary>Show a model query</summary><div class="reveal-b"><pre class="code" data-lang="sql"><code>${esc(ch.sql)}</code></pre>${ch.check ? '<p class="muted small">Your answer is checked by running this afterwards: <code>' + esc(ch.check) + '</code></p>' : ''}</div></details>`;
  let t = null; const onChange = v => { clearTimeout(t); t = setTimeout(() => { if (v.trim()) S.drafts[ch.id] = v; else delete S.drafts[ch.id]; CC.save(); }, 800); };
  const panel = await CC.sqlPanel($('.sx', el), { code: S.drafts[ch.id] || '-- Write your SQL here\n', onChange, extraButtons: '<button type="button" class="btn small" data-act="check" style="border-color:var(--accent)">✓ Check answer</button>' });
  const model = await CC.sqlEval(ch.sql, ch);
  $('.exp', el).innerHTML = model.err ? '<p class="msg bad">Model query failed: ' + esc(model.err) + '</p>' : (ch.check ? '<p class="muted small">After your statement runs, the check query must return:</p>' : '') + resTable(model.set, 50);
  await CC.enhance(el);
  el.addEventListener('click', async e => {
    if (!e.target.closest('[data-act="check"]')) return; const fb = $('.fb', el); const sql = panel.ed.get();
    const r = await CC.sqlEval(sql, ch);
    if (r.err) { const hint = sqlHint(r.err, sql); fb.innerHTML = `<div class="msg bad"><b>SQL error:</b> ${esc(r.err)}</div>${hint ? `<div class="msg info">${hint}</div>` : ''}`; return; }
    const why = CC.sqlCompare(r.set, model.set, ch.ordered);
    if (!why) { S.ex[ch.id] = Date.now(); CC.save(); fb.innerHTML = '<div class="msg ok"><b>✓ Correct!</b> Your result matches the expected result. Open the model query to compare approaches.</div>'; }
    else fb.innerHTML = `<div class="msg bad"><b>Not yet.</b> ${why}</div><div class="grid two"><div><b>Your result</b>${resTable(r.set, 30)}</div><div><b>Expected</b>${resTable(model.set, 30)}</div></div>`;
  });
};
W.challenges = async (el, a, ctx) => {
  const data = await CC.course('db'); const S = CC.S(); const list = data.challenges.filter(x => x.lesson === (a.lesson || ctx.lessonId));
  if (!list.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<ul class="list card">${list.map(x => `<li><a class="row" href="#/challenge/${x.id}"><span class="tick ${S.ex[x.id] ? 'done' : ''}" aria-hidden="true">✓</span><span class="grow"><b>${esc(x.title)}</b><small>${esc(x.topic)} · checked automatically</small></span><span class="badge ${x.diff}">${x.diff === 'exam' ? 'exam-level' : x.diff}</span></a></li>`).join('')}</ul><p class="muted small">${list.filter(x => S.ex[x.id]).length} of ${list.length} solved.</p>`;
};

/* ---------- flowcharts ---------- */
let uid = 0;
function wrap(text, max) { const words = text.split(' '); const lines = ['']; words.forEach(w => { const cur = lines[lines.length - 1]; if ((cur + ' ' + w).trim().length > max && cur) lines.push(w); else lines[lines.length - 1] = (cur + ' ' + w).trim(); }); return lines; }
CC.flow = function (text) {
  const nodes = text.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const p = l.split(/\s{2,}/); const n = { id: p[0], kind: p[1], text: p[2] || '', col: 0 };
    (p.slice(3).join(' ').split(/\s+/)).forEach(o => { if (o.startsWith('yes:')) n.yes = o.slice(4); else if (o.startsWith('no:')) n.no = o.slice(3); else if (o.startsWith('->')) n.next = o.slice(2); else if (o === '@right') n.col = 1; });
    return n;
  });
  const by = {}; nodes.forEach(n => by[n.id] = n);
  let last0 = -1, maxR = -1;
  nodes.forEach((n, i) => {
    if (n.col === 1) { const prev = nodes[i - 1]; const ref = nodes.find(m => m.yes === n.id || m.no === n.id || m.next === n.id); n.row = prev && prev.col === 1 ? prev.row + 1 : ref && ref.row !== undefined ? ref.row + 1 : last0 + 1; maxR = Math.max(maxR, n.row); }
    else { const prev = nodes[i - 1]; n.row = Math.max(last0 + 1, prev && prev.col === 1 ? maxR + 1 : 0); last0 = n.row; }
  });
  nodes.forEach((n, i) => {
    if (n.kind === 'end') return;
    let nx = null; for (let k = i + 1; k < nodes.length; k++) { if (n.col === 1 || nodes[k].col === 0) { nx = nodes[k].id; break; } }
    if (n.kind === 'dec') { if (!n.yes) n.yes = nx; if (!n.no) n.no = nx; } else if (!n.next) n.next = nx;
  });
  const hasR = nodes.some(n => n.col === 1); const X = [150, 400], ROW = 92, Y0 = 36; const rows = Math.max(...nodes.map(n => n.row)) + 1;
  const Wd = hasR ? 500 : 300, Hd = Y0 + (rows - 1) * ROW + 44; const id = 'fl' + (++uid);
  const hw = n => n.kind === 'dec' ? 88 : 80, hh = n => n.kind === 'dec' ? 34 : n.kind === 'start' || n.kind === 'end' ? 19 : 23;
  const cx = n => X[n.col], cy = n => Y0 + n.row * ROW;
  let g = '', lab = '';
  const edge = (a, b, label) => {
    if (!b) return; let d, lx, ly; const ax = cx(a), ay = cy(a), bx = cx(b), bY = cy(b);
    if (a.col === b.col && b.row === a.row + 1) { d = `M${ax},${ay + hh(a)} L${bx},${bY - hh(b) - 2}`; lx = ax + 8; ly = ay + hh(a) + 15; }
    else if (b.col > a.col) { if (b.row === a.row) { d = `M${ax + hw(a)},${ay} L${bx - hw(b) - 2},${bY}`; } else d = `M${ax + hw(a)},${ay} L${bx},${ay} L${bx},${bY - hh(b) - 2}`; lx = ax + hw(a) + 6; ly = ay - 7; }
    else if (b.col < a.col) { const my = bY - hh(b) - 16; if (b.row > a.row) d = `M${ax},${ay + hh(a)} L${ax},${my} L${bx},${my} L${bx},${bY - hh(b) - 2}`; else d = `M${ax + hw(a)},${ay} L${ax + 110},${ay} L${ax + 110},${bY} L${bx + hw(b) + 2},${bY}`; lx = ax + 8; ly = ay + hh(a) + 15; }
    else if (b.row <= a.row) { const Lx = ax + (a.col ? 112 : -112), s = a.col ? 1 : -1; d = `M${ax + s * hw(a)},${ay} L${Lx},${ay} L${Lx},${bY} L${bx + s * (hw(b) + 2)},${bY}`; lx = ax + s * hw(a) + (s < 0 ? -30 : 6); ly = ay - 7; }
    else { const Rx = ax + 112; d = `M${ax + hw(a)},${ay} L${Rx},${ay} L${Rx},${bY} L${bx + hw(b) + 2},${bY}`; lx = ax + hw(a) + 6; ly = ay - 7; }
    g += `<path class="e" d="${d}" marker-end="url(#${id})"/>`; if (label) lab += `<text class="lbl" x="${lx}" y="${ly}">${label}</text>`;
  };
  nodes.forEach(n => { if (n.kind === 'dec') { edge(n, by[n.yes], 'Yes'); edge(n, by[n.no], 'No'); } else if (n.next) edge(n, by[n.next]); });
  let shapes = '';
  nodes.forEach(n => {
    const x = cx(n), y = cy(n), w = hw(n), h = hh(n);
    if (n.kind === 'start' || n.kind === 'end') shapes += `<rect class="n acc" x="${x - w + 14}" y="${y - h}" width="${2 * w - 28}" height="${2 * h}" rx="${h}"/>`;
    else if (n.kind === 'io') shapes += `<polygon class="n" points="${x - w + 12},${y - h} ${x + w},${y - h} ${x + w - 12},${y + h} ${x - w},${y + h}"/>`;
    else if (n.kind === 'dec') shapes += `<polygon class="n" points="${x},${y - h} ${x + w},${y} ${x},${y + h} ${x - w},${y}"/>`;
    else shapes += `<rect class="n" x="${x - w}" y="${y - h}" width="${2 * w}" height="${2 * h}" rx="3"/>`;
    const ls = wrap(n.text, n.kind === 'dec' ? 14 : 21); const y0 = y - (ls.length - 1) * 7.5 + 4.5;
    shapes += `<text text-anchor="middle" x="${x}" y="${y0}">${ls.map((t, k) => `<tspan x="${x}" dy="${k ? 15 : 0}">${esc(t)}</tspan>`).join('')}</text>`;
  });
  const kindName = { start: 'Start', end: 'End', io: 'Input/output', proc: 'Process', dec: 'Decision' };
  const num = {}; nodes.forEach((n, i) => num[n.id] = i + 1);
  const alt = 'Flowchart with ' + nodes.length + ' steps. ' + nodes.map((n, i) => `${i + 1}. ${kindName[n.kind] || n.kind}: ${n.text}` + (n.kind === 'dec' ? ` — if yes go to step ${num[n.yes]}, if no go to step ${num[n.no]}` : n.next && num[n.next] !== i + 2 ? ` — then go to step ${num[n.next]}` : '')).join('. ') + '.';
  return `<figure class="diagram"><svg viewBox="0 0 ${Wd} ${Hd}" width="${Wd}" role="img" aria-label="${esc(alt)}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrow" d="M0,0 L10,5 L0,10 z"/></marker></defs>${g}${shapes}${lab}</svg></figure>`;
};
W.flow = (el) => { el.insertAdjacentHTML('beforeend', CC.flow(src(el))); };

/* ---------- ER diagrams ---------- */
CC.erd = function (text) {
  const ents = [], rels = [];
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
    let m = /^(\w+)\s+(\S+)--(\S+)\s+(\w+)\s*(?::\s*(.*))?$/.exec(l);
    if (m) { rels.push({ a: m[1], ca: m[2], cb: m[3], b: m[4], label: m[5] || '' }); return; }
    m = /^(\w+)\s*:\s*(.*)$/.exec(l); if (m) ents.push({ name: m[1], attrs: m[2].split(',').map(s => s.trim()).filter(Boolean) });
  });
  const BW = 190, GX = 110, LH = 19; const colY = [16, 16];
  ents.forEach((e, i) => { e.col = i % 2; e.h = 30 + e.attrs.length * LH + 8; e.x = 14 + e.col * (BW + GX); e.y = colY[e.col]; colY[e.col] += e.h + 56; });
  const Wd = 14 * 2 + BW * 2 + GX, Hd = Math.max(colY[0], colY[1]) - 30; const by = {}; ents.forEach(e => by[e.name] = e);
  const clip = (e, tx, ty) => { const cx = e.x + BW / 2, cy = e.y + e.h / 2; const dx = tx - cx, dy = ty - cy; const s = Math.min(dx ? (BW / 2) / Math.abs(dx) : 1e9, dy ? (e.h / 2) / Math.abs(dy) : 1e9); return [cx + dx * s, cy + dy * s]; };
  let g = '';
  rels.forEach(r => {
    const A = by[r.a], B = by[r.b]; if (!A || !B) return;
    const [x1, y1] = clip(A, B.x + BW / 2, B.y + B.h / 2), [x2, y2] = clip(B, A.x + BW / 2, A.y + A.h / 2);
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    g += `<line class="e" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text class="lbl h" text-anchor="middle" x="${x1 + ux * 15 - uy * 11}" y="${y1 + uy * 15 + ux * 11 + 4}">${esc(r.ca)}</text><text class="lbl h" text-anchor="middle" x="${x2 - ux * 15 - uy * 11}" y="${y2 - uy * 15 + ux * 11 + 4}">${esc(r.cb)}</text>${r.label ? `<text class="lbl" text-anchor="middle" x="${(x1 + x2) / 2 + uy * 0}" y="${(y1 + y2) / 2 - 6}">${esc(r.label)}</text>` : ''}`;
  });
  let s = '';
  ents.forEach(e => {
    s += `<rect class="n" x="${e.x}" y="${e.y}" width="${BW}" height="${e.h}" rx="4"/><rect class="n acc" x="${e.x}" y="${e.y}" width="${BW}" height="28" rx="4"/><text class="h" text-anchor="middle" x="${e.x + BW / 2}" y="${e.y + 19}">${esc(e.name)}</text>`;
    e.attrs.forEach((at, k) => { const pk = at.startsWith('*'); const nm = at.replace(/^\*/, ''); s += `<text class="${pk ? 'pk' : ''}" x="${e.x + 10}" y="${e.y + 47 + k * LH}">${esc(nm)}${pk ? ' (PK)' : ''}</text>`; });
  });
  const alt = 'Entity-relationship diagram. Entities: ' + ents.map(e => e.name + ' with attributes ' + e.attrs.map(x => x.replace(/^\*(.*)$/, '$1 (primary key)')).join(', ')).join('; ') + '. Relationships: ' + rels.map(r => `${r.a} ${r.ca} to ${r.cb} ${r.b}${r.label ? ' (' + r.label + ')' : ''}`).join('; ') + '.';
  return `<figure class="diagram"><svg viewBox="0 0 ${Wd} ${Hd}" width="${Wd}" role="img" aria-label="${esc(alt)}">${g}${s}</svg><figcaption>Underlined = primary key (PK). FK = foreign key. 1 and N show how many rows can be linked.</figcaption></figure>`;
};
W.erd = (el) => { el.insertAdjacentHTML('beforeend', CC.erd(src(el))); };

/* ---------- normalization stepper ---------- */
W.stepper = (el) => {
  const d = JSON.parse(src(el)); let i = 0; const host = document.createElement('div'); host.className = 'panel'; el.appendChild(host);
  const draw = () => {
    const st = d.stages[i];
    host.innerHTML = `<h4>${esc(d.title || 'Step by step')}</h4><div class="btn-row"><button type="button" class="btn small" data-s="-1" ${i === 0 ? 'disabled' : ''}>◀ Back</button>${d.stages.map((s, k) => `<span class="badge ${k === i ? 'accent' : ''}">${esc(s.name)}</span>`).join('')}<button type="button" class="btn primary small" data-s="1" ${i === d.stages.length - 1 ? 'disabled' : ''}>Next step ▶</button></div><div aria-live="polite"><p><b>${esc(st.name)}.</b> ${st.note}</p>${st.tables.map(t => `<p style="margin-bottom:0"><b>${esc(t.name)}</b>${t.pk ? ' <span class="muted small">— primary key: ' + esc(t.pk.join(' + ')) + '</span>' : ''}</p><div class="tablewrap"><table><thead><tr>${t.cols.map(c => `<th>${t.pk && t.pk.includes(c) ? '<u>' + esc(c) + '</u>' : esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`).join('')}${st.problem ? `<div class="msg warn"><b>Problem still here:</b> ${st.problem}</div>` : '<div class="msg ok"><b>Done:</b> every non-key column depends on the key, the whole key, and nothing but the key.</div>'}</div>`;
  };
  host.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (!b || b.disabled) return; i = Math.max(0, Math.min(d.stages.length - 1, i + +b.dataset.s)); draw(); const f = $('[data-s="1"]:not([disabled])', host) || $('[data-s="-1"]', host); if (f) f.focus(); });
  draw();
};
W.timeline = (el) => {
  const items = src(el).split('\n').map(l => l.split(' | ').map(s => s.trim())).filter(p => p.length >= 3);
  el.insertAdjacentHTML('beforeend', `<p class="muted small">Tap an event to open its card.</p><ol class="tl">${items.map(p => `<li><details><summary>${esc(p[1])}<small>${esc(p[0])}${p[3] ? ' · syllabus week ' + esc(p[3]) : ''}</small></summary><div class="tl-b">${esc(p[2])}</div></details></li>`).join('')}</ol><div class="btn-row"><button type="button" class="btn small" data-all="1">Open all</button><button type="button" class="btn small" data-all="0">Close all</button></div>`);
  el.addEventListener('click', e => { const b = e.target.closest('[data-all]'); if (b) $$('details', el).forEach(d => d.open = b.dataset.all === '1'); });
};

/* ---------- ordering and matching games ---------- */
W.order = (el, a, ctx) => {
  const g = ctx.course.extra.games[a.set]; if (!g) throw new Error('game not found: ' + a.set);
  let cur = shuffle(g.items); const host = document.createElement('div'); host.className = 'panel'; el.appendChild(host);
  const draw = (res) => {
    host.innerHTML = `<h4>${esc(g.title)}</h4><p class="muted small">${esc(g.hint || 'Put the items in the right order. Use the arrow buttons (or drag on a computer).')}</p><ol class="order">${cur.map((it, i) => `<li draggable="true" data-i="${i}" class="${res ? (it === g.items[i] ? 'right' : 'wrong') : ''}"><span class="grow">${esc(it)}</span><button type="button" data-m="-1" aria-label="Move ${esc(it)} up" ${i === 0 ? 'disabled' : ''}>▲</button><button type="button" data-m="1" aria-label="Move ${esc(it)} down" ${i === cur.length - 1 ? 'disabled' : ''}>▼</button></li>`).join('')}</ol><div class="btn-row"><button type="button" class="btn primary" data-act="check">Check order</button><button type="button" class="btn" data-act="mix">Shuffle</button><span role="status">${res ? (cur.every((it, i) => it === g.items[i]) ? '<b style="color:var(--ok)">✓ Perfect order!</b>' : 'Green items are in the right place. Move the red ones and check again.') : ''}</span></div>`;
  };
  let drag = null;
  host.addEventListener('click', e => { const m = e.target.closest('[data-m]'); if (m) { const i = +m.closest('li').dataset.i, j = i + +m.dataset.m; [cur[i], cur[j]] = [cur[j], cur[i]]; draw(); const nb = $(`li[data-i="${j}"] [data-m="${m.dataset.m}"]:not([disabled])`, host) || $(`li[data-i="${j}"] button:not([disabled])`, host); if (nb) nb.focus(); return; } const b = e.target.closest('[data-act]'); if (!b) return; if (b.dataset.act === 'mix') { cur = shuffle(g.items); draw(); } else draw(true); });
  host.addEventListener('dragstart', e => { const li = e.target.closest('li'); if (li) { drag = +li.dataset.i; e.dataTransfer.effectAllowed = 'move'; } });
  host.addEventListener('dragover', e => { if (e.target.closest('li')) e.preventDefault(); });
  host.addEventListener('drop', e => { const li = e.target.closest('li'); if (!li || drag === null) return; e.preventDefault(); const to = +li.dataset.i; const [it] = cur.splice(drag, 1); cur.splice(to, 0, it); drag = null; draw(); });
  draw();
};
W.match = (el, a, ctx) => {
  const g = ctx.course.extra.games[a.set]; if (!g) throw new Error('game not found: ' + a.set);
  const host = document.createElement('div'); host.className = 'panel'; el.appendChild(host);
  const draw = () => {
    const pairs = shuffle(g.pairs).slice(0, g.n || 8); const rights = shuffle([...new Set(g.pairs.map(p => p[1]))]);
    host.innerHTML = `<h4>${esc(g.title)}</h4><p class="muted small">Choose the match for each item, then check.</p><div class="match">${pairs.map((p, i) => `<div class="pair"><label for="${a.set}-m${i}">${esc(p[0])}</label><select id="${a.set}-m${i}" data-ans="${esc(p[1])}"><option value="">Choose…</option>${rights.map(r => `<option>${esc(r)}</option>`).join('')}</select></div>`).join('')}</div><div class="btn-row"><button type="button" class="btn primary" data-act="check">Check</button><button type="button" class="btn" data-act="new">New set</button><span role="status"></span></div>`;
  };
  host.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (!b) return; if (b.dataset.act === 'new') return draw(); let ok = 0; const ss = $$('select', host); ss.forEach(s => { const r = s.value === s.dataset.ans; s.className = r ? 'right' : 'wrong'; if (r) ok++; }); $('[role=status]', host).textContent = ok + ' of ' + ss.length + ' correct' + (ok === ss.length ? ' ✓' : ' — fix the red ones'); });
  draw();
};
})();
