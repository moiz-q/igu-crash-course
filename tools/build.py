#!/usr/bin/env python3
"""Content bundler for the crash course site.

Reads the plain-text sources in /content (Markdown lessons, question banks, exercises)
and writes JavaScript data files to /data, which the site loads with <script> tags.
This is why the site works when opened straight from disk (file://) with no server.

Usage:  python tools/build.py          (run from the project folder)
Needs only the Python 3 standard library.
"""
import json, os, re, sys, html, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'content')
OUT = os.path.join(ROOT, 'data')
WARN = []

def warn(msg):
    WARN.append(msg)

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read().lstrip('\ufeff').replace('\r\n', '\n')

def esc(s):
    return html.escape(s, quote=False)

def attr(s):
    return html.escape(s, quote=True)

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

# ---------------------------------------------------------------- inline markdown
def inline(s):
    stash = []
    def keep(h):
        stash.append(h)
        return '\x00%d\x00' % (len(stash) - 1)
    s = s.replace('\\$', '\x01')
    s = re.sub(r'``(.+?)``', lambda m: keep('<code>' + esc(m.group(1).strip()) + '</code>'), s)
    s = re.sub(r'`([^`]+)`', lambda m: keep('<code>' + esc(m.group(1)) + '</code>'), s)
    s = re.sub(r'\$([^$\n]+)\$', lambda m: keep('<span class="math" data-tex="' + attr(m.group(1)) + '"></span>'), s)
    s = esc(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])', r'<em>\1</em>', s)
    def link(m):
        text, url = m.group(1), m.group(2)
        if url.startswith('#'):
            return '<a href="%s">%s</a>' % (attr(url), text)
        return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (attr(url), text)
    s = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, s)
    s = s.replace('\x01', '$')
    s = re.sub(r'\x00(\d+)\x00', lambda m: stash[int(m.group(1))], s)
    return s

def split_row(line):
    """Split a table row on | but not inside `code` or $math$."""
    cells, cur, mode, i = [], '', None, 0
    line = line.strip()
    if line.startswith('|'): line = line[1:]
    if line.endswith('|') and not line.endswith('\\|'): line = line[:-1]
    while i < len(line):
        ch = line[i]
        if ch == '\\' and i + 1 < len(line) and line[i + 1] == '|':
            cur += '|'; i += 2; continue
        if mode is None and ch in '`$':
            mode = ch
        elif mode == ch:
            mode = None
        if ch == '|' and mode is None:
            cells.append(cur.strip()); cur = ''
        else:
            cur += ch
        i += 1
    cells.append(cur.strip())
    return cells

# ---------------------------------------------------------------- questions
def parse_questions(lines, i, ctx):
    """Parse consecutive '? ' question blocks starting at lines[i]. Returns (questions, next_i)."""
    qs = []
    n = len(lines)
    while i < n and lines[i].startswith('? '):
        q = {'q': '', 'opts': [], 'why': ''}
        text = lines[i][2:].strip(); i += 1
        m = re.match(r'\[([^\]]*)\]\s*(.*)$', text)
        if m:
            tags = [t.strip() for t in m.group(1).split('|')]
            q['tag'] = tags[0]
            if len(tags) > 1: q['diff'] = tags[1]
            text = m.group(2)
        qtext = [text]
        while i < n and lines[i].strip() != '':
            ln = lines[i]
            if ln.startswith('```'):
                lang = ln[3:].strip() or 'text'; i += 1; code = []
                while i < n and not lines[i].startswith('```'):
                    code.append(lines[i]); i += 1
                i += 1
                q['code'] = {'lang': lang, 'src': '\n'.join(code)}
                continue
            if ln.startswith('* ') or ln.startswith('- '):
                body = ln[2:]
                why = ''
                if ' ~~ ' in body:
                    body, why = body.split(' ~~ ', 1)
                o = {'h': inline(body.strip())}
                if ln[0] == '*': o['ok'] = 1
                if why: o['why'] = inline(why.strip())
                q['opts'].append(o)
            elif ln.startswith('! '):
                q['why'] = inline(ln[2:].strip())
            elif q['opts'] and not q['why']:
                warn('%s: stray line inside question: %s' % (ctx, ln[:60]))
            elif q['why']:
                q['why'] += ' ' + inline(ln.strip())
            else:
                qtext.append(ln.strip())
            i += 1
        q['q'] = inline(' '.join(qtext))
        if sum(1 for o in q['opts'] if o.get('ok')) != 1:
            warn('%s: question needs exactly one correct (*) option: %s' % (ctx, text[:70]))
        if len(q['opts']) < 2:
            warn('%s: question has fewer than 2 options: %s' % (ctx, text[:70]))
        qs.append(q)
        while i < n and lines[i].strip() == '':
            i += 1
    return qs, i

