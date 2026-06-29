/* InstaSpace Web App — router, shell, boot ========================== */
(function(){
'use strict';
var icon=UI.icon, toast=UI.toast;

var NAV = {
  host:[
    {t:'main', items:[['home','Home','home'],['browse','Browse','search'],['properties','Properties','building'],['wallet','Wallet','wallet'],['messages','Messages','message'],['account','Account','user']]},
    {t:'Modules', items:[['yield','AI-Yield','chart'],['govshield','GovShield','shield'],['disputes','Disputes','gavel']]}
  ],
  guest:[
    {t:'main', items:[['home','Home','home'],['browse','Browse','search'],['trips','My trips','trips'],['wallet','Wallet','wallet'],['messages','Messages','message'],['account','Account','user']]}
  ]
};
var TABS = {
  host:[['home','Home','home'],['browse','Browse','search'],['properties','Properties','building'],['messages','Messages','message'],['account','Account','user']],
  guest:[['home','Home','home'],['browse','Browse','search'],['trips','Trips','trips'],['messages','Messages','message'],['account','Account','user']]
};

var App = {
  cur:{ name:'home', params:{} },

  /* ---------- landing ---------- */
  landing:function(){
    var insta='Insta'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.25+i*0.06)+'s">'+c+'</span>'; }).join('');
    var space='Space'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.55+i*0.06)+'s">'+c+'</span>'; }).join('');
    var el=document.getElementById('landing');
    el.innerHTML='<div class="grid-tx"></div>'+
      '<div class="land-eyebrow eyebrow">Trust &amp; settlement infrastructure · Dubai</div>'+
      '<div class="land-lock"><span class="mark"><img src="'+UI.brandIcon()+'" alt=""></span></div>'+
      '<div class="land-wm wm">'+insta+'<span class="sp">'+space+'</span><span class="swoosh"></span></div>'+
      '<p class="land-tag">Every verified space, settled the moment it\'s proven. The web app for hosts and guests across the corridor.</p>'+
      '<div class="land-cta"><button class="btn btn-primary lg" data-enter="host">Enter as host '+icon('arrow')+'</button>'+
        '<button class="btn btn-ghost lg" data-enter="guest">Enter as guest</button></div>'+
      '<div class="land-foot"><a class="eyebrow" style="cursor:pointer;color:var(--cream-56)" data-new="1">New here? Create an account →</a></div>';
    el.querySelectorAll('[data-enter]').forEach(function(b){ b.addEventListener('click',function(){ App.startEnter(b.getAttribute('data-enter')); }); });
    el.querySelector('[data-new]').addEventListener('click',function(){ Onboard.start('guest'); App.fadeLanding(); });
  },
  fadeLanding:function(){ var el=document.getElementById('landing'); el.classList.add('hide'); setTimeout(function(){ el.style.display='none'; },650); },
  startEnter:function(role){ this.fadeLanding(); this.enter(role); },

  /* ---------- enter app ---------- */
  enter:function(role){
    Store.role=role; Store.onboarded=true; Store.save();
    document.getElementById('shell').classList.add('on');
    this.buildShell();
    this.go('home');
  },

  buildShell:function(){
    var role=Store.role, u=Store.user();
    var shell=document.getElementById('shell');
    var navHtml=NAV[role].map(function(g){
      var head=g.t!=='main'?'<div class="sec">'+g.t+'</div>':'';
      return head+g.items.map(function(it){ var badge=(it[0]==='messages')?'<span class="badge">2</span>':(it[0]==='disputes')?'<span class="badge">1</span>':'';
        return '<div class="nv" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>'; }).join('');
    }).join('');
    var tabsHtml=TABS[role].map(function(it){ var badge=(it[0]==='messages')?'<span class="badge">2</span>':'';
      return '<div class="wa-tab" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>'; }).join('');
    shell.innerHTML=
      '<aside class="wa-side">'+
        '<div class="brand"><span class="mark"><img src="'+UI.brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div>'+
        '<div class="role-card" data-roleswap="1"><div class="rc-top"><div class="av">'+u.initials+'</div><div><div class="nm">'+u.name+'</div><div class="rl">'+u.role+' · Verified</div></div><span class="swap">'+icon('swap')+'</span></div></div>'+
        '<nav class="wa-nav">'+navHtml+'</nav>'+
        '<div class="side-foot"><a class="nv" href="InstaSpace Platform.html" style="text-decoration:none">'+icon('globe')+'<span>Platform</span></a><div class="eyebrow" style="padding:8px 4px 0">Beta Version</div></div>'+
      '</aside>'+
      '<div class="wa-main">'+
        '<div class="wa-topbar"><div class="pg" id="pgTitle">Home</div>'+
          '<div class="wa-search" data-go="browse">'+icon('search')+'Search verified spaces</div><div class="spacer"></div>'+
          '<div class="actions"><div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div>'+
          '<div class="iconbtn" data-go="wallet">'+icon('wallet')+'</div>'+
          '<div class="iconbtn" data-go="account"><span style="font-weight:800;font-size:13px;color:var(--cream)">'+u.initials+'</span></div></div></div>'+
        '<div class="wa-mtop"><div class="brand"><span class="mark"><img src="'+UI.brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div><div class="spacer"></div><div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div></div>'+
        '<div class="wa-content" id="content"></div>'+
      '</div>'+
      '<div class="wa-tabbar">'+tabsHtml+'</div>';
  },

  /* ---------- routing ---------- */
  go:function(name, params){
    if(name==='dispute-or-booking'){ return this.bookingDetail((params||{}).id); }
    this.cur={ name:name, params:params||{} };
    var factory=Views[name]; if(!factory){ name='home'; factory=Views.home; }
    var v=factory(this.cur.params);
    var content=document.getElementById('content');
    content.innerHTML='<div class="wa-view'+(v.wide?' wide':'')+'">'+v.html+'</div>';
    content.scrollTop=0;
    // title
    var pg=document.getElementById('pgTitle'); if(pg) pg.innerHTML=v.title+(v.sub?'<span class="sub">'+v.sub+'</span>':'');
    var mpg=document.querySelector('.wa-mtop'); // mobile shows brand; keep title implicit
    // active states
    this.setActive(name);
    if(v.mount) v.mount(content.querySelector('.wa-view'));
    UI.closeModal(); this.closeNotif();
  },
  refresh:function(){ this.go(this.cur.name, this.cur.params); },
  setActive:function(name){
    var map={listing:'browse',booking:'browse',property:'properties',addProperty:'properties',thread:'messages',dispute:'disputes',instapass:'account',settings:'account',help:'account'};
    var active=map[name]||name;
    document.querySelectorAll('.wa-nav .nv').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
    document.querySelectorAll('.wa-tab').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
  },

  bookingDetail:function(id){
    var b=Store.booking(id); if(!b) return; var p=Store.prop(b.prop);
    var open=Store.disputeState.filter(function(d){return d.prop===b.prop&&d.status!=='resolved';})[0];
    UI.modal('<div class="mhead"><h3>'+p.name+'</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
      '<div class="muted" style="font-size:13px;margin-bottom:14px">'+b.guest+' · '+b.from+'–'+b.to+' · '+b.guests+' guests</div>'+
      '<div class="kv"><span>'+UI.money(b.rate,'AED')+' × '+b.nights+' nights</span><span>'+UI.money(b.rate*b.nights,'AED')+'</span></div>'+
      '<div class="kv total"><span>Total</span><span class="o">'+UI.money(b.total,'AED')+'</span></div>'+
      '<div class="banner '+(b.status==='settled'?'ok':'info')+'" style="margin:14px 0"><div class="bi">'+icon(b.status==='settled'?'check':'lock')+'</div><div><div class="bt">'+(b.status==='settled'?'Settled to your wallet':b.status==='escrow'?'Held in escrow':'Upcoming')+'</div><div class="bd">'+(b.status==='settled'?'Released at verified check-in.':'Releases the moment check-in is verified.')+'</div></div></div>'+
      (open?'<button class="btn btn-danger block" data-disp="'+open.id+'">Open dispute case</button>':'<button class="btn btn-ghost block" data-x>Close</button>')+
      '</div>',
      {onMount:function(m){ m.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',UI.closeModal);});
        var dz=m.querySelector('[data-disp]'); if(dz) dz.addEventListener('click',function(){ UI.closeModal(); App.go('dispute',{id:dz.getAttribute('data-disp')}); }); }});
  },

  /* ---------- notifications ---------- */
  notif:function(){
    this.closeNotif();
    var rows=Store.data.notifs.map(function(n){ return '<div class="lrow" style="cursor:default"><div class="ico" style="color:'+(n.kind==='warn'?'#FF5C82':'var(--orange)')+'">'+icon(n.icon)+'</div><div><div class="tt" style="font-size:13.5px">'+n.t+'</div><div class="ds">'+n.s+'</div></div></div>'; }).join('');
    var el=document.createElement('div'); el.className='notif'; el.id='__notif';
    el.innerHTML='<div style="padding:14px 16px;border-bottom:1px solid var(--aubergine-line);font-weight:800;font-size:14px">Notifications</div>'+rows;
    var anchor=document.querySelector('.wa-main'); anchor.appendChild(el);
    setTimeout(function(){ document.addEventListener('click', App._notifAway=function(e){ if(!e.target.closest('#__notif')&&!e.target.closest('[data-notif]')) App.closeNotif(); }); },10);
  },
  closeNotif:function(){ var n=document.getElementById('__notif'); if(n) n.remove(); if(this._notifAway){ document.removeEventListener('click', this._notifAway); this._notifAway=null; } },

  /* ---------- role swap ---------- */
  swapRole:function(){
    var to=Store.role==='host'?'guest':'host';
    Store.role=to; Store.save(); this.buildShell(); this.go('home');
    toast('Switched to '+to+' view');
  },
  logout:function(){
    document.getElementById('shell').classList.remove('on');
    var el=document.getElementById('landing'); el.style.display='flex'; el.classList.remove('hide'); this.landing();
  },

  /* ---------- tweaks ---------- */
  tweaks:function(){
    var t=Store.tweaks; var p=document.getElementById('tweaks');
    p.innerHTML='<h4>Tweaks <span class="x" data-tx>'+icon('x','')+'</span></h4>'+
      '<div class="tw-row"><span class="k">Density</span><div class="seg"><button class="'+(t.density==='comfortable'?'on':'')+'" data-den="comfortable">Comfortable</button><button class="'+(t.density==='compact'?'on':'')+'" data-den="compact">Compact</button></div></div>'+
      '<div class="tw-row"><span class="k">Verified badges</span><div class="toggle'+(t.badges?' on':'')+'" data-tw="badges"></div></div>'+
      '<div class="tw-row"><span class="k">Reduce motion</span><div class="toggle'+(!t.motion?' on':'')+'" data-tw="motion"></div></div>'+
      '<div class="tw-row"><span class="k">Currency</span><div class="seg"><button class="'+(t.currency==='AED'?'on':'')+'" data-tcur="AED">AED</button><button class="'+(t.currency==='GBP'?'on':'')+'" data-tcur="GBP">GBP</button></div></div>'+
      '<div class="tw-row"><span class="k">Jump to role</span><button class="btn btn-ghost sm" data-trole>'+(Store.role==='host'?'Guest':'Host')+' view</button></div>';
    p.classList.add('on');
    p.querySelector('[data-tx]').addEventListener('click',function(){ p.classList.remove('on'); });
    p.querySelectorAll('[data-den]').forEach(function(b){ b.addEventListener('click',function(){ t.density=b.getAttribute('data-den'); Store.save(); App.applyTweaks(); App.tweaks(); }); });
    p.querySelectorAll('[data-tw]').forEach(function(b){ b.addEventListener('click',function(){ var k=b.getAttribute('data-tw'); if(k==='motion'){ t.motion=!t.motion; } else { t[k]=!t[k]; } Store.save(); App.applyTweaks(); App.tweaks(); App.refresh(); }); });
    p.querySelectorAll('[data-tcur]').forEach(function(b){ b.addEventListener('click',function(){ t.currency=b.getAttribute('data-tcur'); Store.save(); App.tweaks(); App.refresh(); }); });
    p.querySelector('[data-trole]').addEventListener('click',function(){ p.classList.remove('on'); App.swapRole(); });
  },
  applyTweaks:function(){
    var t=Store.tweaks;
    document.body.classList.toggle('compact', t.density==='compact');
    document.documentElement.classList.toggle('noanim', !t.motion);
  },

  /* ---------- boot ---------- */
  boot:function(){
    this.applyTweaks();
    if(window.ISPrefs){ ISPrefs.apply(); ISPrefs.onChange(function(){ ISPrefs.apply(); }); }
    // global delegation
    document.addEventListener('click', function(e){
      var go=e.target.closest('[data-go]');
      if(go){ App.go(go.getAttribute('data-go'), { id:go.getAttribute('data-id'), step:go.getAttribute('data-step') }); return; }
      var sv=e.target.closest('[data-save]');
      if(sv){ e.stopPropagation(); var id=sv.getAttribute('data-save'); var i=Store.saved.indexOf(id);
        if(i>-1){ Store.saved.splice(i,1); sv.classList.remove('on'); toast('Removed from saved'); } else { Store.saved.push(id); sv.classList.add('on'); toast('Saved'); } Store.save(); return; }
      if(e.target.closest('[data-roleswap]')){ App.swapRole(); return; }
      if(e.target.closest('[data-logout]')){ App.logout(); return; }
      if(e.target.closest('[data-notif]')){ if(document.getElementById('__notif')) App.closeNotif(); else App.notif(); return; }
    });
    document.getElementById('tweaksFab').addEventListener('click', function(){ var p=document.getElementById('tweaks'); if(p.classList.contains('on')) p.classList.remove('on'); else App.tweaks(); });
    // deep-link role from platform hub
    var rp=null; try{ rp=new URLSearchParams(location.search).get('role'); }catch(e){}
    if(rp==='guest'||rp==='host'){
      var lel=document.getElementById('landing'); if(lel){ lel.style.display='none'; }
      this.enter(rp);
      return;
    }
    // landing
    this.landing();
  }
};
window.App = App;
document.addEventListener('DOMContentLoaded', function(){ App.boot(); });
})();
