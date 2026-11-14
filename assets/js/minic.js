/* MiniC — a small C interpreter for the crash course.
   Covers the C taught in a first programming course: int/char/float/double, operators,
   if/switch/loops, functions, recursion, arrays, pointers, strings, structs, stdio,
   string.h, ctype.h, math.h, simple stdlib and in-memory file I/O.
   API: MiniC.run(source, {stdin, trace, files}) -> {ok, output, error, exitCode, steps, needMoreInput, files} */
(function (root) {
'use strict';

class CError extends Error {
  constructor(msg, line) { super(msg); this.cmsg = msg; this.line = line || 0; }
}
class ExitSignal { constructor(code) { this.code = code; } }

const KW = new Set(['void','char','short','int','long','float','double','signed','unsigned','const','static','struct','typedef','if','else','while','do','for','switch','case','default','break','continue','return','sizeof','enum','extern','register','auto','volatile','goto','union']);
const PUNCT = ['<<=','>>=','...','->','++','--','<<','>>','<=','>=','==','!=','&&','||','+=','-=','*=','/=','%=','&=','|=','^=','+','-','*','/','%','=','<','>','!','~','&','|','^','?',':',';',',','.','(',')','[',']','{','}'];
const ESC = { n: 10, t: 9, r: 13, '0': 0, '\\': 92, "'": 39, '"': 34, a: 7, b: 8, f: 12, v: 11, '?': 63 };

function utf8(s) { // JS string -> "byte string"
  let o = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 128) o += ch;
    else if (c < 0x800) o += String.fromCharCode(0xC0 | c >> 6, 0x80 | c & 63);
    else if (c < 0x10000) o += String.fromCharCode(0xE0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    else o += String.fromCharCode(0xF0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
  }
  return o;
}
function unutf8(b) {
  try { return new TextDecoder('utf-8').decode(Uint8Array.from(b, ch => ch.charCodeAt(0) & 255)); }
  catch (e) { return b; }
}

/* ---------- lexer ---------- */
function lex(src, defines, depth) {
  src = src.replace(/\r\n?/g, '\n');
  const toks = []; let i = 0, line = 1, bol = true;
  const fail = (m) => { throw new CError(m, line); };
  const readEsc = () => { // after backslash
    const c = src[i++];
    if (c === 'x') { let h = ''; while (/[0-9a-fA-F]/.test(src[i] || '')) h += src[i++]; return parseInt(h, 16) & 255; }
    if (/[0-7]/.test(c)) { let o = c; while (o.length < 3 && /[0-7]/.test(src[i] || '')) o += src[i++]; return parseInt(o, 8) & 255; }
    if (c in ESC) return ESC[c];
    fail("unknown escape sequence '\\" + c + "'");
  };
  while (i < src.length) {
    const c = src[i];
    if (c === '\n') { line++; i++; bol = true; continue; }
    if (c === ' ' || c === '\t') { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2); if (e < 0) fail('this comment /* is never closed with */');
      for (let k = i; k < e; k++) if (src[k] === '\n') line++;
      i = e + 2; continue;
    }
    if (c === '#' && bol) {
      let e = i; while (e < src.length && src[e] !== '\n') e++;
      const text = src.slice(i + 1, e).replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, ' ').trim();
      const m = /^define\s+([A-Za-z_]\w*)(\()?\s*(.*)$/.exec(text);
      if (m) {
        if (m[2]) fail('macros with parameters (#define ' + m[1] + '(...)) are not supported in this runner. Write a function instead.');
        defines.set(m[1], lex(m[3], defines, 1).toks.slice(0, -1));
      }
      i = e; continue;
    }
    bol = false;
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      let m = /^0[xX][0-9a-fA-F]+/.exec(src.slice(i, i + 40));
      if (m) { i += m[0].length; let suf = ''; while (/[uUlL]/.test(src[i] || '')) suf += src[i++]; toks.push({ k: 'num', v: parseInt(m[0], 16), f: false, suf: suf.toLowerCase(), line }); continue; }
      m = /^(\d+\.?\d*([eE][+-]?\d+)?|\.\d+([eE][+-]?\d+)?)/.exec(src.slice(i, i + 60));
      const txt = m[0]; i += txt.length; let suf = '';
      while (/[uUlLfF]/.test(src[i] || '')) suf += src[i++];
      if (/[A-Za-z_]/.test(src[i] || '')) fail("invalid number '" + txt + suf + src[i] + "' (a name cannot start with a digit)");
      const isF = /[.eE]/.test(txt) || /f/i.test(suf);
      toks.push({ k: 'num', v: isF ? parseFloat(txt) : (txt.length > 1 && txt[0] === '0' ? parseInt(txt, 8) : parseInt(txt, 10)), f: isF, suf: suf.toLowerCase(), line });
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i + 1; while (j < src.length && /\w/.test(src[j])) j++;
      const w = src.slice(i, j); i = j;
      toks.push({ k: KW.has(w) ? 'kw' : 'id', v: w, line }); continue;
    }
    if (c === '"') {
      i++; let s = '';
      for (;;) {
        if (i >= src.length || src[i] === '\n') fail('this string is missing its closing "');
        if (src[i] === '"') { i++; break; }
        if (src[i] === '\\') { i++; if (src[i] === '\n') { i++; line++; continue; } s += String.fromCharCode(readEsc()); }
        else { const cp = src.codePointAt(i); const ch = String.fromCodePoint(cp); s += utf8(ch); i += ch.length; }
      }
      const last = toks[toks.length - 1];
      if (last && last.k === 'str') last.v += s; else toks.push({ k: 'str', v: s, line });
      continue;
    }
    if (c === "'") {
      i++; let v;
      if (src[i] === '\\') { i++; v = readEsc(); }
      else if (src[i] === "'" || src[i] === undefined || src[i] === '\n') fail("empty character constant ''");
      else { v = src.charCodeAt(i); i++; }
      if (src[i] !== "'") fail("a character constant holds exactly one character, like 'A'. For text use double quotes: \"...\"");
      i++; toks.push({ k: 'chr', v, line }); continue;
    }
    let matched = false;
    for (const pch of PUNCT) if (src.startsWith(pch, i)) { toks.push({ k: 'p', v: pch, line }); i += pch.length; matched = true; break; }
    if (!matched) fail("unexpected character '" + c + "'");
  }
  toks.push({ k: 'eof', v: '<end of file>', line });
  if (depth) return { toks };
  // macro expansion
  const out = [];
  const expand = (t, d) => {
    if (t.k === 'id' && defines.has(t.v) && d < 12) for (const r of defines.get(t.v)) expand(Object.assign({}, r, { line: t.line }), d + 1);
    else out.push(t);
  };
  for (const t of toks) expand(t, 0);
  // re-merge adjacent strings produced by macros
  return { toks: out };
}

/* ---------- types ---------- */
const mk = (k, o) => Object.assign({ k }, o || {});
const TY = { void: mk('void'), char: mk('char'), uchar: mk('char', { u: 1 }), short: mk('short'), ushort: mk('short', { u: 1 }), int: mk('int'), uint: mk('int', { u: 1 }), long: mk('long'), ulong: mk('long', { u: 1 }), float: mk('float'), double: mk('double') };
const ptr = t => ({ k: 'ptr', to: t });
const isInt = t => t.k === 'char' || t.k === 'short' || t.k === 'int' || t.k === 'long';
const isFlt = t => t.k === 'float' || t.k === 'double';
const isNum = t => isInt(t) || isFlt(t);
const isPtr = t => t.k === 'ptr';
function layout(st) {
  if (st.size !== undefined) return;
  if (!st.fields) throw new CError("struct '" + st.name + "' is used but its fields were never defined");
  let off = 0, al = 1;
  for (const f of st.fields) { const a = alignOf(f.t); off = Math.ceil(off / a) * a; f.off = off; off += sizeOf(f.t); al = Math.max(al, a); }
  st.align = al; st.size = Math.max(Math.ceil(off / al) * al, 1);
}
function sizeOf(t) {
  switch (t.k) {
    case 'char': return 1; case 'short': return 2; case 'int': return 4; case 'long': return 8;
    case 'float': return 4; case 'double': return 8; case 'ptr': return 8;
    case 'arr': return sizeOf(t.of) * t.n;
    case 'struct': layout(t); return t.size;
    case 'void': return 1;
  }
  return 1;
}
function alignOf(t) { if (t.k === 'arr') return alignOf(t.of); if (t.k === 'struct') { layout(t); return t.align; } return sizeOf(t); }
function tname(t) {
  switch (t.k) {
    case 'ptr': return tname(t.to) + '*';
    case 'arr': { let dims = '', b = t; while (b.k === 'arr') { dims += '[' + (b.n == null ? '' : b.n) + ']'; b = b.of; } return tname(b) + dims; }
    case 'struct': return 'struct ' + (t.name || '');
    case 'func': return 'function';
    default: return (t.u ? 'unsigned ' : '') + t.k;
  }
}