def parse_gaps(lines, i, ctx):
    items = []
    n = len(lines)
    while i < n and lines[i].startswith('_ '):
        body = lines[i][2:]
        note = ''
        if ' ~~ ' in body:
            body, note = body.split(' ~~ ', 1)
        if ' = ' not in body:
            warn('%s: gap item without answer: %s' % (ctx, body[:60])); i += 1; continue
        text, ans = body.rsplit(' = ', 1)
        blanks = [[a.strip() for a in part.split(' | ')] for part in ans.split(' ; ')]
        if text.count('___') != len(blanks):
            warn('%s: blanks/answers mismatch: %s' % (ctx, body[:60]))
        items.append({'t': [inline(p) for p in text.split('___')], 'a': blanks, 'note': inline(note.strip()) if note else ''})
        i += 1
        while i < n and lines[i].strip() == '' and i + 1 < n and lines[i + 1].startswith('_ '):
            i += 1
    return items, i

# ---------------------------------------------------------------- block markdown
class Doc:
    """Result of rendering one markdown document."""
    def __init__(self, ctx):
        self.ctx = ctx
        self.quizzes = []
        self.gaps = []
        self.terms = []
        self.checklists = 0
        self.widgets = []
        self.has = set()

def widget_tag(name, args=None, src=None):
    a = ''.join(' data-%s="%s"' % (k, attr(str(v))) for k, v in (args or {}).items())
    inner = '<pre hidden class="src">%s</pre>' % esc(src) if src is not None else ''
    return '<div class="widget" data-widget="%s"%s>%s</div>' % (name, a, inner)

def parse_args(s):
    args = {}
    for m in re.finditer(r'(\w+)=("([^"]*)"|\S+)', s):
        args[m.group(1)] = m.group(3) if m.group(3) is not None else m.group(2)
    return args

CALLOUT = {'note': 'Note', 'tip': 'Tip', 'warn': 'Watch out', 'tsql': 'In SQL Server (T-SQL)', 'example': 'Worked example', 'exam': 'Exam tip', 'idea': 'Big idea', 'remember': 'Remember'}

