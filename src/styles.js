// ─── styles.js ────────────────────────────────────────────────────────────────
// All design tokens and global CSS for GoalPool.
// Import and inject via <style>{CSS}</style> in App.jsx.

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:     #0E0E0E;
  --paper:   #F5F0E8;
  --cream:   #EDE7D5;
  --amber:   #FF9500;
  --amber2:  #FFB800;
  --sage:    #3D7A5E;
  --rose:    #D94F3D;
  --muted:   #7A7060;
  --border:  #C8BFA8;
  --r:       4px;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Instrument Serif', serif;
  --font-mono:    'JetBrains Mono', monospace;
}

html, body { height: 100%; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  min-height: 100vh;
}

body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 9999; opacity: .6;
}

/* ── Shell ── */
.shell { display: flex; height: 100vh; overflow: hidden; }

/* ── Sidebar ── */
.sidebar {
  width: 220px; flex-shrink: 0;
  background: var(--ink); color: var(--paper);
  display: flex; flex-direction: column;
  border-right: 3px solid var(--ink);
  position: relative; overflow: hidden;
}
.sidebar::before {
  content: '';
  position: absolute; top: -60px; right: -40px;
  width: 160px; height: 160px;
  background: var(--amber); border-radius: 50%; opacity: .08;
}
.sidebar-logo { padding: 28px 20px 20px; border-bottom: 1px solid rgba(255,255,255,.1); }
.logo-word {
  font-family: var(--font-display);
  font-size: 32px; letter-spacing: 2px;
  color: var(--amber); display: block; line-height: 1;
}
.logo-sub {
  font-family: var(--font-mono);
  font-size: 10px; color: rgba(255,255,255,.35);
  text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;
}
.sidebar-nav { flex: 1; padding: 16px 0; }
.nav-section {
  padding: 8px 20px 4px;
  font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px;
  color: rgba(255,255,255,.25); text-transform: uppercase;
}
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px; cursor: pointer;
  font-family: var(--font-mono); font-size: 13px; font-weight: 500;
  color: rgba(255,255,255,.55); transition: all .15s;
  border-left: 3px solid transparent;
}
.nav-item:hover { color: var(--paper); background: rgba(255,255,255,.05); }
.nav-item.active { color: var(--amber); border-left-color: var(--amber); background: rgba(255,149,0,.08); }
.nav-badge {
  margin-left: auto;
  background: var(--rose); color: #fff;
  font-size: 10px; font-weight: 600;
  padding: 1px 6px; border-radius: 20px;
}
.sidebar-wallet {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,.1);
  font-family: var(--font-mono); font-size: 11px;
  color: rgba(255,255,255,.35);
}
.wallet-dot {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%;
  background: var(--sage); margin-right: 6px;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Content ── */
.content { flex: 1; overflow-y: auto; background: var(--paper); }
.page { padding: 40px 48px; max-width: 900px; animation: fadeUp .3s ease; }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

/* ── Page header ── */
.page-eyebrow {
  font-family: var(--font-mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--muted); margin-bottom: 6px;
}
.page-title {
  font-family: var(--font-display); font-size: 52px;
  letter-spacing: 1px; line-height: 1;
  color: var(--ink); margin-bottom: 4px;
}
.page-title span { color: var(--amber); }
.page-sub { font-size: 15px; color: var(--muted); font-style: italic; margin-bottom: 36px; }
.divider { border: none; border-top: 2px solid var(--border); margin: 32px 0; }

/* ── Section ── */
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.section-label { font-family: var(--font-display); font-size: 24px; letter-spacing: 1px; }
.section-count { font-family: var(--font-mono); font-size: 12px; color: var(--muted); }

/* ── Cards ── */
.card-list { display: flex; flex-direction: column; gap: 12px; }
.card {
  background: #fff; border: 2px solid var(--border);
  border-radius: var(--r); padding: 20px 24px;
  transition: border-color .15s, box-shadow .15s;
  position: relative; overflow: hidden;
}
.card:hover { border-color: var(--ink); box-shadow: 4px 4px 0 var(--ink); }
.card-accent { position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
.card-accent.amber { background: var(--amber); }
.card-accent.sage  { background: var(--sage); }
.card-accent.rose  { background: var(--rose); }
.card-accent.muted { background: var(--border); }

.card-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.card-body { flex: 1; }
.card-title { font-family: var(--font-body); font-size: 17px; font-weight: 600; margin-bottom: 2px; }
.card-meta  { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
.card-desc  { font-size: 13px; color: var(--muted); margin-top: 6px; font-style: italic; }
.card-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

/* ── Tags ── */
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: var(--font-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: .8px;
  padding: 3px 8px; border-radius: 2px; font-weight: 600;
}
.tag-amber { background: rgba(255,149,0,.12); color: #8B5000; border: 1px solid rgba(255,149,0,.3); }
.tag-sage  { background: rgba(61,122,94,.1);  color: var(--sage);  border: 1px solid rgba(61,122,94,.25); }
.tag-rose  { background: rgba(217,79,61,.1);  color: var(--rose);  border: 1px solid rgba(217,79,61,.25); }
.tag-muted { background: rgba(0,0,0,.04); color: var(--muted); border: 1px solid var(--border); }

/* ── Buttons ── */
.btn {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  padding: 9px 16px; border-radius: var(--r); border: 2px solid;
  cursor: pointer; transition: all .12s; letter-spacing: .3px; white-space: nowrap;
}
.btn:disabled { opacity: .35; cursor: not-allowed; }
.btn-ink   { background: var(--ink);   color: var(--paper); border-color: var(--ink); }
.btn-ink:hover:not(:disabled)   { background: #2a2a2a; }
.btn-amber { background: var(--amber); color: var(--ink);   border-color: var(--amber); }
.btn-amber:hover:not(:disabled) { background: var(--amber2); border-color: var(--amber2); }
.btn-sage  { background: var(--sage);  color: #fff;         border-color: var(--sage); }
.btn-rose  { background: var(--rose);  color: #fff;         border-color: var(--rose); }
.btn-ghost { background: transparent;  color: var(--ink);   border-color: var(--border); }
.btn-ghost:hover:not(:disabled) { border-color: var(--ink); }
.btn-sm { padding: 6px 12px; font-size: 11px; }

/* ── Stats ── */
.stats-row { display: flex; gap: 16px; margin-bottom: 32px; }
.stat-box {
  flex: 1; background: #fff; border: 2px solid var(--border);
  border-radius: var(--r); padding: 16px 20px;
}
.stat-num { font-family: var(--font-display); font-size: 36px; color: var(--ink); line-height: 1; }
.stat-num.amber { color: var(--amber); }
.stat-num.sage  { color: var(--sage);  }
.stat-num.rose  { color: var(--rose);  }
.stat-lbl {
  font-family: var(--font-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-top: 2px;
}

/* ── Progress ── */
.progress-wrap { background: var(--cream); border-radius: 2px; height: 6px; overflow: hidden; margin-top: 8px; }
.progress-fill { height: 100%; border-radius: 2px; background: var(--amber); transition: width .4s ease; }
.progress-fill.done { background: var(--sage); }

/* ── Avatar ── */
.avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--ink); color: var(--paper);
  font-family: var(--font-display); font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; border: 2px solid var(--border);
}
.avatar-sm { width: 28px; height: 28px; font-size: 12px; }
.avatar-group { display: flex; }
.avatar-group .avatar { margin-left: -8px; border: 2px solid var(--paper); }
.avatar-group .avatar:first-child { margin-left: 0; }

/* ── Modal ── */
.overlay {
  position: fixed; inset: 0; background: rgba(14,14,14,.6); z-index: 500;
  display: flex; align-items: center; justify-content: center; padding: 20px;
  backdrop-filter: blur(4px);
}
.modal {
  background: var(--paper); border: 3px solid var(--ink);
  border-radius: var(--r); width: 100%; max-width: 500px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 8px 8px 0 var(--ink); animation: modalIn .2s ease;
}
@keyframes modalIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
.modal-header {
  padding: 24px 28px 20px; border-bottom: 2px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
}
.modal-title { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; }
.modal-close { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted); padding: 0 4px; }
.modal-body   { padding: 24px 28px; }
.modal-footer { padding: 16px 28px; border-top: 2px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }

/* ── Form ── */
.field { margin-bottom: 18px; }
.label {
  display: block; font-family: var(--font-mono); font-size: 10px;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 6px; font-weight: 600;
}
.input, .textarea, .select {
  width: 100%; padding: 11px 14px;
  background: #fff; border: 2px solid var(--border); border-radius: var(--r);
  font-family: var(--font-mono); font-size: 13px; color: var(--ink);
  outline: none; transition: border-color .15s;
}
.input:focus, .textarea:focus, .select:focus { border-color: var(--ink); }
.textarea { resize: vertical; min-height: 80px; font-family: var(--font-body); font-size: 14px; }
.input-row { display: flex; gap: 10px; }
.input-row .field { flex: 1; margin-bottom: 0; }
.checkbox-row { display: flex; align-items: center; gap: 10px; }
.checkbox-row input[type=checkbox] { width: 18px; height: 18px; accent-color: var(--amber); cursor: pointer; }
.checkbox-label { font-family: var(--font-mono); font-size: 13px; }

/* ── Bet specifics ── */
.bet-amount { font-family: var(--font-display); font-size: 32px; color: var(--amber); line-height: 1; }
.bet-vs { font-family: var(--font-mono); font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin: 4px 0; }
.bet-condition { font-size: 13px; font-style: italic; color: var(--muted); margin-top: 6px; }

/* ── Deadline ── */
.deadline { font-family: var(--font-mono); font-size: 11px; }
.deadline.urgent { color: var(--rose); }
.deadline.ok     { color: var(--sage); }
.deadline.past   { color: var(--muted); text-decoration: line-through; }

/* ── Toast ── */
.toasts {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 600; display: flex; flex-direction: column; gap: 8px; align-items: center;
}
.toast {
  background: var(--ink); color: var(--paper);
  font-family: var(--font-mono); font-size: 13px;
  padding: 12px 20px; border-radius: var(--r);
  border-left: 4px solid var(--amber);
  animation: toastIn .2s ease; white-space: nowrap;
}
.toast.success { border-left-color: var(--sage); }
.toast.error   { border-left-color: var(--rose); }
@keyframes toastIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── Empty state ── */
.empty {
  text-align: center; padding: 48px 20px;
  border: 2px dashed var(--border); border-radius: var(--r);
}
.empty-icon { font-size: 36px; margin-bottom: 8px; }
.empty-text { font-size: 14px; color: var(--muted); font-style: italic; }

/* ── Responsive ── */
@media (max-width: 700px) {
  .shell { flex-direction: column; }
  .sidebar { width: 100%; height: auto; flex-direction: row; overflow-x: auto; }
  .sidebar-logo, .sidebar-wallet { display: none; }
  .sidebar-nav { display: flex; flex-direction: row; padding: 0; }
  .nav-section { display: none; }
  .nav-item {
    flex-direction: column; gap: 2px; padding: 12px 16px;
    font-size: 10px; border-left: none; border-bottom: 3px solid transparent;
  }
  .nav-item.active { border-bottom-color: var(--amber); border-left: none; }
  .page { padding: 24px 20px; }
  .stats-row { flex-wrap: wrap; }
  .page-title { font-size: 38px; }
}
`;