/* ---------- parser ---------- */
function parse(src) {
  const defines = new Map();
  const toks = lex(src, defines, 0).toks;
  let p = 0;
  const typedefs = new Map([['FILE', TY.void], ['size_t', TY.ulong], ['bool', TY.int]]), structs = new Map(), enums = new Map();
  const peek = (o) => toks[Math.min(p + (o || 0), toks.length - 1)];
  const isP = (v, o) => { const t = peek(o); return (t.k === 'p' || t.k === 'kw') && t.v === v; };
  const accept = v => isP(v) ? (p++, true) : false;
  const desc = t => t.k === 'eof' ? 'the end of the file' : t.k === 'str' ? 'a string' : "'" + (t.k === 'chr' ? String.fromCharCode(t.v) : t.v) + "'";
  const fail = (m, line) => { throw new CError(m, line || peek().line); };
  const expect = v => {
    if (accept(v)) return;
    const prev = toks[Math.max(p - 1, 0)];
    if (v === ';') fail("missing ';' at the end of this statement (found " + desc(peek()) + ' instead)', prev.line);
    fail("expected '" + v + "' but found " + desc(peek()), peek().k === 'eof' ? prev.line : peek().line);
  };
  const TYPEKW = new Set(['void','char','short','int','long','float','double','signed','unsigned','const','static','struct','enum','typedef','extern','register','volatile','auto','union']);
  const isTypeStart = (o) => { const t = peek(o); return (t.k === 'kw' && TYPEKW.has(t.v)) || (t.k === 'id' && typedefs.has(t.v)); };

  function structSpec() {
    let name = null; if (peek().k === 'id') name = toks[p++].v;
    let st = name ? structs.get(name) : null;
    if (!st) { st = { k: 'struct', name, fields: null }; if (name) structs.set(name, st); }
    if (accept('{')) {
      const fields = [];
      while (!isP('}')) {
        const sp = declSpec(); if (!sp) fail('expected a field declaration inside the struct');
        do { const d = declarator(sp.type); if (!d.name) fail('struct field needs a name'); fields.push({ name: d.name, t: fixArr(d.t) }); } while (accept(','));
        expect(';');
      }
      expect('}'); st.fields = fields;
    }
    return st;
  }
  function fixArr(t) { if (t.k === 'arr') { if (!t.ne) fail('a struct field array needs a size'); return { k: 'arr', of: fixArr(t.of), n: constInt(t.ne) }; } return t; }
  function enumSpec() {
    if (peek().k === 'id') p++;
    if (accept('{')) {
      let v = 0;
      while (!isP('}')) {
        const nm = toks[p++]; if (nm.k !== 'id') fail('expected a name inside enum');
        if (accept('=')) { const e = cond(); v = constInt(e); }
        enums.set(nm.v, v++);
        if (!accept(',')) break;
      }
      expect('}');
    }
  }
  function constInt(e) {
    if (e.n === 'num' || e.n === 'chr') return e.v | 0;
    if (e.n === 'id' && enums.has(e.v)) return enums.get(e.v);
    if (e.n === 'un' && e.op === '-') return -constInt(e.e);
    if (e.n === 'bin') { const a = constInt(e.l), b = constInt(e.r); switch (e.op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return Math.trunc(a / b); case '<<': return a << b; case '|': return a | b; } }
    fail('expected a constant integer here', e.line);
  }
  function declSpec() {
    let base = null, u = false, longs = 0, sh = false, st = false, td = false, seen = false;
    for (;;) {
      const t = peek();
      if (t.k === 'kw') {
        switch (t.v) {
          case 'const': case 'volatile': case 'register': case 'extern': case 'auto': p++; seen = true; continue;
          case 'static': st = true; p++; seen = true; continue;
          case 'typedef': td = true; p++; seen = true; continue;
          case 'signed': p++; seen = true; continue;
          case 'unsigned': u = true; p++; seen = true; continue;
          case 'short': sh = true; p++; seen = true; continue;
          case 'long': longs++; p++; seen = true; continue;
          case 'void': case 'char': case 'int': case 'float': case 'double': base = t.v; p++; seen = true; continue;
          case 'struct': p++; base = structSpec(); seen = true; continue;
          case 'union': fail('union is not supported in this runner');
          case 'enum': p++; enumSpec(); base = 'int'; seen = true; continue;
        }
        break;
      } else if (t.k === 'id' && base === null && !u && !longs && !sh && typedefs.has(t.v)) { base = typedefs.get(t.v); p++; seen = true; continue; }
      break;
    }
    if (!seen) return null;
    let type;
    if (base && typeof base === 'object') type = base;
    else if (base === 'void') type = TY.void;
    else if (base === 'char') type = u ? TY.uchar : TY.char;
    else if (base === 'float') type = TY.float;
    else if (base === 'double') type = TY.double;
    else if (sh) type = u ? TY.ushort : TY.short;
    else if (longs) type = u ? TY.ulong : TY.long;
    else type = u ? TY.uint : TY.int;
    return { type, isStatic: st, isTypedef: td };
  }
  function declarator(base) {
    let t = base;
    while (accept('*')) { while (accept('const')); t = ptr(t); }
    let name = null; const line = peek().line;
    if (peek().k === 'id') name = toks[p++].v;
    else if (peek().k === 'kw' && !isP('(') ) { /* abstract */ }
    if (isP('(') && name) {
      p++; const params = [];
      if (isP('void') && isP(')', 1)) p++;
      else while (!isP(')')) {
        if (accept('...')) break;
        const sp = declSpec(); if (!sp) fail("expected a parameter type (like 'int') but found " + desc(peek()));
        const d = declarator(sp.type);
        let pt = d.t; if (pt.k === 'arr') pt = ptr(pt.of);
        params.push({ name: d.name, t: pt });
        if (!accept(',')) break;
      }
      expect(')');
      return { name, t, params, isFunc: true, line };
    }
    const dims = [];
    while (accept('[')) { if (accept(']')) dims.push(null); else { const e = assign(); expect(']'); dims.push(e); } }
    for (let i = dims.length - 1; i >= 0; i--) t = { k: 'arr', of: t, n: null, ne: dims[i] };
    return { name, t, line };
  }
  function typeName() { const sp = declSpec(); if (!sp) fail('expected a type name'); return declarator(sp.type).t; }

  /* expressions */
  const BP = { '||': 1, '&&': 2, '|': 3, '^': 4, '&': 5, '==': 6, '!=': 6, '<': 7, '>': 7, '<=': 7, '>=': 7, '<<': 8, '>>': 8, '+': 9, '-': 9, '*': 10, '/': 10, '%': 10 };
  const ASG = new Set(['=', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=']);
  function primary() {
    const t = toks[p]; const line = t.line;
    if (t.k === 'num') { p++; return { n: 'num', v: t.v, f: t.f, suf: t.suf, line }; }
    if (t.k === 'chr') { p++; return { n: 'chr', v: t.v, line }; }
    if (t.k === 'str') { p++; return { n: 'str', v: t.v, line }; }
    if (t.k === 'id') { p++; if (enums.has(t.v)) return { n: 'num', v: enums.get(t.v), line }; return { n: 'id', v: t.v, line }; }
    if (accept('(')) { const e = expr(); expect(')'); return e; }
    if (t.k === 'kw' && TYPEKW.has(t.v)) fail("a declaration like '" + t.v + " ...' is not allowed here");
    fail('expected a value or expression but found ' + desc(t), t.k === 'eof' ? toks[Math.max(p - 1, 0)].line : line);
  }
  function postfix() {
    let e = primary();
    for (;;) {
      const line = peek().line;
      if (accept('[')) { const i = expr(); expect(']'); e = { n: 'idx', a: e, i, line }; }
      else if (accept('(')) { const args = []; while (!isP(')')) { args.push(assign()); if (!accept(',')) break; } expect(')'); e = { n: 'call', f: e, args, line }; }
      else if (accept('.')) { const m = toks[p++]; if (m.k !== 'id') fail("expected a field name after '.'"); e = { n: 'mem', e, m: m.v, arrow: false, line }; }
      else if (accept('->')) { const m = toks[p++]; if (m.k !== 'id') fail("expected a field name after '->'"); e = { n: 'mem', e, m: m.v, arrow: true, line }; }
      else if (accept('++')) e = { n: 'post', op: '++', e, line };
      else if (accept('--')) e = { n: 'post', op: '--', e, line };
      else return e;
    }
  }
  function unary() {
    const t = peek(); const line = t.line;
    if (t.k === 'p') {
      if (t.v === '++' || t.v === '--') { p++; return { n: 'pre', op: t.v, e: unary(), line }; }
      if ('&*+-!~'.includes(t.v) && t.v.length === 1) { p++; return { n: 'un', op: t.v, e: unary(), line }; }
      if (t.v === '(' && isTypeStart(1)) { p++; const ty = typeName(); expect(')'); return { n: 'cast', t: ty, e: unary(), line }; }
    }
    if (t.k === 'kw' && t.v === 'sizeof') {
      p++;
      if (isP('(') && isTypeStart(1)) { p++; const ty = typeName(); expect(')'); return { n: 'sizeof', t: ty, line }; }
      return { n: 'sizeof', e: unary(), line };
    }
    return postfix();
  }
  function bin(min) {
    let l = unary();
    for (;;) {
      const t = peek(); const pr = t.k === 'p' ? BP[t.v] : undefined;
      if (!pr || pr < min) break;
      p++; const r = bin(pr + 1); l = { n: 'bin', op: t.v, l, r, line: t.line };
    }
    return l;
  }
  function cond() { const c = bin(1); const line = peek().line; if (accept('?')) { const a = expr(); expect(':'); const b = cond(); return { n: 'cond', c, a, b, line }; } return c; }
  function assign() { const l = cond(); const t = peek(); if (t.k === 'p' && ASG.has(t.v)) { p++; const r = assign(); return { n: 'assign', op: t.v, l, r, line: t.line }; } return l; }
  function expr() { let e = assign(); while (isP(',')) { const line = toks[p++].line; e = { n: 'comma', l: e, r: assign(), line }; } return e; }

  /* statements */
  function initializer() {
    const line = peek().line;
    if (accept('{')) { const list = []; while (!isP('}')) { list.push(initializer()); if (!accept(',')) break; } expect('}'); return { n: 'ilist', list, line }; }
    return assign();
  }
  function block() {
    const line = peek().line; expect('{'); const body = [];
    while (!isP('}')) { if (peek().k === 'eof') fail("missing '}' — a block opened on line " + line + ' is never closed', toks[p - 1].line); body.push(stmt()); }
    p++; return { n: 'block', body, line };
  }
  function parenExpr(what) { if (!isP('(')) fail("expected '(' after '" + what + "'"); p++; const e = expr(); expect(')'); return e; }
  function stmt() {
    const t = peek(); const line = t.line;
    if (isP('{')) return block();
    if (isP(';')) { p++; return { n: 'empty', line }; }
    if (t.k === 'kw') switch (t.v) {
      case 'if': { p++; const c = parenExpr('if'); const a = stmt(); let b = null; if (accept('else')) b = stmt(); return { n: 'if', c, a, b, line }; }
      case 'while': { p++; const c = parenExpr('while'); return { n: 'while', c, body: stmt(), line }; }
      case 'do': { p++; const body = stmt(); if (!accept('while')) fail("expected 'while' after the do { ... } block"); const c = parenExpr('while'); expect(';'); return { n: 'do', c, body, line }; }
      case 'for': {
        p++; expect('('); let init = null, c = null, step = null;
        if (!accept(';')) { if (isTypeStart()) init = decl(false); else { init = { n: 'expr', e: expr(), line }; expect(';'); } }
        if (!isP(';')) c = expr(); expect(';');
        if (!isP(')')) step = expr(); expect(')');
        return { n: 'for', init, c, step, body: stmt(), line };
      }
      case 'switch': { p++; const c = parenExpr('switch'); return { n: 'switch', c, body: block(), line }; }
      case 'case': { p++; const v = cond(); if (!accept(':')) fail("expected ':' after the case value"); return { n: 'case', v, line }; }
      case 'default': { p++; if (!accept(':')) fail("expected ':' after default"); return { n: 'default', line }; }
      case 'break': p++; expect(';'); return { n: 'break', line };
      case 'continue': p++; expect(';'); return { n: 'continue', line };
      case 'return': { p++; let e = null; if (!isP(';')) e = expr(); expect(';'); return { n: 'return', e, line }; }
      case 'goto': fail('goto is not supported (and not needed) in this course');
      case 'else': fail("'else' without a matching 'if' (check your braces and semicolons)");
    }
    if (isTypeStart() && !(t.k === 'id' && !(peek(1).k === 'id' || isP('*', 1)))) return decl(false);
    const e = expr(); expect(';'); return { n: 'expr', e, line };
  }
  const funcs = [];
  function decl(global) {
    const line = peek().line;
    const sp = declSpec();
    if (!sp) fail("expected a declaration (like 'int x;') but found " + desc(peek()));
    if (accept(';')) return { n: 'empty', line };
    const items = [];
    do {
      const d = declarator(sp.type);
      if (!d.name) fail('expected a name in this declaration but found ' + desc(peek()));
      if (sp.isTypedef) { typedefs.set(d.name, d.t); continue; }
      if (d.isFunc) {
        if (isP('{')) {
          if (!global) fail('a function cannot be defined inside another function. Did you forget a closing } above?');
          const body = block(); funcs.push({ name: d.name, ret: d.t, params: d.params, body, line: d.line });
          return { n: 'empty', line };
        }
        continue; // prototype
      }
      let init = null; if (accept('=')) init = initializer();
      items.push({ name: d.name, t: d.t, init, line: d.line });
    } while (accept(','));
    expect(';');
    return { n: 'decl', items, isStatic: sp.isStatic, line };
  }
  const globals = [];
  while (peek().k !== 'eof') {
    if (!isTypeStart()) {
      const t = peek();
      if (t.k === 'id' && isP('(', 1)) fail("'" + t.v + "(' — a function definition needs a return type first, e.g. 'int " + t.v + "(...)'. If this is a statement, it must be inside a function.");
      fail('unexpected ' + desc(t) + ' outside of any function. Check that your braces { } match.');
    }
    const d = decl(true); if (d.n === 'decl') globals.push(d);
  }
  return { globals, funcs };
}

/* ---------- machine ---------- */
const UN = { un: 1 };
const BRK = 1, CNT = 2, RET = 3;
const STACK0 = 0x7ffc00, GLOB0 = 0x404000, STR0 = 0x402000, HEAP0 = 0x1a2b000;

class Machine {
  constructor(ast, opts) {
    this.ast = ast; this.o = opts || {};
    this.mem = new Map(); this.sp = STACK0; this.gp = GLOB0; this.strp = STR0; this.hp = HEAP0;
    this.globals = new Map(); this.funcs = new Map(); this.frames = []; this.strs = new Map(); this.statics = new Map();
    this.heap = []; this.out = ''; this.steps = 0; this.maxSteps = this.o.maxSteps || 4e6; this.t0 = Date.now();
    this.inp = { buf: utf8(this.o.stdin || ''), pos: 0 }; this.needMore = false;
    this.files = new Map(Object.entries(this.o.files || {}).map(([k, v]) => [k, utf8(v)])); this.fh = new Map(); this.nextFh = 0xF000;
    this.trace = !!this.o.trace; this.snaps = []; this.maxSnaps = this.o.maxSnaps || 600; this.line = 0; this.rng = 1;
    for (const f of ast.funcs) this.funcs.set(f.name, f);
  }
  err(m, line) { throw new CError(m, line || this.line); }

  /* memory */
  initMem(a, t, v) {
    if (t.k === 'arr') { const s = sizeOf(t.of); for (let i = 0; i < t.n; i++) this.initMem(a + i * s, t.of, v); }
    else if (t.k === 'struct') { layout(t); for (const f of t.fields) this.initMem(a + f.off, f.t, v); }
    else this.mem.set(a, v);
  }
  clearMem(a, t) {
    if (t.k === 'arr') { const s = sizeOf(t.of); for (let i = 0; i < t.n; i++) this.clearMem(a + i * s, t.of); }
    else if (t.k === 'struct') { for (const f of t.fields) this.clearMem(a + f.off, f.t); }
    else this.mem.delete(a);
  }
  allocStack(t) {
    const al = alignOf(t); this.sp = Math.ceil(this.sp / al) * al; const a = this.sp;
    this.sp += Math.max(sizeOf(t), 1); if (t.k === 'arr') this.sp += 8;
    if (this.sp - STACK0 > 8e6) this.err('out of stack memory (an array is too large, or recursion never stops)');
    this.initMem(a, t, UN); return a;
  }
  allocGlobal(t) { const al = alignOf(t); this.gp = Math.ceil(this.gp / al) * al; const a = this.gp; this.gp += Math.max(sizeOf(t), 1) + (t.k === 'arr' ? 8 : 0); this.initMem(a, t, 0); return a; }
  inHeap(a) { for (const b of this.heap) if (a >= b.a && a < b.a + b.n) return b; return null; }
  load(a, t, line) {
    let v = this.mem.get(a);
    if (v === undefined) { const b = this.inHeap(a); if (b && b.zero) return 0; if (b) v = UN; }
    if (v === undefined) this.err(a === 0 ? 'tried to read through a NULL pointer' : 'tried to read memory that does not belong to any variable (array index out of range, or a bad pointer)', line);
    if (v === UN) this.err('a variable or array element is used before it was given a value (uninitialized)', line);
    return v;
  }
  store(a, t, v, line) {
    if (!this.mem.has(a) && !this.inHeap(a)) this.err(a === 0 ? 'tried to write through a NULL pointer' : 'tried to write to memory that does not belong to any variable (array index out of range, buffer too small, or a bad pointer)', line);
    this.mem.set(a, this.wrap(t, v));
  }
  wrap(t, v) {
    if (t.k !== 'float' && t.k !== 'double' && !isFinite(v)) v = 0;
    switch (t.k) {
      case 'char': v = Math.trunc(v) || 0; return t.u ? v & 255 : (v << 24) >> 24;
      case 'short': v = Math.trunc(v) || 0; return t.u ? v & 65535 : (v << 16) >> 16;
      case 'int': v = Math.trunc(v) || 0; if (v > 2147483647 || v < -2147483648) v = Number(BigInt.asIntN(32, BigInt(v))); return t.u ? v >>> 0 : v | 0;
      case 'long': v = Math.trunc(v) || 0; return Number.isSafeInteger(v) ? v : Number(t.u ? BigInt.asUintN(64, BigInt(v)) : BigInt.asIntN(64, BigInt(v)));
      case 'float': return Math.fround(v);
      default: return v;
    }
  }
  copy(dst, src, t, line) {
    if (t.k === 'arr') { const s = sizeOf(t.of); for (let i = 0; i < t.n; i++) this.copy(dst + i * s, src + i * s, t.of, line); }
    else if (t.k === 'struct') { layout(t); for (const f of t.fields) this.copy(dst + f.off, src + f.off, f.t, line); }
    else { const v = this.mem.get(src); if (v === undefined) this.err('bad memory read while copying', line); if (!this.mem.has(dst)) this.err('bad memory write while copying', line); this.mem.set(dst, v); }
  }
  resolve(t, initLen) {
    if (t.k === 'ptr') { const to = this.resolve(t.to); return to === t.to ? t : ptr(to); }
    if (t.k !== 'arr') return t;
    if (t.n != null && !t.ne) return t;
    const of = this.resolve(t.of);
    let n = t.n;
    if (n == null) {
      if (t.ne) { const v = this.ev(t.ne); if (!isInt(v.t)) this.err('array size must be an integer', t.ne.line); n = v.v; if (n <= 0) this.err('array size must be positive (got ' + n + ')', t.ne.line); if (n > 2e6) this.err('array is too large for this runner', t.ne.line); }
      else if (initLen != null) n = initLen;
      else this.err('array size is missing: write a size inside [ ] or give an initializer list');
    }
    return { k: 'arr', of, n };
  }
  strAddr(node) {
    let a = this.strs.get(node);
    if (a === undefined) { a = this.strp; const s = node.v; for (let i = 0; i < s.length; i++) this.mem.set(a + i, (s.charCodeAt(i) << 24) >> 24); this.mem.set(a + s.length, 0); this.strp += s.length + 1 + 8; this.strs.set(node, a); }
    return a;
  }
  cstr(a, line, max) {
    if (a === 0) this.err('a NULL pointer was used as a string', line);
    let s = '';
    for (let i = 0; i < (max || 1e6); i++) {
      const v = this.mem.get(a + i);
      if (v === undefined) { const b = this.inHeap(a + i); if (b && b.zero) break; this.err("a string has no '\\0' terminator inside its array (or the pointer is bad)", line); }
      if (v === UN) this.err("a string is used before it was given a value, or it is missing its '\\0' terminator", line);
      if (v === 0) break;
      s += String.fromCharCode(v & 255);
    }
    return s;
  }
  putStr(a, s, line) { for (let i = 0; i < s.length; i++) this.store(a + i, TY.char, s.charCodeAt(i), line); this.store(a + s.length, TY.char, 0, line); }

  /* variables */
  lookup(name) {
    const fr = this.frames[this.frames.length - 1];
    if (fr) for (let i = fr.scopes.length - 1; i >= 0; i--) { const v = fr.scopes[i].get(name); if (v) return v; }
    return this.globals.get(name);
  }
  declare(item, isStatic, global) {
    let initLen = null; const init = item.init;
    if (item.t.k === 'arr' && item.t.ne == null && item.t.n == null && init) {
      if (init.n === 'str') initLen = init.v.length + 1;
      else if (init.n === 'ilist') initLen = (init.list.length === 1 && init.list[0].n === 'str' && item.t.of.k === 'char') ? init.list[0].v.length + 1 : init.list.length;
    }
    const scope = global ? this.globals : this.frames[this.frames.length - 1].scopes[this.frames[this.frames.length - 1].scopes.length - 1];
    if (scope.has(item.name)) this.err("'" + item.name + "' is declared twice in the same block", item.line);
    if (!global && isStatic) {
      let sv = this.statics.get(item);
      if (!sv) { const t = this.resolve(item.t, initLen); sv = { t, a: this.allocGlobal(t) }; this.statics.set(item, sv); if (init) this.initVar(sv.a, t, init, item.line); }
      scope.set(item.name, sv); return;
    }
    const t = this.resolve(item.t, initLen);
    if (t.k === 'void') this.err("a variable cannot have type void", item.line);
    let a;
    if (global) a = this.allocGlobal(t);
    else { a = this.allocStack(t); this.frames[this.frames.length - 1].allocs.push([a, t]); }
    if (init) this.initVar(a, t, init, item.line);
    scope.set(item.name, { t, a });
  }
  initVar(a, t, init, line) {
    if (t.k === 'arr') {
      if (init.n === 'ilist' && init.list.length === 1 && init.list[0].n === 'str' && t.of.k === 'char') init = init.list[0];
      if (init.n === 'str') {
        if (t.of.k !== 'char') this.err('only a char array can be initialized with a string', line);
        if (init.v.length > t.n) this.err('the string "' + unutf8(init.v) + '" does not fit in an array of ' + t.n + ' chars', line);
        for (let i = 0; i < t.n; i++) this.mem.set(a + i, i < init.v.length ? (init.v.charCodeAt(i) << 24) >> 24 : 0);
        return;
      }
      if (init.n !== 'ilist') this.err('an array must be initialized with a list in braces, like {1, 2, 3}', line);
      this.initMem(a, t, 0);
      const es = sizeOf(t.of);
      if (t.of.k === 'arr' && init.list.length && init.list[0].n !== 'ilist' && init.list[0].n !== 'str') { // flat list for 2D
        const flat = []; const leaf = (ty, ad) => { if (ty.k === 'arr') { const s = sizeOf(ty.of); for (let i = 0; i < ty.n; i++) leaf(ty.of, ad + i * s); } else flat.push([ad, ty]); };
        leaf(t, a); if (init.list.length > flat.length) this.err('too many values in the initializer list', line);
        init.list.forEach((e, i) => this.assignTo(flat[i][0], flat[i][1], this.ev(e), line));
        return;
      }
      if (init.list.length > t.n) this.err('too many values in the initializer: the array has ' + t.n + ' elements but the list has ' + init.list.length, line);
      init.list.forEach((e, i) => this.initVar(a + i * es, t.of, e, line));
      return;
    }
    if (t.k === 'struct' && init.n === 'ilist') {
      layout(t); this.initMem(a, t, 0);
      if (init.list.length > t.fields.length) this.err('too many values in the struct initializer', line);
      init.list.forEach((e, i) => this.initVar(a + t.fields[i].off, t.fields[i].t, e, line));
      return;
    }
    if (init.n === 'ilist') { if (init.list.length !== 1) this.err('a single variable cannot be initialized with a list of values', line); init = init.list[0]; }
    this.assignTo(a, t, this.ev(init), line);
  }
  assignTo(a, t, val, line) {
    if (t.k === 'struct') { if (val.t !== t) this.err('cannot assign ' + tname(val.t) + ' to ' + tname(t), line); this.copy(a, val.v, t, line); return; }
    if (t.k === 'arr') this.err('you cannot assign to a whole array with =. Copy element by element, or use strcpy for strings', line);
    this.store(a, t, this.conv(val, t, line), line);
  }
  conv(val, t, line) {
    const s = val.t;
    if (isNum(t)) { if (isNum(s) || isPtr(s)) return this.wrap(t, val.v); }
    else if (isPtr(t)) { if (isPtr(s) || isInt(s)) return val.v; if (s.k === 'func') return 0; }
    if (s.k === 'void') this.err('this function returns nothing (void), so its result cannot be used as a value', line);
    this.err('cannot convert ' + tname(s) + ' to ' + tname(t), line);
  }

  /* expressions */
  lv(e) {
    switch (e.n) {
      case 'id': { const v = this.lookup(e.v); if (!v) { if (this.funcs.has(e.v) || BUILTIN[e.v]) this.err("'" + e.v + "' is a function, not a variable", e.line); this.err("'" + e.v + "' is not declared. Declare it first (e.g. int " + e.v + ';) and check the spelling', e.line); } return v; }
      case 'un': if (e.op === '*') { const pv = this.ev(e.e); if (!isPtr(pv.t)) this.err("the * operator needs a pointer, but this is " + tname(pv.t), e.line); if (pv.t.to.k === 'void') this.err('cannot dereference a void* pointer; cast it first', e.line); return { t: pv.t.to, a: pv.v }; } break;
      case 'idx': {
        let b = this.ev(e.a), i = this.ev(e.i);
        if (!isPtr(b.t) && isPtr(i.t)) { const x = b; b = i; i = x; }
        if (!isPtr(b.t)) this.err('[ ] can only be used on an array or pointer, but this is ' + tname(b.t), e.line);
        if (!isInt(i.t)) this.err('an array index must be an integer, not ' + tname(i.t), e.line);
        return { t: b.t.to, a: b.v + i.v * sizeOf(b.t.to), idx: i.v };
      }
      case 'mem': {
        let st, a;
        if (e.arrow) { const pv = this.ev(e.e); if (!isPtr(pv.t) || pv.t.to.k !== 'struct') this.err("-> needs a pointer to a struct on its left side (use . for a struct variable)", e.line); st = pv.t.to; a = pv.v; }
        else { const l = this.lvOrTemp(e.e); if (l.t.k !== 'struct') this.err(isPtr(l.t) ? "use -> (not .) to reach a field through a pointer" : ". needs a struct on its left side", e.line); st = l.t; a = l.a; }
        layout(st); const f = st.fields.find(f => f.name === e.m);
        if (!f) this.err("struct " + (st.name || '') + " has no field named '" + e.m + "'", e.line);
        return { t: f.t, a: a + f.off };
      }
      case 'str': return { t: { k: 'arr', of: TY.char, n: e.v.length + 1 }, a: this.strAddr(e) };
    }
    this.err('this expression cannot be assigned to or have its address taken (it is not a variable)', e.line);
  }
  lvOrTemp(e) { if (e.n === 'call' || e.n === 'cond' || e.n === 'assign') { const v = this.ev(e); return { t: v.t, a: v.v }; } return this.lv(e); }
  rv(l, line) {
    if (l.t.k === 'arr') return { t: ptr(l.t.of), v: l.a };
    if (l.t.k === 'struct') return { t: l.t, v: l.a };
    return { t: l.t, v: this.load(l.a, l.t, line) };
  }
  truth(v, line) { if (v.t.k === 'struct' || v.t.k === 'void') this.err('this value cannot be used as a condition', line); return v.v !== 0; }
  ev(e) {
    switch (e.n) {
      case 'num': if (e.f) return { t: e.suf.includes('f') ? TY.float : TY.double, v: e.suf.includes('f') ? Math.fround(e.v) : e.v }; return { t: (e.suf.includes('l') || e.v > 2147483647) ? TY.long : (e.suf.includes('u') ? TY.uint : TY.int), v: e.v };
      case 'chr': return { t: TY.int, v: e.v };
      case 'str': return { t: ptr(TY.char), v: this.strAddr(e) };
      case 'id': {
        const v = this.lookup(e.v);
        if (v) return this.rv(v, e.line);
        if (CONSTS[e.v]) return CONSTS[e.v];
        if (this.funcs.has(e.v) || BUILTIN[e.v]) return { t: { k: 'func' }, v: e.v };
        return this.rv(this.lv(e), e.line);
      }
      case 'idx': case 'mem': return this.rv(this.lv(e), e.line);
      case 'un': {
        if (e.op === '*') return this.rv(this.lv(e), e.line);
        if (e.op === '&') { if (e.e.n === 'id' && !this.lookup(e.e.v) && (this.funcs.has(e.e.v))) return { t: { k: 'func' }, v: e.e.v }; const l = this.lv(e.e); return { t: ptr(l.t), v: l.a }; }
        const v = this.ev(e.e);
        if (e.op === '!') return { t: TY.int, v: this.truth(v, e.line) ? 0 : 1 };
        if (!isNum(v.t)) this.err("the unary '" + e.op + "' operator needs a number, not " + tname(v.t), e.line);
        const rt = isInt(v.t) && sizeOf(v.t) < 4 ? TY.int : v.t;
        if (e.op === '-') return { t: rt, v: this.wrap(rt, -v.v) };
        if (e.op === '+') return { t: rt, v: v.v };
        if (!isInt(v.t)) this.err('~ needs an integer', e.line);
        return { t: rt, v: this.wrap(rt, ~v.v) };
      }
      case 'bin': {
        if (e.op === '&&') return { t: TY.int, v: this.truth(this.ev(e.l), e.line) && this.truth(this.ev(e.r), e.line) ? 1 : 0 };
        if (e.op === '||') return { t: TY.int, v: this.truth(this.ev(e.l), e.line) || this.truth(this.ev(e.r), e.line) ? 1 : 0 };
        return this.arith(e.op, this.ev(e.l), this.ev(e.r), e.line);
      }
      case 'assign': {
        const l = this.lv(e.l);
        if (l.t.k === 'arr') this.err('you cannot assign to a whole array with =. Copy element by element, or use strcpy for strings', e.line);
        let val = this.ev(e.r);
        if (e.op !== '=') val = this.arith(e.op.slice(0, -1), this.rv(l, e.line), val, e.line);
        this.assignTo(l.a, l.t, val, e.line);
        return l.t.k === 'struct' ? { t: l.t, v: l.a } : { t: l.t, v: this.mem.get(l.a) };
      }
      case 'pre': case 'post': {
        const l = this.lv(e.e); const old = this.rv(l, e.line); const d = e.op === '++' ? 1 : -1;
        if (!isNum(l.t) && !isPtr(l.t)) this.err(e.op + ' needs a number or pointer variable', e.line);
        const nv = isPtr(l.t) ? old.v + d * sizeOf(l.t.to) : this.wrap(l.t, old.v + d);
        this.store(l.a, l.t, nv, e.line);
        return { t: l.t, v: e.n === 'pre' ? nv : old.v };
      }
      case 'cond': return this.truth(this.ev(e.c), e.line) ? this.ev(e.a) : this.ev(e.b);
      case 'comma': this.ev(e.l); return this.ev(e.r);
      case 'cast': {
        const v = this.ev(e.e); const t = this.resolve(e.t);
        if (t.k === 'void') return { t: TY.void, v: 0 };
        if (isPtr(t)) { if (!isPtr(v.t) && !isInt(v.t)) this.err('cannot cast ' + tname(v.t) + ' to a pointer', e.line); return { t, v: v.v }; }
        return { t, v: this.conv(v, t, e.line) };
      }
      case 'sizeof': {
        let t;
        if (e.t) t = this.resolve(e.t);
        else { const x = e.e; if (x.n === 'id' || x.n === 'idx' || x.n === 'mem' || x.n === 'str' || (x.n === 'un' && x.op === '*')) t = this.lv(x).t; else t = this.ev(x).t; }
        return { t: TY.ulong, v: sizeOf(t) };
      }
      case 'call': return this.call(e);
      case 'ilist': this.err('a { } list can only be used to initialize a variable when it is declared', e.line);
    }
    this.err('cannot evaluate this expression', e.line);
  }
  arith(op, a, b, line) {
    const A = a.t, B = b.t;
    if (A.k === 'struct' || B.k === 'struct' || A.k === 'void' || B.k === 'void' || A.k === 'func' || B.k === 'func') this.err("operator '" + op + "' cannot be used with " + tname(A.k === 'struct' || A.k === 'void' || A.k === 'func' ? A : B), line);
    const cmp = op === '==' || op === '!=' || op === '<' || op === '>' || op === '<=' || op === '>=';
    if (isPtr(A) || isPtr(B)) {
      if (cmp) { const x = a.v, y = b.v; return { t: TY.int, v: (op === '==' ? x === y : op === '!=' ? x !== y : op === '<' ? x < y : op === '>' ? x > y : op === '<=' ? x <= y : x >= y) ? 1 : 0 }; }
      if (op === '+' && isPtr(A) && isInt(B)) return { t: A, v: a.v + b.v * sizeOf(A.to) };
      if (op === '+' && isInt(A) && isPtr(B)) return { t: B, v: b.v + a.v * sizeOf(B.to) };
      if (op === '-' && isPtr(A) && isInt(B)) return { t: A, v: a.v - b.v * sizeOf(A.to) };
      if (op === '-' && isPtr(A) && isPtr(B)) return { t: TY.long, v: (a.v - b.v) / sizeOf(A.to) };
      this.err("operator '" + op + "' cannot be used between " + tname(A) + ' and ' + tname(B), line);
    }
    let rt;
    if (A.k === 'double' || B.k === 'double') rt = TY.double;
    else if (A.k === 'float' || B.k === 'float') rt = TY.float;
    else if (A.k === 'long' || B.k === 'long') rt = (A.k === 'long' && A.u) || (B.k === 'long' && B.u) ? TY.ulong : TY.long;
    else rt = (A.k === 'int' && A.u) || (B.k === 'int' && B.u) ? TY.uint : TY.int;
    const x = a.v, y = b.v; let r;
    switch (op) {
      case '+': r = x + y; break;
      case '-': r = x - y; break;
      case '*': r = rt === TY.int ? Math.imul(x, y) : x * y; break;
      case '/': if (isInt(rt)) { if (y === 0) this.err('division by zero', line); r = Math.trunc(x / y); } else r = x / y; break;
      case '%': if (!isInt(rt)) this.err('the % operator only works with integers (use fmod for floating point)', line); if (y === 0) this.err('division by zero (in %)', line); r = x % y; break;
      case '==': return { t: TY.int, v: x === y ? 1 : 0 };
      case '!=': return { t: TY.int, v: x !== y ? 1 : 0 };
      case '<': return { t: TY.int, v: x < y ? 1 : 0 };
      case '>': return { t: TY.int, v: x > y ? 1 : 0 };
      case '<=': return { t: TY.int, v: x <= y ? 1 : 0 };
      case '>=': return { t: TY.int, v: x >= y ? 1 : 0 };
      default:
        if (!isInt(rt)) this.err("operator '" + op + "' only works with integers", line);
        switch (op) { case '&': r = x & y; break; case '|': r = x | y; break; case '^': r = x ^ y; break; case '<<': r = rt.k === 'long' ? x * Math.pow(2, y) : x << y; break; case '>>': r = rt.k === 'long' ? Math.floor(x / Math.pow(2, y)) : (rt.u ? x >>> y : x >> y); break; default: this.err("unknown operator '" + op + "'", line); }
    }
    return { t: rt, v: this.wrap(rt, r) };
  }
  call(e) {
    if (e.f.n !== 'id') this.err('this is not a function that can be called', e.line);
    const name = e.f.v;
    if (this.lookup(name)) this.err("'" + name + "' is a variable, not a function", e.line);
    const fn = this.funcs.get(name);
    if (fn) { const args = e.args.map(a => this.ev(a)); return this.callUser(fn, args, e.line); }
    const b = BUILTIN[name];
    if (!b) this.err("function '" + name + "' is not defined. Check the spelling, or define it above main (or add a prototype)", e.line);
    this.line = e.line;
    if (name === 'scanf' || name === 'fscanf' || name === 'sscanf') e.args.forEach((a, i) => { if (i > 0 && a.n === 'id') { const v = this.lookup(a.v); if (v && isNum(v.t)) this.err(name + ": '" + a.v + "' must be passed as an address. Did you forget the & before the variable name? Write &" + a.v, e.line); } });
    return b.call(this, e.args.map(a => this.ev(a)), e.line, e) || { t: TY.void, v: 0 };
  }
  callUser(fn, args, line) {
    if (args.length !== fn.params.length) this.err("function '" + fn.name + "' expects " + fn.params.length + ' argument(s) but was called with ' + args.length, line);
    if (this.frames.length > 3000) this.err('stack overflow: the recursion is too deep (does it have a base case that stops it?)', line);
    const fr = { fn: fn.name, scopes: [new Map()], allocs: [], sp0: this.sp };
    const slots = fn.params.map((pm, i) => {
      const t = this.resolve(pm.t); const a = this.allocStack(t); fr.allocs.push([a, t]);
      if (t.k === 'struct' ? args[i].t !== t : false) this.err('argument ' + (i + 1) + " of '" + fn.name + "' has the wrong type", line);
      this.assignTo(a, t, args[i], line);
      if (pm.name) fr.scopes[0].set(pm.name, { t, a });
    });
    this.frames.push(fr);
    const saveLine = this.line;
    const sig = this.exList(fn.body.body);
    let out;
    if (fn.ret.k === 'void') out = { t: TY.void, v: 0 };
    else {
      let rvv = sig === RET ? this.retv : undefined;
      if (rvv === undefined || rvv === null) { if (fn.name === 'main') rvv = { t: TY.int, v: 0 }; else this.err("function '" + fn.name + "' must return a " + tname(fn.ret) + ' value, but it ended without a return statement', fn.line); }
      if (fn.ret.k === 'struct') { const tmp = this.hp; this.hp += sizeOf(fn.ret) + 8; this.initMem(tmp, fn.ret, 0); this.copy(tmp, rvv.v, fn.ret, line); out = { t: fn.ret, v: tmp }; }
      else out = { t: fn.ret, v: this.conv(rvv, fn.ret, line) };
    }
    this.retv = undefined;
    for (const [a, t] of fr.allocs) this.clearMem(a, t);
    this.sp = fr.sp0; this.frames.pop(); this.line = saveLine;
    return out;
  }

  /* statements */
  tick(line) {
    if (++this.steps > this.maxSteps || ((this.steps & 8191) === 0 && Date.now() - this.t0 > 4000)) this.err('the program ran for too long and was stopped. It probably contains an infinite loop — check the loop condition and that the loop variable changes', line);
  }
  exList(list) {
    const fr = this.frames[this.frames.length - 1];
    const mark = fr.allocs.length, sp = this.sp;
    fr.scopes.push(new Map());
    let sig = 0;
    for (let i = 0; i < list.length; i++) { sig = this.ex(list[i]); if (sig) break; }
    fr.scopes.pop();
    while (fr.allocs.length > mark) { const [a, t] = fr.allocs.pop(); this.clearMem(a, t); }
    this.sp = sp;
    return sig;
  }
  ex(s) {
    this.line = s.line; this.tick(s.line);
    if (this.trace && s.n !== 'block' && s.n !== 'empty' && s.n !== 'case' && s.n !== 'default') this.snap(s.line);
    switch (s.n) {
      case 'expr': this.ev(s.e); return 0;
      case 'decl': for (const it of s.items) this.declare(it, s.isStatic, false); return 0;
      case 'block': return this.exList(s.body);
      case 'if': if (this.truth(this.ev(s.c), s.line)) return this.ex(s.a); return s.b ? this.ex(s.b) : 0;
      case 'while':
        while (this.truth(this.ev(s.c), s.line)) { const g = this.ex(s.body); if (g === BRK) break; if (g === RET) return RET; this.tick(s.line); if (this.trace) this.snap(s.line); }
        return 0;
      case 'do':
        do { const g = this.ex(s.body); if (g === BRK) break; if (g === RET) return RET; this.tick(s.line); } while (this.truth(this.ev(s.c), s.line));
        return 0;
      case 'for': {
        const fr = this.frames[this.frames.length - 1]; const mark = fr.allocs.length, sp = this.sp; fr.scopes.push(new Map());
        let sig = 0;
        if (s.init) { if (s.init.n === 'decl') for (const it of s.init.items) this.declare(it, false, false); else this.ev(s.init.e); }
        while (!s.c || this.truth(this.ev(s.c), s.line)) {
          const g = this.ex(s.body); if (g === BRK) break; if (g === RET) { sig = RET; break; }
          if (s.step) this.ev(s.step); this.tick(s.line); if (this.trace) { this.line = s.line; this.snap(s.line); }
        }
        fr.scopes.pop(); while (fr.allocs.length > mark) { const [a, t] = fr.allocs.pop(); this.clearMem(a, t); } this.sp = sp;
        return sig;
      }
      case 'switch': {
        const v = this.ev(s.c); if (!isInt(v.t)) this.err('switch needs an integer or char value, not ' + tname(v.t), s.line);
        const list = s.body.body; let start = -1, def = -1;
        for (let i = 0; i < list.length; i++) {
          if (list[i].n === 'case') { const cv = this.ev(list[i].v); if (cv.v === v.v) { start = i; break; } }
          else if (list[i].n === 'default') def = i;
        }
        if (start < 0) start = def; if (start < 0) return 0;
        const fr = this.frames[this.frames.length - 1]; const mark = fr.allocs.length, sp = this.sp; fr.scopes.push(new Map());
        let sig = 0;
        for (let i = start; i < list.length; i++) { const g = this.ex(list[i]); if (g === BRK) break; if (g) { sig = g; break; } }
        fr.scopes.pop(); while (fr.allocs.length > mark) { const [a, t] = fr.allocs.pop(); this.clearMem(a, t); } this.sp = sp;
        return sig;
      }
      case 'case': case 'default': case 'empty': return 0;
      case 'break': return BRK;
      case 'continue': return CNT;
      case 'return': this.retv = s.e ? this.ev(s.e) : null; this.endLine = s.line; return RET;
    }
    this.err('unknown statement', s.line);
  }

  /* tracing */
  show(a, t) {
    if (t.k === 'arr') { const s = sizeOf(t.of), el = []; for (let i = 0; i < Math.min(t.n, 32); i++) el.push(Object.assign({ a: a + i * s }, this.show(a + i * s, t.of))); return { el, n: t.n }; }
    if (t.k === 'struct') { layout(t); return { f: t.fields.map(f => Object.assign({ name: f.name, a: a + f.off }, this.show(a + f.off, f.t))) }; }
    const v = this.mem.get(a);
    if (v === undefined || v === UN) return { s: '?' };
    if (t.k === 'ptr') return v === 0 ? { s: 'NULL', p: 0 } : { s: '0x' + v.toString(16), p: v };
    if (t.k === 'char') return { s: v === 0 ? "'\\0'" : v >= 32 && v < 127 ? "'" + String.fromCharCode(v) + "'" : v === 10 ? "'\\n'" : String(v) };
    if (isFlt(t)) return { s: String(Math.round(v * 1e6) / 1e6) };
    return { s: String(v) };
  }
  snap(line, note) {
    if (this.snaps.length >= this.maxSnaps) { this.trace = false; this.snapCut = true; return; }
    const frames = [];
    const vars = (map) => { const o = []; for (const [name, v] of map) o.push(Object.assign({ name, type: tname(v.t), addr: v.a, size: sizeOf(v.t) }, this.show(v.a, v.t))); return o; };
    if (this.globals.size) frames.push({ fn: 'global variables', vars: vars(this.globals) });
    for (const fr of this.frames) { let vs = []; for (const sc of fr.scopes) vs = vs.concat(vars(sc)); frames.push({ fn: fr.fn + '()', vars: vs }); }
    this.snaps.push({ line, frames, out: this.out.length, note: note || '' });
  }
  write(s) { this.out += s; if (this.out.length > 200000) this.err('the program printed too much output and was stopped (infinite loop?)'); }

  /* formatted output */
  format(f, args, ai, line, fname) {
    let o = ''; const base = ai - 1;
    const next = () => { if (ai >= args.length) this.err(fname + ': the format string needs more values than you passed. Each % code needs one argument', line); return args[ai++]; };
    for (let i = 0; i < f.length; i++) {
      const c = f[i];
      if (c !== '%') { o += c; continue; }
      i++; if (f[i] === '%') { o += '%'; continue; }
      let flags = ''; while ('-+ 0#'.includes(f[i]) && i < f.length) flags += f[i++];
      let w = 0; if (f[i] === '*') { w = next().v | 0; i++; if (w < 0) { flags += '-'; w = -w; } } else { let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; w = +d || 0; }
      let pr = null; if (f[i] === '.') { i++; if (f[i] === '*') { pr = next().v | 0; i++; } else { let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; pr = +d || 0; } }
      let len = ''; while ('hlLzjt'.includes(f[i]) && i < f.length) len += f[i++];
      const cv = f[i]; if (cv === undefined) this.err(fname + ': incomplete format code at the end of the format string', line);
      let body = '', sign = '', numeric = true;
      const code = '%' + len + cv, argNo = ai - base;
      const needInt = (a) => { if (isFlt(a.t)) this.err(fname + ': ' + code + ' expects an integer, but argument ' + argNo + ' is a ' + tname(a.t) + '. Use %f for floating-point values', line); if (isPtr(a.t)) this.err(fname + ': ' + code + ' expects an integer, but argument ' + argNo + ' is a pointer (' + tname(a.t) + '). Use %s for strings, %p for addresses, or * to get the value', line); if (!isInt(a.t)) this.err(fname + ': ' + code + ' cannot print a ' + tname(a.t), line); };
      const needFlt = (a) => { if (isInt(a.t)) this.err(fname + ': ' + code + ' expects a float or double, but argument ' + argNo + ' is an ' + tname(a.t) + '. Use %d, or cast it: (float)x', line); if (!isFlt(a.t)) this.err(fname + ': ' + code + ' cannot print a ' + tname(a.t), line); };
      switch (cv) {
        case 'd': case 'i': { const a = next(); needInt(a); let v = a.v; if (v < 0) { sign = '-'; v = -v; } else if (flags.includes('+')) sign = '+'; else if (flags.includes(' ')) sign = ' '; body = String(v); if (pr !== null) { body = body.padStart(pr, '0'); flags = flags.replace('0', ''); } break; }
        case 'u': case 'x': case 'X': case 'o': { const a = next(); needInt(a); let v = a.v; if (v < 0) v = len.includes('l') || a.t.k === 'long' ? Number(BigInt.asUintN(64, BigInt(v))) : v >>> 0; body = cv === 'u' ? String(v) : cv === 'o' ? v.toString(8) : v.toString(16); if (cv === 'X') body = body.toUpperCase(); if (flags.includes('#') && v) body = (cv === 'o' ? '0' : cv === 'x' ? '0x' : cv === 'X' ? '0X' : '') + body; if (pr !== null) { body = body.padStart(pr, '0'); flags = flags.replace('0', ''); } break; }
        case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
          const a = next(); needFlt(a); let v = a.v; if (pr === null) pr = 6;
          if (v < 0 || Object.is(v, -0)) { sign = '-'; v = -v; } else if (flags.includes('+')) sign = '+'; else if (flags.includes(' ')) sign = ' ';
          const fix = (x, d) => { if (d > 60 || x > 1e20) return x.toFixed(Math.min(d, 100)); const lg = x.toFixed(d + 30), tail = lg.slice(lg.length - 30); if (/^50*$/.test(tail)) { const head = lg.slice(0, lg.length - 30); if (+head.replace('.', '').slice(-1) % 2 === 0) return head.endsWith('.') ? head.slice(0, -1) : head; } return x.toFixed(d); };
          const exp = (x, d) => { let s = x.toExponential(Math.min(d, 100)); return s.replace(/e([+-])(\d)$/, 'e$10$2'); };
          if (!isFinite(v)) { body = isNaN(v) ? 'nan' : 'inf'; flags = flags.replace('0', ''); }
          else if (cv === 'f' || cv === 'F') body = fix(v, pr);
          else if (cv === 'e' || cv === 'E') body = exp(v, pr);
          else { const P = pr === 0 ? 1 : pr; const X = v === 0 ? 0 : Math.floor(Math.log10(v)); const ex2 = v === 0 ? 0 : +v.toExponential(P - 1).split('e')[1]; if (P > ex2 && ex2 >= -4) body = v.toFixed(Math.max(P - 1 - ex2, 0)); else body = exp(v, P - 1); if (!flags.includes('#') && body.includes('.')) body = body.replace(/\.?0+(e|$)/, '$1'); }
          if (cv === 'E' || cv === 'G') body = body.toUpperCase();
          break;
        }
        case 'c': { const a = next(); needInt(a); body = String.fromCharCode(a.v & 255); numeric = false; break; }
        case 's': { const a = next(); if (!isPtr(a.t)) this.err(fname + ': %s expects a string (char array), but argument ' + argNo + ' is ' + (isInt(a.t) ? 'an integer. Use %d for numbers or %c for a single char' : 'a ' + tname(a.t)), line); body = a.v === 0 ? '(null)' : this.cstr(a.v, line); if (pr !== null) body = body.slice(0, pr); numeric = false; break; }
        case 'p': { const a = next(); if (!isPtr(a.t)) this.err(fname + ': %p expects a pointer/address (did you forget &?)', line); body = a.v === 0 ? '(nil)' : '0x' + a.v.toString(16); numeric = false; break; }
        default: this.err(fname + ": unknown format code '%" + cv + "'", line);
      }
      let s = sign + body;
      if (s.length < w) { if (flags.includes('-')) s = s.padEnd(w); else if (flags.includes('0') && numeric) s = sign + body.padStart(w - sign.length, '0'); else s = s.padStart(w); }
      o += s;
    }
    return o;
  }
  /* formatted input */
  scan(st, f, args, ai, line, fname) {
    const b = st.buf; let n = 0, i = 0; const base = ai - 1;
    const ws = c => c === ' ' || c === '\n' || c === '\t' || c === '\r';
    const skip = () => { while (st.pos < b.length && ws(b[st.pos])) st.pos++; };
    const eof = () => { if (st.isStdin) this.needMore = true; return n === 0 ? -1 : n; };
    while (i < f.length) {
      const c = f[i];
      if (ws(c)) { skip(); i++; continue; }
      if (c !== '%') { if (st.pos < b.length && b[st.pos] === c) { st.pos++; i++; continue; } return st.pos >= b.length ? eof() : n; }
      i++;
      if (f[i] === '%') { skip(); if (b[st.pos] === '%') { st.pos++; i++; continue; } return n; }
      let sup = false; if (f[i] === '*') { sup = true; i++; }
      let d = ''; while (/\d/.test(f[i] || '')) d += f[i++]; const w = d ? +d : Infinity;
      let len = ''; while ('hlL'.includes(f[i]) && i < f.length) len += f[i++];
      let cv = f[i++]; let set = null, neg = false;
      if (cv === '[') { if (f[i] === '^') { neg = true; i++; } set = ''; if (f[i] === ']') { set += ']'; i++; } while (i < f.length && f[i] !== ']') set += f[i++]; i++; }
      let tg = null; const argNo = ai - base;
      if (!sup) {
        if (ai >= args.length) this.err(fname + ': the format string has more % codes than variables', line);
        tg = args[ai++];
        if (!isPtr(tg.t)) this.err(fname + ': argument ' + argNo + ' must be an address. Did you forget the & before the variable name?', line);
      }
      const pt = tg ? (tg.t.to.k === 'arr' ? tg.t.to.of : tg.t.to) : null;
      switch (cv) {
        case 'd': case 'i': case 'u': case 'x': {
          skip(); if (st.pos >= b.length) return eof();
          const m = (cv === 'x' ? /^[+-]?(0[xX])?[0-9a-fA-F]+/ : /^[+-]?\d+/).exec(b.slice(st.pos, st.pos + Math.min(w, 40)));
          if (!m) return n; st.pos += m[0].length;
          if (tg) { if (isFlt(pt)) this.err(fname + ': %' + len + cv + ' reads an integer, but the variable is a ' + tname(pt) + '. Use ' + (pt.k === 'double' ? '%lf' : '%f'), line); if (!isInt(pt)) this.err(fname + ': %d needs the address of an int variable', line); this.store(tg.v, pt, parseInt(m[0], cv === 'x' ? 16 : 10), line); }
          break;
        }
        case 'f': case 'e': case 'g': {
          skip(); if (st.pos >= b.length) return eof();
          const m = /^[+-]?(\d+\.?\d*([eE][+-]?\d+)?|\.\d+([eE][+-]?\d+)?)/.exec(b.slice(st.pos, st.pos + Math.min(w, 60)));
          if (!m) return n; st.pos += m[0].length;
          if (tg) {
            if (isInt(pt)) this.err(fname + ': %' + len + 'f reads a floating-point number, but the variable is an ' + tname(pt) + '. Use %d', line);
            if (pt.k === 'double' && !len.includes('l')) this.err(fname + ': to read into a double you must use %lf (not %f)', line);
            if (pt.k === 'float' && len.includes('l')) this.err(fname + ': to read into a float use %f (%lf is for double)', line);
            if (!isFlt(pt)) this.err(fname + ': %f needs the address of a float variable', line);
            this.store(tg.v, pt, parseFloat(m[0]), line);
          }
          break;
        }
        case 'c': {
          if (st.pos >= b.length) return eof();
          const cnt = w === Infinity ? 1 : w;
          for (let k = 0; k < cnt && st.pos < b.length; k++) { const ch = b.charCodeAt(st.pos++); if (tg) { if (pt.k !== 'char' && !isInt(pt)) this.err(fname + ': %c needs the address of a char variable', line); this.store(tg.v + k, pt.k === 'char' ? pt : TY.char, ch, line); } }
          break;
        }
        case 's': case '[': {
          if (cv === 's') skip(); if (st.pos >= b.length) return eof();
          let s = '';
          while (st.pos < b.length && s.length < w) { const ch = b[st.pos]; if (cv === 's' ? ws(ch) : (set.includes(ch) === neg)) break; s += ch; st.pos++; }
          if (cv === '[' && !s.length) return n;
          if (tg) { if (pt.k !== 'char') this.err(fname + ': %s needs a char array to store the text' + (isInt(pt) ? ' (for a number use %d)' : ''), line); this.putStr(tg.v, s, line); }
          break;
        }
        case 'n': break;
        default: this.err(fname + ": unknown format code '%" + cv + "'", line);
      }
      if (!sup) n++;
    }
    return n;
  }
  stream(v, line, fname) {
    if (v.v === -101) { this.inp.isStdin = true; return this.inp; }
    if (v.v === -102 || v.v === -103) return { out: true };
    const h = this.fh.get(v.v);
    if (!h) this.err(fname + ': this FILE pointer is ' + (v.v === 0 ? 'NULL (fopen failed — always check for NULL)' : 'not an open file'), line);
    return h;
  }
  run() {
    for (const d of this.ast.globals) { this.line = d.line; for (const it of d.items) this.declare(it, false, true); }
    const main = this.funcs.get('main');
    if (!main) this.err("there is no main function. Every C program starts at: int main() { ... }", 1);
    let code = 0;
    try {
      const args = main.params.length === 2 ? [{ t: TY.int, v: 1 }, { t: ptr(ptr(TY.char)), v: 0 }] : [];
      if (main.params.length !== 0 && main.params.length !== 2) this.err('main must take no parameters', main.line);
      const r = this.callUser(main, args, main.line); code = r.t.k === 'void' ? 0 : r.v | 0;
    } catch (e) { if (e instanceof ExitSignal) code = e.code; else throw e; }
    return code;
  }
}

/* ---------- built-in library ---------- */
const I = v => ({ t: TY.int, v: v | 0 }), D = v => ({ t: TY.double, v });
const CONSTS = Object.assign(Object.create(null), { NULL: { t: ptr(TY.void), v: 0 }, EOF: I(-1), stdin: { t: ptr(TY.void), v: -101 }, stdout: { t: ptr(TY.void), v: -102 }, stderr: { t: ptr(TY.void), v: -103 }, RAND_MAX: I(32767), INT_MAX: I(2147483647), INT_MIN: I(-2147483648), M_PI: D(Math.PI), true: I(1), false: I(0), EXIT_SUCCESS: I(0), EXIT_FAILURE: I(1) });
function need(m, name, args, n, line) { if (args.length < n) m.err(name + ' needs ' + n + ' argument(s) but got ' + args.length, line); }
function sarg(m, name, a, i, line) { if (!a || !isPtr(a.t)) m.err(name + ': argument ' + (i + 1) + ' must be a string (char array or char*)' + (a && isInt(a.t) ? ". A single character like 'a' is not a string — use \"a\"" : ''), line); return a.v; }
function narg(m, name, a, line) { if (!a || !isNum(a.t)) m.err(name + ': expected a number argument', line); return a.v; }
const math1 = (fn) => function (args, line, e) { need(this, e.f.v, args, 1, line); return D(fn(narg(this, e.f.v, args[0], line))); };
const ctype = (fn) => function (args, line, e) { need(this, e.f.v, args, 1, line); return I(fn(narg(this, e.f.v, args[0], line)) ? 1 : 0); };
const BUILTIN = Object.assign(Object.create(null), {
  printf(args, line) { need(this, 'printf', args, 1, line); const s = this.format(this.cstr(sarg(this, 'printf', args[0], 0, line), line), args, 1, line, 'printf'); this.write(s); return I(s.length); },
  sprintf(args, line) { need(this, 'sprintf', args, 2, line); const s = this.format(this.cstr(sarg(this, 'sprintf', args[1], 1, line), line), args, 2, line, 'sprintf'); this.putStr(sarg(this, 'sprintf', args[0], 0, line), s, line); return I(s.length); },
  fprintf(args, line) { need(this, 'fprintf', args, 2, line); const st = this.stream(args[0], line, 'fprintf'); const s = this.format(this.cstr(sarg(this, 'fprintf', args[1], 1, line), line), args, 2, line, 'fprintf'); if (st.out) this.write(s); else { if (st.mode === 'r') this.err('fprintf: this file was opened for reading ("r"), not writing', line); st.buf += s; this.files.set(st.name, st.buf); } return I(s.length); },
  scanf(args, line) { need(this, 'scanf', args, 1, line); this.inp.isStdin = true; return I(this.scan(this.inp, this.cstr(sarg(this, 'scanf', args[0], 0, line), line), args, 1, line, 'scanf')); },
  sscanf(args, line) { need(this, 'sscanf', args, 2, line); return I(this.scan({ buf: this.cstr(sarg(this, 'sscanf', args[0], 0, line), line), pos: 0 }, this.cstr(sarg(this, 'sscanf', args[1], 1, line), line), args, 2, line, 'sscanf')); },
  fscanf(args, line) { need(this, 'fscanf', args, 2, line); const st = this.stream(args[0], line, 'fscanf'); if (st.out) this.err('fscanf: cannot read from stdout', line); return I(this.scan(st, this.cstr(sarg(this, 'fscanf', args[1], 1, line), line), args, 2, line, 'fscanf')); },
  puts(args, line) { need(this, 'puts', args, 1, line); this.write(this.cstr(sarg(this, 'puts', args[0], 0, line), line) + '\n'); return I(0); },
  putchar(args, line) { need(this, 'putchar', args, 1, line); this.write(String.fromCharCode(narg(this, 'putchar', args[0], line) & 255)); return I(args[0].v); },
  getchar() { if (this.inp.pos >= this.inp.buf.length) { this.needMore = true; return I(-1); } return I(this.inp.buf.charCodeAt(this.inp.pos++)); },
  gets(args, line) { need(this, 'gets', args, 1, line); const b = this.inp; if (b.pos >= b.buf.length) { this.needMore = true; return { t: ptr(TY.char), v: 0 }; } let e = b.buf.indexOf('\n', b.pos); if (e < 0) e = b.buf.length; this.putStr(sarg(this, 'gets', args[0], 0, line), b.buf.slice(b.pos, e), line); b.pos = Math.min(e + 1, b.buf.length); return args[0]; },
  fgets(args, line) {
    need(this, 'fgets', args, 3, line); const a = sarg(this, 'fgets', args[0], 0, line); const n = narg(this, 'fgets', args[1], line) | 0; const st = this.stream(args[2], line, 'fgets');
    if (st.out) this.err('fgets: cannot read from stdout', line);
    if (st.pos >= st.buf.length) { if (st.isStdin) this.needMore = true; return { t: ptr(TY.char), v: 0 }; }
    let s = ''; while (s.length < n - 1 && st.pos < st.buf.length) { const ch = st.buf[st.pos++]; s += ch; if (ch === '\n') break; }
    this.putStr(a, s, line); return args[0];
  },
  fputs(args, line) { need(this, 'fputs', args, 2, line); const s = this.cstr(sarg(this, 'fputs', args[0], 0, line), line); const st = this.stream(args[1], line, 'fputs'); if (st.out) this.write(s); else { st.buf += s; this.files.set(st.name, st.buf); } return I(0); },
  fputc(args, line) { need(this, 'fputc', args, 2, line); const s = String.fromCharCode(args[0].v & 255); const st = this.stream(args[1], line, 'fputc'); if (st.out) this.write(s); else { st.buf += s; this.files.set(st.name, st.buf); } return I(args[0].v); },
  fgetc(args, line) { need(this, 'fgetc', args, 1, line); const st = this.stream(args[0], line, 'fgetc'); if (st.pos >= st.buf.length) { st.eof = true; return I(-1); } return I(st.buf.charCodeAt(st.pos++)); },
  fopen(args, line) {
    need(this, 'fopen', args, 2, line); const name = this.cstr(sarg(this, 'fopen', args[0], 0, line), line), mode = this.cstr(sarg(this, 'fopen', args[1], 1, line), line)[0];
    if (mode === 'r') { if (!this.files.has(name)) return { t: ptr(TY.void), v: 0 }; }
    else if (mode === 'w') this.files.set(name, '');
    else if (mode === 'a') { if (!this.files.has(name)) this.files.set(name, ''); }
    else this.err('fopen: unknown mode. Use "r" (read), "w" (write) or "a" (append)', line);
    const id = this.nextFh++; this.fh.set(id, { name, mode, buf: this.files.get(name), pos: 0 });
    return { t: ptr(TY.void), v: id };
  },
  fclose(args, line) { need(this, 'fclose', args, 1, line); this.stream(args[0], line, 'fclose'); this.fh.delete(args[0].v); return I(0); },
  feof(args, line) { need(this, 'feof', args, 1, line); const st = this.stream(args[0], line, 'feof'); return I(st.pos >= st.buf.length ? 1 : 0); },
  rewind(args, line) { const st = this.stream(args[0], line, 'rewind'); st.pos = 0; },
  remove(args, line) { const nm = this.cstr(sarg(this, 'remove', args[0], 0, line), line); return I(this.files.delete(nm) ? 0 : -1); },
  rename(args, line) { const a = this.cstr(sarg(this, 'rename', args[0], 0, line), line), b = this.cstr(sarg(this, 'rename', args[1], 1, line), line); if (!this.files.has(a)) return I(-1); this.files.set(b, this.files.get(a)); this.files.delete(a); return I(0); },
  fflush() { return I(0); },
  strlen(args, line) { need(this, 'strlen', args, 1, line); return { t: TY.ulong, v: this.cstr(sarg(this, 'strlen', args[0], 0, line), line).length }; },
  strcpy(args, line) { need(this, 'strcpy', args, 2, line); this.putStr(sarg(this, 'strcpy', args[0], 0, line), this.cstr(sarg(this, 'strcpy', args[1], 1, line), line), line); return args[0]; },
  strncpy(args, line) { need(this, 'strncpy', args, 3, line); const d = sarg(this, 'strncpy', args[0], 0, line), s = this.cstr(sarg(this, 'strncpy', args[1], 1, line), line), n = args[2].v | 0; for (let i = 0; i < n; i++) this.store(d + i, TY.char, i < s.length ? s.charCodeAt(i) : 0, line); return args[0]; },
  strcat(args, line) { need(this, 'strcat', args, 2, line); const d = sarg(this, 'strcat', args[0], 0, line); const cur = this.cstr(d, line); this.putStr(d + cur.length, this.cstr(sarg(this, 'strcat', args[1], 1, line), line), line); return args[0]; },
  strncat(args, line) { need(this, 'strncat', args, 3, line); const d = sarg(this, 'strncat', args[0], 0, line); const cur = this.cstr(d, line); this.putStr(d + cur.length, this.cstr(sarg(this, 'strncat', args[1], 1, line), line).slice(0, args[2].v | 0), line); return args[0]; },
  strcmp(args, line) { need(this, 'strcmp', args, 2, line); const a = this.cstr(sarg(this, 'strcmp', args[0], 0, line), line), b = this.cstr(sarg(this, 'strcmp', args[1], 1, line), line); for (let i = 0; ; i++) { const x = i < a.length ? a.charCodeAt(i) : 0, y = i < b.length ? b.charCodeAt(i) : 0; if (x !== y) return I(x - y); if (!x) return I(0); } },
  strncmp(args, line) { need(this, 'strncmp', args, 3, line); const a = this.cstr(sarg(this, 'strncmp', args[0], 0, line), line), b = this.cstr(sarg(this, 'strncmp', args[1], 1, line), line), n = args[2].v | 0; for (let i = 0; i < n; i++) { const x = i < a.length ? a.charCodeAt(i) : 0, y = i < b.length ? b.charCodeAt(i) : 0; if (x !== y) return I(x - y); if (!x) break; } return I(0); },
  strchr(args, line) { need(this, 'strchr', args, 2, line); const a = sarg(this, 'strchr', args[0], 0, line); const i = this.cstr(a, line).indexOf(String.fromCharCode(args[1].v & 255)); return { t: ptr(TY.char), v: i < 0 ? 0 : a + i }; },
  strstr(args, line) { need(this, 'strstr', args, 2, line); const a = sarg(this, 'strstr', args[0], 0, line); const i = this.cstr(a, line).indexOf(this.cstr(sarg(this, 'strstr', args[1], 1, line), line)); return { t: ptr(TY.char), v: i < 0 ? 0 : a + i }; },
  strcspn(args, line) { need(this, 'strcspn', args, 2, line); const a = this.cstr(sarg(this, 'strcspn', args[0], 0, line), line), b = this.cstr(sarg(this, 'strcspn', args[1], 1, line), line); let i = 0; while (i < a.length && !b.includes(a[i])) i++; return { t: TY.ulong, v: i }; },
  toupper(args, line) { need(this, 'toupper', args, 1, line); const c = args[0].v; return I(c >= 97 && c <= 122 ? c - 32 : c); },
  tolower(args, line) { need(this, 'tolower', args, 1, line); const c = args[0].v; return I(c >= 65 && c <= 90 ? c + 32 : c); },
  isdigit: ctype(c => c >= 48 && c <= 57), isalpha: ctype(c => (c >= 65 && c <= 90) || (c >= 97 && c <= 122)),
  isupper: ctype(c => c >= 65 && c <= 90), islower: ctype(c => c >= 97 && c <= 122),
  isalnum: ctype(c => (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122)),
  isspace: ctype(c => c === 32 || (c >= 9 && c <= 13)), ispunct: ctype(c => c > 32 && c < 127 && !((c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122))),
  sqrt: math1(Math.sqrt), fabs: math1(Math.abs), floor: math1(Math.floor), ceil: math1(Math.ceil), round: math1(x => x < 0 ? -Math.round(-x) : Math.round(x)),
  sin: math1(Math.sin), cos: math1(Math.cos), tan: math1(Math.tan), log: math1(Math.log), log10: math1(Math.log10), log2: math1(Math.log2), exp: math1(Math.exp), trunc: math1(Math.trunc),
  pow(args, line) { need(this, 'pow', args, 2, line); return D(Math.pow(narg(this, 'pow', args[0], line), narg(this, 'pow', args[1], line))); },
  fmod(args, line) { need(this, 'fmod', args, 2, line); return D(narg(this, 'fmod', args[0], line) % narg(this, 'fmod', args[1], line)); },
  abs(args, line) { need(this, 'abs', args, 1, line); if (isFlt(args[0].t)) this.err('abs is for integers. For float/double use fabs (from math.h)', line); return I(Math.abs(narg(this, 'abs', args[0], line))); },
  labs(args, line) { return { t: TY.long, v: Math.abs(args[0].v) }; },
  rand() { this.rng = (Math.imul(this.rng, 1103515245) + 12345) & 0x7fffffff; return I((this.rng >> 16) & 32767); },
  srand(args) { this.rng = (args[0] ? args[0].v : 1) | 0; },
  time() { return { t: TY.long, v: Math.floor(Date.now() / 1000) }; },
  atoi(args, line) { need(this, 'atoi', args, 1, line); return I(parseInt(this.cstr(sarg(this, 'atoi', args[0], 0, line), line), 10) || 0); },
  atof(args, line) { need(this, 'atof', args, 1, line); return D(parseFloat(this.cstr(sarg(this, 'atof', args[0], 0, line), line)) || 0); },
  exit(args) { throw new ExitSignal(args[0] ? args[0].v | 0 : 0); },
  malloc(args, line) { need(this, 'malloc', args, 1, line); const n = Math.max(args[0].v | 0, 1); const a = this.hp; this.hp += Math.ceil(n / 8) * 8 + 16; this.heap.push({ a, n }); return { t: ptr(TY.void), v: a }; },
  calloc(args, line) { need(this, 'calloc', args, 2, line); const n = Math.max((args[0].v | 0) * (args[1].v | 0), 1); const a = this.hp; this.hp += Math.ceil(n / 8) * 8 + 16; this.heap.push({ a, n, zero: true }); return { t: ptr(TY.void), v: a }; },
  free(args, line) { need(this, 'free', args, 1, line); if (args[0].v === 0) return; const i = this.heap.findIndex(b => b.a === args[0].v); if (i < 0) this.err('free: this pointer did not come from malloc (or was already freed)', line); const b = this.heap[i]; for (let k = b.a; k < b.a + b.n; k++) this.mem.delete(k); this.heap.splice(i, 1); },
});

function run(src, opts) {
  opts = opts || {};
  const res = { ok: false, output: '', error: null, exitCode: 0, steps: [], needMoreInput: false, files: {} };
  let m = null;
  try {
    const ast = parse(src);
    m = new Machine(ast, opts);
    res.exitCode = m.run();
    if (m.trace) m.snap(m.endLine || m.line, 'program finished');
    res.ok = true;
  } catch (e) {
    if (e instanceof CError) res.error = { message: e.cmsg, line: e.line, phase: m ? 'run' : 'compile' };
    else if (e instanceof RangeError) res.error = { message: 'stack overflow: the recursion is too deep (does it have a base case that stops it?)', line: m ? m.line : 0, phase: 'run' };
    else res.error = { message: 'Internal runner error: ' + (e && e.message || e) + '. Try the code in a full C compiler.', line: m ? m.line : 0, phase: 'internal' };
  }
  if (m) {
    res.output = unutf8(m.out); res.steps = m.snaps; res.needMoreInput = m.needMore; res.stepsCut = !!m.snapCut;
    for (const [k, v] of m.files) res.files[k] = unutf8(v);
    for (const s of res.steps) s.outText = unutf8(m.out.slice(0, s.out));
  }
  return res;
}
root.MiniC = { run, parse };
})(typeof window !== 'undefined' ? window : globalThis);