def render(text, doc, top=True):
    lines = text.split('\n')
    out = []
    i, n = 0, len(lines)
    open_sec = [False]
    mode = [None]

    def close_sec():
        if open_sec[0]:
            out.append('</section>'); open_sec[0] = False

    while i < n:
        ln = lines[i]
        if ln.strip() == '':
            i += 1; continue
        # fenced code / special blocks
        if ln.startswith('```'):
            info = ln[3:].strip().split(None, 1)
            lang = info[0] if info else 'text'
            rest = info[1] if len(info) > 1 else ''
            i += 1; code = []
            while i < n and not lines[i].startswith('```'):
                code.append(lines[i]); i += 1
            i += 1
            src = '\n'.join(code)
            args = parse_args(rest)
            flags = set(rest.split()) if rest else set()
            if lang == 'c' and 'run' in flags:
                doc.has.add('crun'); out.append(widget_tag('crun', args, src))
            elif lang == 'sql' and 'run' in flags:
                doc.has.add('sqlrun'); out.append(widget_tag('sqlrun', args, src))
            elif lang in ('flow', 'erd', 'memviz', 'stepper', 'timeline', 'grid'):
                doc.has.add(lang); out.append(widget_tag(lang, args, src))
            elif lang == 'output':
                out.append('<div class="outbox"><div class="outbox-h">Output</div><pre>%s</pre></div>' % esc(src))
            else:
                out.append('<pre class="code" data-lang="%s"><code>%s</code></pre>' % (attr(lang), esc(src)))
            continue
        # containers
        m = re.match(r'^:::(\w+)\s*(.*)$', ln)
        if m:
            kind, title = m.group(1), m.group(2).strip()
            depth = 1; i += 1; inner = []
            while i < n:
                if re.match(r'^:::\w+', lines[i]): depth += 1
                elif lines[i].strip() == ':::':
                    depth -= 1
                    if depth == 0: break
                inner.append(lines[i]); i += 1
            i += 1
            body = '\n'.join(inner)
            if kind == 'reveal':
                out.append('<details class="reveal"><summary>%s</summary><div class="reveal-b">%s</div></details>' % (inline(title or 'Show answer'), render(body, doc, False)))
            elif kind == 'checklist':
                doc.checklists += 1
                items = [inline(l[2:].strip()) for l in inner if l.startswith('- ')]
                cid = '%s#%d' % (doc.ctx, doc.checklists)
                lis = ''.join('<li><label><input type="checkbox" data-i="%d"><span>%s</span></label></li>' % (k, it) for k, it in enumerate(items))
                out.append('<div class="widget checklist" data-widget="checklist" data-id="%s">%s<ul class="checks">%s</ul></div>' % (attr(cid), '<div class="checklist-h">%s</div>' % inline(title) if title else '', lis))
                doc.has.add('checklist')
            elif kind == 'rubric':
                items = [inline(l[2:].strip()) for l in inner if l.startswith('- ')]
                lis = ''.join('<li><label><input type="checkbox"><span>%s</span></label></li>' % it for it in items)
                out.append('<div class="widget rubric" data-widget="rubric"><div class="checklist-h">%s</div><ul class="checks">%s</ul><div class="rubric-score"></div></div>' % (inline(title or 'Self-check'), lis))
            elif kind in CALLOUT:
                out.append('<div class="callout callout-%s"><div class="callout-h">%s</div>%s</div>' % (kind, inline(title) if title else CALLOUT[kind], render(body, doc, False)))
            else:
                warn('%s: unknown container :::%s' % (doc.ctx, kind))
            continue
        if ln.startswith('@widget '):
            parts = ln.split(None, 2)
            name = parts[1]
            args = parse_args(parts[2]) if len(parts) > 2 else {}
            doc.has.add(name); doc.widgets.append((name, args))
            out.append(widget_tag(name, args)); i += 1; continue
        if ln.startswith('## ') and top:
            close_sec()
            title = ln[3:].strip()
            sl = slug(title)
            mode[0] = sl
            doc.has.add('sec:' + sl)
            out.append('<section class="sec sec-%s"><h2 id="%s">%s</h2>' % (sl, sl, inline(title)))
            open_sec[0] = True; i += 1; continue
        if ln.startswith('### ') or ln.startswith('## '):
            out.append('<h3>%s</h3>' % inline(ln.lstrip('#').strip())); i += 1; continue
        if ln.startswith('#### '):
            out.append('<h4>%s</h4>' % inline(ln[5:].strip())); i += 1; continue
        if ln.startswith('$$') and ln.rstrip().endswith('$$') and len(ln.strip()) > 4:
            out.append('<div class="math display" data-tex="%s"></div>' % attr(ln.strip()[2:-2].strip())); i += 1; continue
        if ln.startswith('? '):
            qs, i = parse_questions(lines, i, doc.ctx)
            doc.quizzes.append(qs)
            out.append(widget_tag('quiz', {'k': len(doc.quizzes) - 1}))
            doc.has.add('quiz'); continue
        if ln.startswith('_ '):
            items, i = parse_gaps(lines, i, doc.ctx)
            doc.gaps.append(items)
            out.append(widget_tag('gaps', {'k': len(doc.gaps) - 1}))
            doc.has.add('gaps'); continue
        if ln.startswith('|') and i + 1 < n and re.match(r'^\|[\s:|-]+\|?\s*$', lines[i + 1]):
            head = split_row(ln); i += 2; rows = []
            while i < n and lines[i].startswith('|'):
                rows.append(split_row(lines[i])); i += 1
            h = '<div class="tablewrap"><table><thead><tr>%s</tr></thead><tbody>' % ''.join('<th>%s</th>' % inline(c) for c in head)
            for r in rows:
                h += '<tr>%s</tr>' % ''.join('<td>%s</td>' % inline(c) for c in r)
            out.append(h + '</tbody></table></div>'); continue
        if re.match(r'^(- |\d+\. )', ln):
            ordered = not ln.startswith('- ')
            items = []
            while i < n and (re.match(r'^(- |\d+\. )', lines[i]) or (lines[i].startswith('  ') and items)):
                if lines[i].startswith('  '):
                    items[-1] += '\n' + lines[i][2:] if lines[i].startswith('  ```') or '\n' in items[-1] else ' ' + lines[i].strip()
                else:
                    items.append(re.sub(r'^(- |\d+\. )', '', lines[i]))
                i += 1
            if mode[0] == 'key-terms' and top and not ordered:
                rows = ''
                for it in items:
                    parts = [p.strip() for p in it.split(' | ')]
                    if len(parts) != 3:
                        warn('%s: key term needs "term | meaning | Turkish": %s' % (doc.ctx, it[:60])); continue
                    doc.terms.append({'t': parts[0], 'm': parts[1], 'tr': parts[2]})
                    rows += '<tr><td><strong>%s</strong></td><td>%s</td><td lang="tr">%s</td></tr>' % (inline(parts[0]), inline(parts[1]), inline(parts[2]))
                out.append('<div class="tablewrap"><table class="terms"><thead><tr><th>English term</th><th>Meaning</th><th>Turkish</th></tr></thead><tbody>%s</tbody></table></div>' % rows)
            else:
                tag = 'ol' if ordered else 'ul'
                def item_html(it):
                    if '\n' in it:
                        first, rest = it.split('\n', 1)
                        return inline(first) + render(rest, doc, False)
                    return inline(it)
                out.append('<%s>%s</%s>' % (tag, ''.join('<li>%s</li>' % item_html(it) for it in items), tag))
            continue
        if ln.startswith('> '):
            q = []
            while i < n and lines[i].startswith('>'):
                q.append(lines[i][1:].strip()); i += 1
            out.append('<blockquote>%s</blockquote>' % render('\n'.join(q), doc, False)); continue
        para = []
        while i < n and lines[i].strip() != '' and not re.match(r'^(```|:::|## |### |#### |@widget |\? |_ |\||- |\d+\. |> )', lines[i]):
            para.append(lines[i].strip()); i += 1
        if not para:
            para.append(lines[i].strip()); i += 1
        out.append('<p>%s</p>' % inline(' '.join(para)))
    close_sec()
    return '\n'.join(out)

