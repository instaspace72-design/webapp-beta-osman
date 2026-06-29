/* ============================================================
   InstaSpace — Admin & Ops Console · shell, router, views
   Reuses webapp.css shell + wa-ui helpers (icon/toast/modal).
   ============================================================ */
(function(){
'use strict';
var icon=UI.icon, toast=UI.toast, money=ISPrefs?ISPrefs.money:UI.money;

/* extra icons */
var ADI = {
  flag:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  idcard:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="11" r="2.2"/><path d="M5.5 16a3 3 0 016 0M14 9h5M14 13h5"/>',
  scale:'<path d="M12 4v16M7 20h10"/><path d="M5 8l-2 5h6zM19 8l-2 5h6z"/><path d="M5 8h14"/>'
};
function aicon(n,c){ if(ADI[n]) return '<svg class="'+(c||'')+'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+ADI[n]+'</svg>'; return icon(n,c); }
function brandIcon(){ return (window.__resources&&window.__resources.iconCream)||'assets/icon_cream.png'; }

var NAV = [
  ['overview','Overview','home'],
  ['verification','Verification','shieldcheck'],
  ['disputes','Disputes','gavel'],
  ['compliance','Compliance','shield']
];

var Views = {};
var stateF = { ver:'all', comp:'all' };

/* ---------------- OVERVIEW ---------------- */
Views.overview = function(){
  var k=ADMIN.kpis();
  var kpi=function(lab,val,cap,pill,warn){ return '<div class="kpi'+(warn?' warn':'')+'"><div class="lab">'+lab+'</div><div class="big">'+val+'</div><div class="cap">'+(pill?'<span class="pill">'+pill+'</span>':'')+cap+'</div></div>'; };
  var zones=ADMIN.zones.map(function(z){
    return '<div class="zone"><div class="zh"><span class="zn">Zone '+z.zone+'</span><span class="zd">'+z.listings+' listings</span></div>'+
      '<div class="zbar"><i style="width:'+z.occ+'%"></i></div>'+
      '<div class="zrow"><span>Occupancy <b>'+z.occ+'%</b></span><span>Verified <b>'+z.verified+'%</b></span></div>'+
      '<div class="zrow"><span>Open disputes <b>'+z.disputes+'</b></span></div></div>';
  }).join('');
  var act=ADMIN.activity.map(function(a){ return '<div class="lrow" style="cursor:default"><div class="ico" style="color:'+(a.kind==='warn'?'#FF5C82':'var(--orange)')+'">'+icon(a.icon)+'</div><div><div class="tt" style="font-size:13.5px">'+a.t+'</div><div class="ds">'+a.s+'</div></div></div>'; }).join('');
  var pend=ADMIN.verifications.filter(function(v){return v.status==='pending';}).slice(0,4).map(function(v){
    return '<div class="qrow" data-go="verification"><div class="qav '+(v.kind==='listing'?'listing':'')+'">'+(v.kind==='listing'?icon('building'):aicon('idcard'))+'</div>'+
      '<div class="qmeta"><div class="tt">'+v.who+'</div><div class="ds"><span class="kindtag '+v.kind+'">'+v.kind+'</span>'+v.time+'</div></div>'+
      '<div class="qend"><div class="aiscore"><span class="lb">AI</span>'+v.ai+'%</div></div></div>';
  }).join('');
  return { title:'Overview', sub:'Platform health', html:
    '<div class="page-head"><div class="eyebrow" style="margin-bottom:8px">Good morning, '+ADMIN.org.user.split(' ')[0]+'</div><h1>Trust, holding across the platform.</h1></div>'+
    '<div class="adm-kpis">'+
      kpi('Verifications', k.verPending, 'awaiting review', 'Queue', true)+
      kpi('Open disputes', k.disputesOpen, 'in adjudication', null, k.disputesOpen>0)+
      kpi('Compliance flags', k.complianceFlags, 'need attention', null, k.complianceFlags>0)+
      kpi('Settlement today', '<span class="u">$</span>'+k.settlement, 'across all zones', '+14%')+
    '</div>'+
    '<div class="adm-cols">'+
      '<div class="panel"><div class="panel-head"><h3>Verification queue</h3><span class="count">'+k.verPending+' pending</span></div>'+pend+
        '<div style="padding:14px 18px;border-top:1px solid var(--cream-08)"><button class="btn btn-ghost sm" data-go="verification">Open queue '+icon('arrow')+'</button></div></div>'+
      '<div class="panel"><div class="panel-head"><h3>Activity</h3></div>'+act+'</div>'+
    '</div>'+
    '<div class="sec-title" style="margin:26px 0 14px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--cream-40)">Zones</div>'+
    '<div class="zones">'+zones+'</div>'
  };
};

/* ---------------- VERIFICATION QUEUE ---------------- */
Views.verification = function(){
  var f=stateF.ver;
  var list=ADMIN.verifications.filter(function(v){
    if(f==='all') return true; if(f==='approved') return v.status==='approved'; if(f==='rejected') return v.status==='rejected';
    return v.kind===f && v.status==='pending';
  });
  var chips=[['all','All'],['identity','Identity'],['listing','Listings'],['approved','Cleared'],['rejected','Returned']]
    .map(function(c){ return '<button class="fchip'+(f===c[0]?' on':'')+'" data-f="'+c[0]+'">'+c[1]+'</button>'; }).join('');
  var rows=list.map(function(v){
    var st = v.status==='approved'?'<span class="cstate cleared"><span class="d"></span>Cleared</span>'
           : v.status==='rejected'?'<span class="cstate missing"><span class="d"></span>Returned</span>'
           : '<span class="cstate review"><span class="d"></span>Pending</span>';
    return '<div class="qrow" data-open="'+v.id+'"><div class="qav '+(v.kind==='listing'?'listing':'')+'">'+(v.kind==='listing'?icon('building'):aicon('idcard'))+'</div>'+
      '<div class="qmeta"><div class="tt">'+v.who+'</div><div class="ds"><span class="kindtag '+v.kind+'">'+v.kind+'</span><span>'+(v.tier||v.cat)+'</span><span>·</span><span>'+v.id+'</span><span>·</span><span>'+v.time+'</span></div></div>'+
      '<div class="qend">'+st+'<div class="aiscore"><span class="lb">AI</span>'+v.ai+'%</div></div></div>';
  }).join('') || '<div style="padding:40px 18px;text-align:center;color:var(--cream-40)">Nothing in this view.</div>';
  return { title:'Verification', sub:'Identity & listings', wide:true, html:
    '<div class="page-head"><h1>Verification queue</h1></div>'+
    '<div class="adm-filters">'+chips+'</div>'+
    '<div class="panel">'+rows+'</div>',
    mount:function(root){
      root.querySelectorAll('[data-f]').forEach(function(b){ b.addEventListener('click',function(){ stateF.ver=b.getAttribute('data-f'); App.refresh(); }); });
      root.querySelectorAll('[data-open]').forEach(function(r){ r.addEventListener('click',function(){ App.go('verDetail',{id:r.getAttribute('data-open')}); }); });
    }
  };
};

Views.verDetail = function(p){
  var v=ADMIN.verification(p.id); if(!v) return Views.verification();
  var docs=v.docs.map(function(d){ return '<div class="detail-doc">'+icon('doc')+'<span>'+d+'</span><span class="ok">'+icon('check')+'Verified</span></div>'; }).join('');
  var decided = v.status!=='pending';
  return { title:v.who, sub:v.id, html:
    '<div class="adm-back" data-back>'+icon('arrow')+'Verification queue</div>'+
    '<div class="page-head"><div class="row center" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><h1 style="margin:0">'+v.who+'</h1><span class="kindtag '+v.kind+'">'+v.kind+'</span></div>'+
      '<div class="muted" style="color:var(--cream-56);font-size:14px;margin-top:8px">'+(v.kind==='identity'?'Requested '+v.tier+' identity verification':v.cat+' listing · GovShield review')+' · submitted '+v.time+'</div></div>'+
    '<div class="adm-cols">'+
      '<div><div class="sec-title" style="font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--cream-40);margin-bottom:12px">Documents</div>'+docs+
        '<div class="banner info" style="margin-top:16px"><div class="bi">'+icon('spark')+'</div><div><div class="bt">AI-Auditor assessment · '+v.ai+'% confidence</div><div class="bd">'+v.note+'</div></div></div>'+
        (decided ? '<div class="banner '+(v.status==='approved'?'ok':'')+'" style="margin-top:14px"><div class="bi">'+icon(v.status==='approved'?'check':'x')+'</div><div><div class="bt">'+(v.status==='approved'?'Cleared':'Returned to submitter')+'</div><div class="bd">This case has been decided.</div></div></div>'
          : '<div class="decision-bar"><button class="btn btn-primary" data-decide="approve">'+icon('check')+'Approve & clear</button><button class="btn btn-danger" data-decide="reject">Return for re-upload</button></div>') +
      '</div>'+
      '<div class="panel"><div class="panel-head"><h3>Trust summary</h3></div>'+
        '<div style="padding:16px 18px"><div class="kv"><span>Case</span><span>'+v.id+'</span></div>'+
        '<div class="kv"><span>Type</span><span style="text-transform:capitalize">'+v.kind+'</span></div>'+
        '<div class="kv"><span>'+(v.kind==='identity'?'Tier':'Category')+'</span><span>'+(v.tier||v.cat)+'</span></div>'+
        '<div class="kv"><span>AI confidence</span><span class="o">'+v.ai+'%</span></div>'+
        '<div class="kv"><span>Watchlist</span><span>No hits</span></div></div></div>'+
    '</div>',
    mount:function(root){
      var bk=root.querySelector('[data-back]'); if(bk) bk.addEventListener('click',function(){ App.go('verification'); });
      root.querySelectorAll('[data-decide]').forEach(function(b){ b.addEventListener('click',function(){
        var d=b.getAttribute('data-decide'); var node=root;
        var bar=root.querySelector('.decision-bar');
        UI.runAI(bar, d==='approve'?'Clearing verification':'Returning for re-upload', 'Notifying the submitter and updating their trust record.', 1400, function(){
          v.status = d==='approve'?'approved':'rejected'; ADMIN.save();
          toast(d==='approve'?'Verification cleared':'Returned to submitter');
          App.go('verification');
        });
      }); });
    }
  };
};

/* ---------------- DISPUTES ---------------- */
var STAGE = { review:['Reviewing','review'], evidence:['Gathering evidence','review'], decision:['Awaiting decision','expiring'], resolved:['Resolved','cleared'] };
Views.disputes = function(){
  var rows=ADMIN.disputes.map(function(d){
    var s=STAGE[d.stage];
    return '<div class="qrow" data-open="'+d.id+'"><div class="qav listing">'+aicon('scale')+'</div>'+
      '<div class="qmeta"><div class="tt">'+d.reason+'</div><div class="ds"><span>'+d.id+'</span><span>·</span><span>'+d.listing+'</span><span>·</span><span>'+d.claimant+' vs '+d.respondent+'</span></div></div>'+
      '<div class="qend"><span class="cstate '+s[1]+'"><span class="d"></span>'+s[0]+'</span>'+(d.amount?'<div class="aiscore"><span class="lb">'+d.cur+'</span>'+d.amount+'</div>':'')+'</div></div>';
  }).join('');
  return { title:'Disputes', sub:'Adjudication', wide:true, html:
    '<div class="page-head"><h1>Dispute resolution</h1></div><div class="panel">'+rows+'</div>',
    mount:function(root){ root.querySelectorAll('[data-open]').forEach(function(r){ r.addEventListener('click',function(){ App.go('disputeDetail',{id:r.getAttribute('data-open')}); }); }); }
  };
};

Views.disputeDetail = function(p){
  var d=ADMIN.dispute(p.id); if(!d) return Views.disputes();
  var s=STAGE[d.stage];
  var evi=d.evidence.map(function(e){ return '<div class="evi"><div class="dot"></div><div class="by">'+e.by+'</div><div class="et">'+e.t+'</div><div class="es">'+e.s+'</div></div>'; }).join('');
  var resolved = d.stage==='resolved';
  return { title:'Case '+d.id, sub:d.listing, html:
    '<div class="adm-back" data-back>'+icon('arrow')+'Disputes</div>'+
    '<div class="page-head"><div class="row center" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><h1 style="margin:0">'+d.reason+'</h1><span class="cstate '+s[1]+'"><span class="d"></span>'+s[0]+'</span></div>'+
      '<div class="muted" style="color:var(--cream-56);font-size:14px;margin-top:8px">'+d.id+' · '+d.listing+' · opened '+d.opened+' · '+d.sla+'</div></div>'+
    '<div class="adm-cols">'+
      '<div class="panel"><div class="panel-head"><h3>Evidence</h3><span class="count">'+d.evidence.length+' items</span></div><div style="padding:18px 18px 4px">'+evi+'</div></div>'+
      '<div>'+
        '<div class="panel"><div class="panel-head"><h3>Parties & amount</h3></div><div style="padding:16px 18px">'+
          '<div class="kv"><span>Claimant</span><span>'+d.claimant+'</span></div>'+
          '<div class="kv"><span>Respondent</span><span>'+d.respondent+'</span></div>'+
          '<div class="kv"><span>Category</span><span>'+d.cat+'</span></div>'+
          '<div class="kv total"><span>In escrow</span><span class="o">'+(d.amount?d.cur+' '+d.amount:'—')+'</span></div></div></div>'+
        (resolved ? '<div class="banner ok" style="margin-top:14px"><div class="bi">'+icon('check')+'</div><div><div class="bt">Resolved</div><div class="bd">'+(d.evidence[d.evidence.length-1].s)+'</div></div></div>'
          : '<div class="decision-bar" style="flex-direction:column"><button class="btn btn-primary block" data-resolve="host">Release escrow to host</button><button class="btn btn-ghost block" data-resolve="guest">Refund the guest</button><button class="btn btn-ghost block" data-resolve="split">Split 50 / 50</button></div>') +
      '</div>'+
    '</div>',
    mount:function(root){
      var bk=root.querySelector('[data-back]'); if(bk) bk.addEventListener('click',function(){ App.go('disputes'); });
      root.querySelectorAll('[data-resolve]').forEach(function(b){ b.addEventListener('click',function(){
        var how=b.getAttribute('data-resolve');
        var bar=root.querySelector('.decision-bar');
        UI.runAI(bar,'Applying resolution','Releasing escrow and notifying both parties.',1500,function(){
          d.stage='resolved';
          d.evidence.push({by:'Resolution', t:'Outcome', s: how==='host'?'Escrow released to host. Both parties notified.': how==='guest'?'Guest refunded in full. Both parties notified.':'Escrow split 50/50 by mutual fairness. Both parties notified.'});
          ADMIN.save(); toast('Case resolved'); App.go('disputes');
        });
      }); });
    }
  };
};

/* ---------------- COMPLIANCE ---------------- */
Views.compliance = function(){
  var f=stateF.comp;
  var list=ADMIN.compliance.filter(function(c){ return f==='all'?true:c.state===f; });
  var chips=[['all','All'],['cleared','Cleared'],['expiring','Expiring'],['review','In review'],['missing','Missing']]
    .map(function(c){ return '<button class="fchip'+(f===c[0]?' on':'')+'" data-f="'+c[0]+'">'+c[1]+'</button>'; }).join('');
  var rows=list.map(function(c){
    var lab={cleared:'Cleared',review:'In review',expiring:'Expiring',missing:'Missing'}[c.state];
    return '<tr><td data-l="Listing"><div class="cnm">'+c.listing+'</div><div class="csub">'+c.cat+' · Zone '+c.zone+'</div></td>'+
      '<td data-l="Owner">'+c.owner+'</td>'+
      '<td data-l="Document">'+c.doc+'</td>'+
      '<td data-l="Renews">'+c.renews+'</td>'+
      '<td data-l="Status"><span class="cstate '+c.state+'"><span class="d"></span>'+lab+'</span></td></tr>';
  }).join('');
  return { title:'Compliance', sub:'GovShield oversight', wide:true, html:
    '<div class="page-head"><h1>Compliance oversight</h1></div>'+
    '<div class="adm-filters">'+chips+'</div>'+
    '<div class="panel" style="padding:16px 6px 8px"><table class="ctable"><thead><tr><th>Listing</th><th>Owner</th><th>Document</th><th>Renews</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>',
    mount:function(root){ root.querySelectorAll('[data-f]').forEach(function(b){ b.addEventListener('click',function(){ stateF.comp=b.getAttribute('data-f'); App.refresh(); }); }); }
  };
};

/* ---------------- APP SHELL ---------------- */
var App = {
  cur:{ name:'overview', params:{} },
  boot:function(){
    this.applyTweaks();
    if(window.ISPrefs){ ISPrefs.apply(); ISPrefs.onChange(function(){ ISPrefs.apply(); }); }
    this.buildShell();
    document.addEventListener('click', function(e){
      var go=e.target.closest('[data-go]');
      if(go){ e.preventDefault(); App.go(go.getAttribute('data-go')); return; }
      if(e.target.closest('[data-notif]')){ App.notif(); return; }
    });
    document.getElementById('tweaksFab').addEventListener('click', function(){ var p=document.getElementById('tweaks'); if(p.classList.contains('on')) p.classList.remove('on'); else App.tweaks(); });
    this.landing();
  },
  landing:function(){
    var insta='Insta'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.25+i*0.06)+'s">'+c+'</span>'; }).join('');
    var space='Space'.split('').map(function(c,i){ return '<span class="ch" style="animation-delay:'+(0.55+i*0.06)+'s">'+c+'</span>'; }).join('');
    var el=document.getElementById('landing');
    el.innerHTML='<div class="grid-tx"></div>'+
      '<div class="land-eyebrow eyebrow">Admin & Ops Console · Trust & Compliance</div>'+
      '<div class="land-lock"><span class="mark"><img src="'+brandIcon()+'" alt=""></span></div>'+
      '<div class="land-wm wm">'+insta+'<span class="sp">'+space+'</span><span class="swoosh"></span></div>'+
      '<p class="land-tag">Verify identity and listings, resolve disputes, and oversee compliance across every zone. The control room for platform trust.</p>'+
      '<div class="land-cta"><button class="btn btn-primary lg" data-enter="1">Open console '+icon('arrow')+'</button></div>'+
      '<div class="land-foot"><span class="eyebrow" style="color:var(--cream-40)">Beta Version</span></div>';
    el.querySelector('[data-enter]').addEventListener('click', function(){ App.enter(); });
  },
  enter:function(){
    var el=document.getElementById('landing'); el.classList.add('hide'); setTimeout(function(){ el.style.display='none'; }, 650);
    document.getElementById('shell').classList.add('on');
    this.go('overview');
  },
  buildShell:function(){
    var o=ADMIN.org, k=ADMIN.kpis();
    var navHtml=NAV.map(function(it){ var badge=(it[0]==='verification'&&k.verPending)?'<span class="badge">'+k.verPending+'</span>':(it[0]==='disputes'&&k.disputesOpen)?'<span class="badge">'+k.disputesOpen+'</span>':''; return '<div class="nv" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>'; }).join('');
    var tabsHtml=NAV.map(function(it){ var badge=(it[0]==='verification'&&k.verPending)?'<span class="badge">'+k.verPending+'</span>':''; return '<div class="wa-tab" data-go="'+it[0]+'">'+icon(it[2])+'<span>'+it[1]+'</span>'+badge+'</div>'; }).join('');
    var shell=document.getElementById('shell');
    shell.innerHTML=
      '<aside class="wa-side">'+
        '<div class="brand"><span class="mark"><img src="'+brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div>'+
        '<div class="role-card"><div class="rc-top"><div class="av">'+o.initials+'</div><div><div class="nm">'+o.user+'</div><div class="rl">'+o.role+'</div></div></div></div>'+
        '<nav class="wa-nav">'+navHtml+'</nav>'+
        '<div class="side-foot"><a class="nv" href="InstaSpace Platform.html" style="text-decoration:none">'+icon('globe')+'<span>Platform</span></a><div class="eyebrow" style="padding:8px 4px 0">Beta Version</div></div>'+
      '</aside>'+
      '<div class="wa-main">'+
        '<div class="wa-topbar"><div class="pg" id="pgTitle">Overview</div>'+
          '<div class="wa-search" data-go="verification">'+icon('search')+'Search cases, listings, identities</div><div class="spacer"></div>'+
          '<div class="actions"><div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div>'+
          '<div class="iconbtn" data-go="overview"><span style="font-weight:800;font-size:13px;color:var(--cream)">'+o.initials+'</span></div></div></div>'+
        '<div class="wa-mtop"><div class="brand"><span class="mark"><img src="'+brandIcon()+'" alt=""></span><span class="wm">Insta<span class="sp">Space</span></span></div><div class="spacer"></div><div class="iconbtn" data-notif="1">'+icon('bell')+'<span class="ind"></span></div></div>'+
        '<div class="wa-content" id="content"></div>'+
      '</div>'+
      '<div class="wa-tabbar">'+tabsHtml+'</div>';
  },
  go:function(name, params){
    this.cur={ name:name, params:params||{} };
    var factory=Views[name]; if(!factory){ name='overview'; factory=Views.overview; }
    var v=factory(this.cur.params);
    var content=document.getElementById('content');
    content.innerHTML='<div class="wa-view'+(v.wide?' wide':'')+'">'+v.html+'</div>';
    content.scrollTop=0;
    var pg=document.getElementById('pgTitle'); if(pg) pg.innerHTML=v.title+(v.sub?'<span class="sub">'+v.sub+'</span>':'');
    var map={verDetail:'verification',disputeDetail:'disputes'};
    var active=map[name]||name;
    document.querySelectorAll('.wa-nav .nv').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
    document.querySelectorAll('.wa-tab').forEach(function(n){ n.classList.toggle('on', n.getAttribute('data-go')===active); });
    if(v.mount) v.mount(content.querySelector('.wa-view'));
    UI.closeModal(); this.closeNotif();
  },
  refresh:function(){ this.go(this.cur.name, this.cur.params); },
  notif:function(){
    var ex=document.getElementById('__notif'); if(ex){ ex.remove(); return; }
    var rows=ADMIN.activity.map(function(n){ return '<div class="lrow" style="cursor:default"><div class="ico" style="color:'+(n.kind==='warn'?'#FF5C82':'var(--orange)')+'">'+icon(n.icon)+'</div><div><div class="tt" style="font-size:13px">'+n.t+'</div><div class="ds">'+n.s+'</div></div></div>'; }).join('');
    var el=document.createElement('div'); el.className='notif'; el.id='__notif';
    el.innerHTML='<div style="padding:14px 16px;border-bottom:1px solid var(--aubergine-line);font-weight:800;font-size:14px">Activity</div>'+rows;
    document.querySelector('.wa-main').appendChild(el);
    setTimeout(function(){ document.addEventListener('click', App._away=function(e){ if(!e.target.closest('#__notif')&&!e.target.closest('[data-notif]')){ App.closeNotif(); } }); }, 10);
  },
  closeNotif:function(){ var n=document.getElementById('__notif'); if(n) n.remove(); if(this._away){ document.removeEventListener('click', this._away); this._away=null; } },
  tweaks:function(){
    var t=ADMIN.tweaks, p=document.getElementById('tweaks');
    p.innerHTML='<h4>Tweaks <span class="x" data-tx>'+icon('x','')+'</span></h4>'+
      '<div class="tw-row"><span class="k">Density</span><div class="seg"><button class="'+(t.density==='comfortable'?'on':'')+'" data-den="comfortable">Comfy</button><button class="'+(t.density==='compact'?'on':'')+'" data-den="compact">Compact</button></div></div>'+
      '<div class="tw-row"><span class="k">Reduce motion</span><div class="toggle'+(!t.motion?' on':'')+'" data-tw="motion"></div></div>'+
      '<div class="tw-row"><span class="k">Open the platform</span><a class="btn btn-ghost sm" href="InstaSpace Platform.html">Hub</a></div>';
    p.classList.add('on');
    p.querySelector('[data-tx]').addEventListener('click', function(){ p.classList.remove('on'); });
    p.querySelectorAll('[data-den]').forEach(function(b){ b.addEventListener('click', function(){ t.density=b.getAttribute('data-den'); ADMIN.save(); App.applyTweaks(); App.tweaks(); }); });
    p.querySelectorAll('[data-tw]').forEach(function(b){ b.addEventListener('click', function(){ t.motion=!t.motion; ADMIN.save(); App.applyTweaks(); App.tweaks(); }); });
  },
  applyTweaks:function(){ var t=ADMIN.tweaks; document.body.classList.toggle('compact', t.density==='compact'); document.documentElement.classList.toggle('noanim', !t.motion); }
};
window.App = App;
document.addEventListener('DOMContentLoaded', function(){ App.boot(); });
})();
