/* InstaSpace Web App — UI helpers, icons, components ================= */
(function(){
'use strict';

/* ---------- icon registry (stroke, 24 viewBox) ---------- */
var P = {
  home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h.01M12 7h.01M15 7h.01M9 11h.01M12 11h.01M15 11h.01M10 21v-4h4v4"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><circle cx="16.5" cy="13.5" r="1.3"/>',
  message:'<path d="M4 5h16v11H9l-4 3v-3H4z"/>',
  user:'<circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0114 0"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 5.5a3 3 0 010 5.8M21 20a6 6 0 00-5-5.9"/>',
  shield:'<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/>',
  shieldcheck:'<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><path d="M9 11.5l2 2 4-4.5"/>',
  gavel:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L4 14l3 3 7-7"/><path d="M3 21h10"/>',
  chart:'<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16l3-4 3 2 4-6"/>',
  check:'<path d="M5 13l4 4L19 7"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  chevd:'<path d="M6 9l6 6 6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  camera:'<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.4"/>',
  doc:'<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
  upload:'<path d="M12 16V5"/><path d="M8 9l4-4 4 4"/><path d="M5 19h14"/>',
  bell:'<path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 004 0"/>',
  swap:'<path d="M7 4l-3 3 3 3"/><path d="M4 7h12"/><path d="M17 20l3-3-3-3"/><path d="M20 17H8"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 113.5 2.3c-.8.4-1 .9-1 1.7M12 17h.01"/>',
  star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4 1.3 6L12 16.8 6.6 19.3l1.3-6-4.5-4 6-.7z"/>',
  heart:'<path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z"/>',
  arrow:'<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  pin:'<path d="M12 21s-6-5.2-6-10a6 6 0 0112 0c0 4.8-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  calendar:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M9 3v4M15 3v4"/>',
  logout:'<path d="M15 12H4"/><path d="M8 8l-4 4 4 4"/><path d="M14 4h5v16h-5"/>',
  refresh:'<path d="M20 11a8 8 0 10-1 5"/><path d="M20 5v6h-6"/>',
  send:'<path d="M4 12l16-7-7 16-2-7z"/>',
  filter:'<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>',
  trips:'<path d="M5 7h14l-1 13H6z"/><path d="M9 7V5a3 3 0 016 0v2"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  coin:'<circle cx="12" cy="12" r="8"/><path d="M12 8v8M9.5 9.5a2.5 2.5 0 012.5-1.5c1.4 0 2 .8 2 1.6 0 2-4.5 1.4-4.5 3.4 0 .9.8 1.5 2 1.5a2.5 2.5 0 002.4-1.5"/>'
};
function icon(name, cls){
  return '<svg class="'+(cls||'')+'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(P[name]||'')+'</svg>';
}

/* ---------- formatting ---------- */
function fmt(n){ return (Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function money(n, cur){ return (cur||Store.wallet().currency)+' '+fmt(n); }

/* ---------- toast ---------- */
var toastEl, toastTimer;
function toast(msg){
  if(!toastEl){ toastEl = document.getElementById('toast'); }
  if(!toastEl) return;
  toastEl.innerHTML = '<span class="d"></span><span>'+msg+'</span>';
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 1900);
}

/* ---------- modal ---------- */
function modal(inner, opts){
  opts = opts || {};
  closeModal();
  var scrim = document.createElement('div');
  scrim.className = 'scrim'; scrim.id = '__modal';
  scrim.innerHTML = '<div class="modal" role="dialog" aria-modal="true">'+inner+'</div>';
  document.body.appendChild(scrim);
  scrim.addEventListener('click', function(e){ if(e.target===scrim) closeModal(); });
  var x = scrim.querySelector('[data-x]'); if(x) x.addEventListener('click', closeModal);
  if(opts.onMount) opts.onMount(scrim.querySelector('.modal'));
  return scrim.querySelector('.modal');
}
function closeModal(){ var m = document.getElementById('__modal'); if(m) m.remove(); }

/* ---------- AI simulation ---------- */
function aiBlock(title, sub){
  return '<div class="aiwait">'+
    '<div class="orb">'+icon('spark')+'</div>'+
    '<div><div style="font-size:17px;font-weight:800;letter-spacing:-.01em">'+title+'</div>'+
    '<div class="muted" style="font-size:13px;margin-top:6px;max-width:34ch">'+sub+'</div></div>'+
    '<div class="prog"></div></div>';
}
var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function delay(ms, cb){ setTimeout(cb, REDUCED ? Math.min(ms,400) : ms); }
/* render loading into a node, then call done() after ms */
function runAI(node, title, sub, ms, done){
  node.innerHTML = aiBlock(title, sub);
  delay(ms||2000, done);
}

/* ---------- stars ---------- */
function stars(n, cls){
  var s='<span class="stars '+(cls||'')+'">';
  for(var i=1;i<=5;i++){ s += '<svg viewBox="0 0 24 24" class="'+(i<=n?'':'o')+'">'+P.star+'</svg>'; }
  return s+'</span>';
}

/* ---------- small helpers ---------- */
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function catBadge(cat){ return '<span class="chip" style="cursor:default">'+cat+'</span>'; }

function brandIcon(){ return (window.__resources&&window.__resources.iconCream)||'assets/icon_cream.png'; }

window.UI = { icon:icon, fmt:fmt, money:money, toast:toast, modal:modal, closeModal:closeModal,
  aiBlock:aiBlock, runAI:runAI, delay:delay, stars:stars, esc:esc, brandIcon:brandIcon, REDUCED:REDUCED };
})();