def front_matter(text, path):
    meta = {}
    if text.startswith('---\n'):
        end = text.index('\n---', 4)
        for ln in text[4:end].split('\n'):
            if ':' in ln:
                k, v = ln.split(':', 1); meta[k.strip()] = v.strip()
        text = text[end + 4:].lstrip('\n')
    else:
        warn('%s: no front matter' % path)
    return meta, text

def doc_page(path, ctx):
    meta, body = front_matter(read(path), path)
    d = Doc(ctx)
    htmls = render(body, d)
    page = {'html': htmls}
    if d.quizzes: page['quizzes'] = d.quizzes
    if d.gaps: page['gaps'] = d.gaps
    return meta, page, d

# ---------------------------------------------------------------- block files (exercises, challenges)
def parse_blocks(path):
    items = []
    cur = None; sec = None
    for ln in read(path).split('\n'):
        if ln.startswith('=== '):
            cur = {'head': [p.strip() for p in ln[4:].split(' | ')], 'prompt': [], 'secs': {}}
            items.append(cur); sec = None
        elif cur is None:
            continue
        elif ln.startswith('--- '):
            sec = ln[4:].strip(); cur['secs'][sec] = []
        elif sec is None:
            cur['prompt'].append(ln)
        else:
            cur['secs'][sec].append(ln)
    for it in items:
        it['prompt'] = '\n'.join(it['prompt']).strip()
        it['secs'] = {k: '\n'.join(v).strip('\n') for k, v in it['secs'].items()}
    return items

