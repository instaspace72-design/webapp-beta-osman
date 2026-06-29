/* InstaSpace — Property Manager Portal · shell, router, tweaks ======= */
(function(){
'use strict';
var icon=UI.icon, toast=UI.toast;

/* ---- extra icons (merge with wa-ui registry via fallback) ---- */
var PMI = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  rows:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="11" width="18" height="5" rx="1.5"/><rect x="3" y="18" width="18" height="3" rx="1.5"/>',
  download:'<path d="M12 4v10"/><path d="M8 11l4 4 4-4"/><path d="M5 20h14"/>',
  dots:'<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
  trendup:'<path d="M4 16l5-5 3 3 7-7"/><path d="M16 7h4v4"/>',
  key:'<circle cx="8" cy="14" r="4"/><path d="M11 11l9-9"/><path d="M17 4l3 3"/><path d="M14 7l3 3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18"/>',
  bed:'<path d="M3 18V8M3 12h18a0 0 0 010 0v6M21 18v-4"/><path d="M3 12V9a2 2 0 012-2h5a2 2 0 012 2v3"/>',
  layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M10 10v10"/>',
  factory:'<path d="M3 21V9l6 4V9l6 4V5l6 16z"/><path d="M3 21h18"/>'
};
function pmicon(name, cls){
  if(PMI[name]) return '<svg class="'+(cls||'')+'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+PMI[name]+'</svg>';
  return icon(name, cls);
}
window.pmicon = pmicon;
function brandIcon(){ return (window.__resources&&window.__resources.iconCream)||'assets/icon_cream.png'; }

/* ---- nav ---- */
var NAV = [
  ['home','Dashboard','home'],
  ['listings','Listings','building'],
  ['bookings','Bookings','calendar'],
  ['payouts','Payouts','wallet'],
  ['messages','Messages','message']
];

var App = {
  cur:{ name:'home', params:{} },

  boot:function(){
    this.applyTweaks();
    if(window.ISPrefs){ ISPrefs.apply(); ISPrefs.onChange(function(){ ISPrefs.apply(); }); }
    this.buildShell();
    document.addEventListener('click', function(e){
      var go=e.target.closest('[data-go]');
      if(go){ e.preventDefault(); App.go(go.getAttribute('data-go'), { id:go.getAttribute('data-id') }); return; }
    });
    document.getElementById('tweaksFab').addEventListener('click', function(){
      var p=document.getElementById('tweaks'); if(p.classList.contains('on')) p.classList.remove('on'); else App.tweaks();
    });
    // landing fade then enter
    this.landing();
  },

  landing:function(){
    var insta='Insta'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.25+i*0.06)+'s">'+c+'</span>'; }).join('');
    var space='Space'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.55+i*0.06)+'s">'+c+'</span>'; }).join('');
    var el=document.getElementById('landing');
    el.innerHTML='<div class="grid-tx"></div>'+
      '<div class="land-eyebrow eyebrow">Property Manager Portal</div>'+
      '<div class="land-lock"><span class="mark"><img src="'+brandIcon()+'" alt=""></span></div>'+
      '<div class="land-wm wm">'+insta+'<span class="sp">'+space+'</span><span class="swoosh"></span></div>'+
      '<p class="land-tag">Run a portfolio across markets, verified, occupied, and settled. One console for every listing, booking, and payout.</p>'+
      '<div class="land-cta"><button class="btn btn-primary lg" data-enter="1">Open console '+icon('arrow')+'</button></div>'+
      '<div class="land-foot"><span class="eyebrow" style="color:var(--cream-40)">Beta Version</span></div>';
    el.querySelector('[data-enter]').addEventListener('click', function(){ App.enter(); });
  },
  enter:function(){
    var el=document.getElementById('landing'); el.classList.add('hide');
    setTimeout(function(){ el.style.display='none'; }, 650);
    document.getElementById('shell').classList.add('on');
    this.go('home');
  },

  buildShell:function(){
    var o=PM.org, k=PM.kpis();
    var newInq=PM.inbox.filter(function(b){return b.status==='new';}).length;
    var unread=PM.threads.reduce(function(a,t){return a+t.unread;},0);
    var navHtml=NAV.map(function(it){
      var badge=(it[0]==='bookings'&&newInq)?'<span class="badge">'+newInq+'</span>':(it[0]==='messages'&&unread)?'<span class="badge">'+unread+'</span>':'';
      return '<div class="nv" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>';
    }).join('');
    var tabsHtml=NAV.map(function(it){
      var badge=(it[0]==='bookings'&&newInq)?'<span class="badge">'+newInq+'</span>':(it[0]==='messages'&&unread)?'<span class="badge">'+unread+'</span>':'';
      return '<div class="wa-tab" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>';
    }).join('');
    var shell=document.getElementById('shell');
    shell.innerHTML=
      '<aside class="wa-side">'+
        '<div class="brand"><span class="mark"><img src="'+brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div>'+
        '<div class="role-card pm-org"><div class="rc-top"><div class="av">'+o.short+'</div><div><div class="nm">'+o.name+'</div><div class="rl">'+o.user+' · '+o.role+'</div></div><span class="pm-plan">'+o.plan+'</span></div></div>'+
        '<nav class="wa-nav">'+navHtml+'</nav>'+
        '<div class="side-foot">'+
          '<a class="nv" href="InstaSpace Platform.html" style="text-decoration:none">'+icon('globe')+'<span>Platform</span></a>'+
          '<div class="nv" data-help="1">'+icon('help')+'<span>Help &amp; guides</span></div>'+
          '<div class="eyebrow">'+PM.listings.length+' listings · '+PM.owners.length+' owners</div>'+
        '</div>'+
      '</aside>'+
      '<div class="wa-main">'+
        '<div class="wa-topbar"><div class="pg" id="pgTitle">Dashboard</div>'+
          '<div class="wa-search" data-go="listings">'+icon('search')+'Search listings, bookings, owners</div><div class="spacer"></div>'+
          '<div class="actions">'+
            '<button class="btn btn-primary sm" data-go="listings">'+icon('plus')+'Add listing</button>'+
            '<div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div>'+
            '<div class="iconbtn" data-go="home"><span style="font-weight:800;font-size:13px;color:var(--cream)">'+o.initials+'</span></div>'+
          '</div></div>'+
        '<div class="wa-mtop"><div class="brand"><span class="mark"><img src="'+brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div><div class="spacer"></div><div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div></div>'+
        '<div class="wa-content" id="content"></div>'+
      '</div>'+
      '<div class="wa-tabbar">'+tabsHtml+'</div>';
    // notif handler
    document.querySelectorAll('[data-notif]').forEach(function(b){ b.addEventListener('click', function(){ App.notif(); }); });
    var hp=document.querySelector('[data-help]'); if(hp) hp.addEventListener('click', function(){ toast('Help & guides — opening support'); });
  },

  go:function(name, params){
    this.cur={ name:name, params:params||{} };
    var factory=(window.Views||{})[name]; if(!factory){ name='home'; factory=Views.home; }
    var v=factory(this.cur.params);
    var content=document.getElementById('content');
    content.innerHTML='<div class="wa-view'+(v.wide?' wide':'')+(v.flush?' flush':'')+'"'+(v.flush?' style="max-width:none;padding:24px 28px"':'')+'>'+v.html+'</div>';
    content.scrollTop=0;
    var pg=document.getElementById('pgTitle'); if(pg) pg.innerHTML=v.title+(v.sub?'<span class="sub">'+v.sub+'</span>':'');
    this.setActive(name);
    if(v.mount) v.mount(content.querySelector('.wa-view'));
    UI.closeModal();
  },
  refresh:function(){ this.go(this.cur.name, this.cur.params); },
  setActive:function(name){
    var map={ listing:'listings', booking:'bookings' };
    var active=map[name]||name;
    document.querySelectorAll('.wa-nav .nv').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
    document.querySelectorAll('.wa-tab').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
  },

  notif:function(){
    var ex=document.getElementById('__notif'); if(ex){ ex.remove(); return; }
    var rows=PM.activity.map(function(n){ return '<div class="lrow" style="cursor:default"><div class="ico" style="color:'+(n.kind==='warn'?'#FF5C82':'var(--orange)')+'">'+icon(n.icon)+'</div><div><div class="tt" style="font-size:13px">'+n.t+'</div><div class="ds">'+n.s+'</div></div></div>'; }).join('');
    var el=document.createElement('div'); el.className='notif'; el.id='__notif';
    el.innerHTML='<div style="padding:14px 16px;border-bottom:1px solid var(--aubergine-line);font-weight:800;font-size:14px">Activity</div>'+rows;
    document.querySelector('.wa-main').appendChild(el);
    setTimeout(function(){ document.addEventListener('click', App._away=function(e){ if(!e.target.closest('#__notif')&&!e.target.closest('[data-notif]')){ App.closeNotif(); } }); }, 10);
  },
  closeNotif:function(){ var n=document.getElementById('__notif'); if(n) n.remove(); if(this._away){ document.removeEventListener('click', this._away); this._away=null; } },

  /* ---- tweaks ---- */
  tweaks:function(){
    var t=PM.tweaks, p=document.getElementById('tweaks');
    p.innerHTML='<h4>Tweaks <span class="x" data-tx>'+icon('x','')+'</span></h4>'+
      '<div class="tw-row"><span class="k">Dashboard layout</span></div>'+
      '<div class="tw-row" style="border-top:none;padding-top:0"><div class="seg" style="width:100%"><button class="'+(t.dashLayout==='overview'?'on':'')+'" data-dash="overview">Overview</button><button class="'+(t.dashLayout==='ops'?'on':'')+'" data-dash="ops">Ops-first</button><button class="'+(t.dashLayout==='compact'?'on':'')+'" data-dash="compact">Compact</button></div></div>'+
      '<div class="tw-row"><span class="k">Listings default</span><div class="seg"><button class="'+(t.listView==='table'?'on':'')+'" data-lv="table">Table</button><button class="'+(t.listView==='grid'?'on':'')+'" data-lv="grid">Grid</button></div></div>'+
      '<div class="tw-row"><span class="k">Density</span><div class="seg"><button class="'+(t.density==='comfortable'?'on':'')+'" data-den="comfortable">Comfy</button><button class="'+(t.density==='compact'?'on':'')+'" data-den="compact">Compact</button></div></div>'+
      '<div class="tw-row"><span class="k">Reduce motion</span><div class="toggle'+(!t.motion?' on':'')+'" data-tw="motion"></div></div>';
    p.classList.add('on');
    p.querySelector('[data-tx]').addEventListener('click', function(){ p.classList.remove('on'); });
    p.querySelectorAll('[data-dash]').forEach(function(b){ b.addEventListener('click', function(){ t.dashLayout=b.getAttribute('data-dash'); PM.save(); App.applyTweaks(); App.tweaks(); if(App.cur.name==='home') App.refresh(); }); });
    p.querySelectorAll('[data-lv]').forEach(function(b){ b.addEventListener('click', function(){ t.listView=b.getAttribute('data-lv'); PM.save(); App.tweaks(); if(App.cur.name==='listings') App.refresh(); }); });
    p.querySelectorAll('[data-den]').forEach(function(b){ b.addEventListener('click', function(){ t.density=b.getAttribute('data-den'); PM.save(); App.applyTweaks(); App.tweaks(); }); });
    p.querySelectorAll('[data-tw]').forEach(function(b){ b.addEventListener('click', function(){ t.motion=!t.motion; PM.save(); App.applyTweaks(); App.tweaks(); }); });
  },
  applyTweaks:function(){
    var t=PM.tweaks;
    document.body.classList.toggle('compact', t.density==='compact');
    document.documentElement.classList.toggle('noanim', !t.motion);
    document.body.setAttribute('data-dash', t.dashLayout);
  }
};
window.App = App;
document.addEventListener('DOMContentLoaded', function(){ App.boot(); });
})();