C_SKELETON = '#include <stdio.h>\n\nint main() {\n    // write your code here\n\n    return 0;\n}\n'

def build_c_exercises(path):
    exs = []
    for it in parse_blocks(path):
        h = it['head']
        if len(h) < 4:
            warn('exercise header needs "id | difficulty | kind | title": %s' % h); continue
        ex = {'id': h[0], 'diff': h[1], 'kind': h[2], 'title': h[3], 'lesson': '-'.join(h[0].split('-')[:2])}
        d = Doc(h[0])
        ex['prompt'] = render(it['prompt'], d, False)
        s = it['secs']
        if ex['kind'] == 'predict':
            if 'code' not in s: warn('%s: predict exercise needs --- code' % h[0])
            ex['code'] = s.get('code', '')
        else:
            if 'solution' not in s: warn('%s: needs --- solution' % h[0])
            ex['solution'] = s.get('solution', '')
            ex['starter'] = s.get('starter', C_SKELETON)
        if 'stdin' in s: ex['stdin'] = s['stdin']
        if 'checklist' in s: ex['checklist'] = [inline(l[2:]) for l in s['checklist'].split('\n') if l.startswith('- ')]
        if 'hint' in s: ex['hint'] = inline(s['hint'].strip())
        if ex['diff'] not in ('easy', 'medium', 'exam'): warn('%s: difficulty must be easy/medium/exam' % h[0])
        exs.append(ex)
    return exs

def build_sql_challenges(path):
    out = []
    for it in parse_blocks(path):
        h = it['head']
        if len(h) < 5:
            warn('challenge header needs "id | difficulty | topic | lesson | title": %s' % h); continue
        ch = {'id': h[0], 'diff': h[1], 'topic': h[2], 'lesson': h[3], 'title': h[4]}
        d = Doc(h[0])
        ch['prompt'] = render(it['prompt'], d, False)
        s = it['secs']
        if 'sql' not in s: warn('%s: needs --- sql' % h[0])
        ch['sql'] = s.get('sql', '')
        if 'check' in s: ch['check'] = s['check']
        if 'hint' in s: ch['hint'] = inline(s['hint'].strip())
        ch['ordered'] = bool(re.search(r'\border\s+by\b', re.sub(r'\([^()]*\)', '', ch.get('check') or ch['sql']), re.I))
        out.append(ch)
    return out

def build_bank(path, ctx):
    lines = [l for l in read(path).split('\n')]
    lines = [l for l in lines if not l.startswith('#')]
    i = 0
    while i < len(lines) and lines[i].strip() == '': i += 1
    qs, j = parse_questions(lines, i, ctx)
    all_qs = qs
    while j < len(lines):
        if lines[j].startswith('? '):
            more, j = parse_questions(lines, j, ctx); all_qs += more
        else:
            if lines[j].strip(): warn('%s: unparsed line in bank: %s' % (ctx, lines[j][:60]))
            j += 1
    return all_qs

# ---------------------------------------------------------------- main build
def write_js(name, call, obj):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n') as f:
        f.write(call + '(' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + ');\n')

def strip_tags(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()

def main():
    courses = json.loads(read(os.path.join(SRC, 'courses.json')))
    index = {'courses': [], 'lessons': {}, 'glossary': [], 'practice': [], 'flash': [], 'plan': None, 'tools': []}
    stats = []
    gloss = {}
    tools = json.loads(read(os.path.join(SRC, 'tools.json'))) if os.path.exists(os.path.join(SRC, 'tools.json')) else []
    index['tools'] = tools
    for c in courses:
        cid = c['id']
        cdir = os.path.join(SRC, cid)
        data = {'lessons': {}, 'bank': [], 'exercises': [], 'challenges': [], 'cheat': None, 'mocks': {}, 'extra': {}}
        cmeta = dict(c)
        d0 = Doc(cid + '/intro')
        cmeta['introHtml'] = render(c.get('intro', ''), d0, False)
        cmeta.pop('intro', None)
        cmeta['lessons'] = []
        files = sorted(glob.glob(os.path.join(cdir, '[0-9]*.md')))
        for path in files:
            base = os.path.basename(path)
            meta, page, d = doc_page(path, cid + '/' + base)
            lid = meta.get('id')
            if not lid:
                warn('%s: missing id' % path); continue
            wk = meta.get('week', '')
            mwk = re.match(r'\d+', wk)
            page.update({'id': lid, 'title': meta.get('title', lid), 'goal': meta.get('goal', ''), 'week': wk, 'minutes': int(meta.get('minutes', '15'))})
            if d.terms: page['terms'] = d.terms
            data['lessons'][lid] = page
            lm = {'id': lid, 'title': page['title'], 'week': wk, 'wk': int(mwk.group(0)) if mwk else 0, 'min': page['minutes'], 'goal': page['goal'], 'course': cid}
            if meta.get('kind'): lm['kind'] = meta['kind']
            cmeta['lessons'].append(lid)
            index['lessons'][lid] = lm
            for t in d.terms:
                key = t['t'].lower()
                if key in gloss:
                    if lid not in gloss[key]['l']: gloss[key]['l'].append(lid)
                else:
                    gloss[key] = {'t': t['t'], 'm': t['m'], 'tr': t['tr'], 'c': cid, 'l': [lid]}
            # template checks
            if meta.get('kind') not in ('overview', 'test', 'free'):
                for need, label in (('sec:common-mistakes', 'Common mistakes'), ('sec:key-terms', 'Key terms'), ('sec:quick-check', 'Quick check'), ('sec:try-it', 'Try it')):
                    if need not in d.has: warn('%s: lesson has no "%s" section' % (lid, label))
                if not page['goal']: warn('%s: lesson has no goal' % lid)
                if 'quiz' not in d.has and 'mcq' not in d.has: warn('%s: lesson has no quiz' % lid)
        # question bank
        bpaths = sorted(glob.glob(os.path.join(cdir, 'mcq*.txt')))
        if bpaths:
            for bpath in bpaths:
                data['bank'] += build_bank(bpath, cid + '/' + os.path.basename(bpath))
            tags = {}
            for q in data['bank']:
                tags.setdefault(q.get('tag', ''), 0); tags[q.get('tag', '')] += 1
            cmeta['bankTags'] = tags
            if '' in tags: warn('%s/mcq.txt: %d questions without a [tag]' % (cid, tags['']))
        # C exercises
        epaths = sorted(glob.glob(os.path.join(cdir, 'exercises*.txt')))
        if epaths:
            for epath in epaths:
                data['exercises'] += build_c_exercises(epath)
            for ex in data['exercises']:
                if ex['lesson'] not in index['lessons']: warn('%s: exercise points to unknown lesson %s' % (ex['id'], ex['lesson']))
                index['practice'].append({'id': ex['id'], 'c': cid, 'title': ex['title'], 'topic': ex['lesson'], 'diff': ex['diff'], 'kind': ex['kind'], 'href': '#/exercise/' + ex['id']})
        # SQL challenges
        for qpath in sorted(glob.glob(os.path.join(cdir, 'challenges*.txt'))):
            data['challenges'] += build_sql_challenges(qpath)
        if data['challenges']:
            for ch in data['challenges']:
                if ch['lesson'] not in index['lessons']: warn('%s: challenge points to unknown lesson %s' % (ch['id'], ch['lesson']))
                index['practice'].append({'id': ch['id'], 'c': cid, 'title': ch['title'], 'topic': ch['lesson'], 'diff': ch['diff'], 'kind': 'sql', 'href': '#/challenge/' + ch['id']})
        spath = os.path.join(cdir, 'seed.sql')
        if os.path.exists(spath): data['extra']['seed'] = read(spath)
        for jf in glob.glob(os.path.join(cdir, '*.json')):
            data['extra'][os.path.splitext(os.path.basename(jf))[0]] = json.loads(read(jf))
        # cheat sheet + written mocks + extra pages
        for name in ('cheatsheet', 'mock-midterm', 'mock-final', 'index', 'essentials'):
            pth = os.path.join(cdir, name + '.md')
            if os.path.exists(pth):
                meta, page, d = doc_page(pth, cid + '/' + name)
                page['title'] = meta.get('title', name)
                if meta.get('minutes'): page['minutes'] = int(meta['minutes'])
                if name == 'cheatsheet': data['cheat'] = page; cmeta['hasCheat'] = True
                elif name == 'essentials':
                    data['essentials'] = page; page['intro'] = meta.get('intro', '')
                    cmeta['ess'] = {'title': page['title'], 'min': page.get('minutes', 15), 'ideas': page['html'].count('callout-idea'), 'intro': meta.get('intro', '')}
                    if 'quiz' not in d.has: warn(cid + '/essentials.md has no quiz')
                elif name == 'index': data['extra']['index'] = page
                else:
                    kind = name.split('-')[1]; data['mocks'][kind] = page
                    cmeta.setdefault('writtenMocks', []).append(kind)
        # practice entries for bank quizzes
        if data['bank']:
            for lid in cmeta['lessons']:
                lm = index['lessons'][lid]
                tag = lid.split('-', 1)[1]
                cnt = sum(1 for q in data['bank'] if q.get('tag') == tag)
                if cnt:
                    index['practice'].append({'id': 'quiz-' + lid, 'c': cid, 'title': 'Quiz: ' + lm['title'] + ' (%d questions)' % cnt, 'topic': lid, 'diff': 'medium', 'kind': 'quiz', 'href': '#/quiz/%s/%s' % (cid, tag)})
        if c.get('mock') or cmeta.get('writtenMocks'):
            for kind in ('midterm', 'final'):
                if (c.get('mock') and kind in c['mock']) or kind in cmeta.get('writtenMocks', []):
                    index['practice'].append({'id': 'mock-%s-%s' % (cid, kind), 'c': cid, 'title': '%s mock exam' % kind.capitalize(), 'topic': '', 'diff': 'exam', 'kind': 'mock', 'href': '#/mock/%s/%s' % (cid, kind)})
        write_js(cid + '.js', 'CC.provide("%s",' % cid + 'x=>x)' if False else 'CC.provideCourse.bind(null,"%s")' % cid, data)
        index['courses'].append(cmeta)
        stats.append('%-7s lessons=%-3d exercises=%-4d challenges=%-3d bank=%-4d terms=%d' % (cid, len(cmeta['lessons']), len(data['exercises']), len(data['challenges']), len(data['bank']), sum(len(l.get('terms', [])) for l in data['lessons'].values())))
    for t in tools:
        index['practice'].append({'id': 'tool-' + t['id'], 'c': t['course'], 'title': t['title'], 'topic': t.get('topic', ''), 'diff': t.get('diff', 'medium'), 'kind': 'drill', 'href': '#/tool/' + t['id']})
    index['glossary'] = sorted(gloss.values(), key=lambda g: g['t'].lower())
    for fpath in [os.path.join(SRC, 'flashcards.txt')] + sorted(glob.glob(os.path.join(SRC, '*', 'flashcards.txt'))):
        if not os.path.exists(fpath): continue
        for ln in read(fpath).split('\n'):
            if ln.strip() and not ln.startswith('#'):
                parts = [p.strip() for p in ln.split(' | ')]
                if len(parts) == 3:
                    index['flash'].append({'c': parts[0], 'f': inline(parts[1]), 'b': inline(parts[2])})
                else:
                    warn('flashcards.txt: bad line: ' + ln[:60])
    ppath = os.path.join(SRC, 'plan.json')
    if os.path.exists(ppath):
        index['plan'] = json.loads(read(ppath))
        for w in index['plan']['weeks']:
            for it in w['items']:
                for lid in it.get('lessons', []):
                    if lid not in index['lessons']: warn('plan.json week %s: unknown lesson %s' % (w['week'], lid))
    write_js('index.js', 'CC.provideIndex', index)
    print('Built %d courses, %d lessons, %d glossary terms, %d practice items.' % (len(courses), len(index['lessons']), len(index['glossary']), len(index['practice'])))
    for s in stats: print('  ' + s)
    if WARN:
        print('\n%d warning(s):' % len(WARN))
        for w in WARN: print('  - ' + w)
    return 0

if __name__ == '__main__':
    sys.exit(main())
