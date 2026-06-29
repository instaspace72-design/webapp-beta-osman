/* InstaSpace Web App — host views: properties, add-property wizard,
   wallet, AI-Yield, GovShield, disputes ============================== */
(function(){
'use strict';
var icon=UI.icon, money=UI.money, fmt=UI.fmt, toast=UI.toast;
var Views=window.Views||{};

/* ---------- PROPERTIES (host portfolio) ---------- */
Views.properties=function(){
  var mine=Store.data.portfolio.map(function(id){return Store.prop(id);});
  var cards=mine.map(function(p){
    return '<div class="prop" data-go="property" data-id="'+p.id+'">'+
      '<div class="img '+(p.img||'')+'"><span class="vbadge"><span class="d"></span>Verified</span><span class="cat">'+p.cat+'</span></div>'+
      '<div class="info"><div class="t"><span class="nm">'+p.name+'</span><span class="pr">'+money(p.price,'AED')+'<small>/night</small></span></div>'+
      '<div class="meta">'+p.city+' · '+UI.stars(Math.round(p.rating))+' '+p.rating+' · '+p.reviews+' reviews</div></div></div>'; }).join('');
  return { title:'Properties', sub:'Your portfolio', wide:true, html:
    '<div class="page-head"><div class="row between center"><div><h1>Your properties</h1><p>Create, verify, publish, retire.</p></div><button class="btn btn-primary" data-go="addProperty">'+icon('plus')+'Add property</button></div></div>'+
    '<div class="grid g-3">'+cards+'</div>' };
};

/* ---------- PROPERTY DETAIL (host) ---------- */
Views.property=function(p1){
  var p=Store.prop(p1.id)||Store.data.properties[0];
  return { title:p.name, sub:'Manage listing', wide:true, html:
    '<div style="height:200px;border-radius:18px;position:relative;overflow:hidden;margin-bottom:18px;background:radial-gradient(120% 120% at 30% 0,#3a1a54,#1c0c30)"><span class="vbadge" style="top:14px;left:14px"><span class="d"></span>Live · Verified</span></div>'+
    '<div class="row between center" style="margin-bottom:18px;flex-wrap:wrap;gap:12px"><div><h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em">'+p.name+'</h1><div class="muted" style="font-size:14px;margin-top:5px">'+p.city+' · '+p.cat+'</div></div>'+
      '<div class="row" style="gap:10px"><button class="btn btn-ghost sm" data-go="yield">'+icon('chart')+'Pricing</button><button class="btn btn-ghost sm" data-edit>Edit details</button><button class="btn btn-danger sm" data-pause>Pause listing</button></div></div>'+
    '<div class="grid g-4" style="margin-bottom:18px">'+
      '<div class="stat"><div class="lab">Nightly rate</div><div class="big"><span class="u">AED</span>'+fmt(p.price)+'</div><div class="cap up">AI-Yield active</div></div>'+
      '<div class="stat"><div class="lab">Rating</div><div class="big">'+p.rating+'</div><div class="cap">'+p.reviews+' reviews</div></div>'+
      '<div class="stat"><div class="lab">AI-Auditor</div><div class="big">'+p.auditScore+'</div><div class="cap up">Condition verified</div></div>'+
      '<div class="stat"><div class="lab">GovShield</div><div class="big" style="font-size:20px;padding-top:6px">Cleared</div><div class="cap">Renews in 240 days</div></div>'+
    '</div>'+
    '<div class="grid g-2">'+
      '<div class="card"><div class="sec-sub" style="margin-top:0">'+icon('shieldcheck','')+' Condition check (AI-Auditor)</div><div class="checks">'+
        crow('ok','Living area','Clear')+crow('ok','Kitchen &amp; cooktop','Clear')+crow('ok','Bedrooms','Clear')+crow('ok','Smoke &amp; safety','Clear')+crow('ok','Title match','Confirmed')+'</div></div>'+
      '<div class="card"><div class="sec-sub" style="margin-top:0">'+icon('shield','')+' Compliance (GovShield)</div><div class="checks">'+
        crow('ok','Trade / tenancy authorisation','Verified')+crow('ok','Title NOC','Verified')+crow('ok','Registry cross-check','Passed')+'</div>'+
        '<button class="btn btn-ghost block sm" style="margin-top:14px" data-go="govshield">Open compliance centre</button></div>'+
    '</div>',
    mount:function(root){
      var e=root.querySelector('[data-edit]'); if(e) e.addEventListener('click',function(){ toast('Edit details — opening editor'); });
      var pa=root.querySelector('[data-pause]'); if(pa) pa.addEventListener('click',function(){ toast('Listing paused · existing bookings are safe'); });
    } };
};
function crow(s,t,st){ var ic=s==='miss'?'<path d="M6 6l12 12M18 6L6 18"/>':s==='pend'?'<circle cx="12" cy="12" r="7"/><path d="M12 9v3l2 2"/>':'<path d="M5 13l4 4L19 7"/>';
  return '<div class="crow '+s+'"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">'+ic+'</svg></span>'+t+'<span class="st">'+st+'</span></div>'; }

/* ---------- ADD PROPERTY WIZARD ---------- */
var draft={ name:'', cat:'Residential', city:'', price:'' };
Views.addProperty=function(p1){
  var step=p1.step||'details';
  var idx={details:0,audit:1,compliance:2,publish:3}[step];
  var body;
  if(step==='details'){
    body='<div class="card pad-lg"><div class="sec-sub" style="margin-top:0">Listing details</div>'+
      '<div class="field"><label>Property name</label><input id="f_name" placeholder="e.g. Marina Gate · 2BR" value="'+UI.esc(draft.name)+'"></div>'+
      '<div class="field"><label>Category</label><div class="seg" id="f_cat"><button class="'+(draft.cat==='Residential'?'on':'')+'" data-c="Residential">Residential</button><button class="'+(draft.cat==='Commercial'?'on':'')+'" data-c="Commercial">Commercial</button><button class="'+(draft.cat==='Industrial'?'on':'')+'" data-c="Industrial">Industrial</button></div></div>'+
      '<div class="field"><label>Location</label><input id="f_city" placeholder="Area, city" value="'+UI.esc(draft.city)+'"></div>'+
      '<div class="field"><label>Nightly rate (AED)</label><input id="f_price" type="number" placeholder="540" value="'+UI.esc(draft.price)+'"></div>'+
      '<button class="btn btn-primary block" data-next="audit">Continue '+icon('arrow')+'</button></div>';
  } else if(step==='audit'){
    body='<div class="card pad-lg" id="auditCard">'+auditStage(0)+'</div>';
  } else if(step==='compliance'){
    body='<div class="card pad-lg" id="compCard">'+compStage(0)+'</div>';
  } else {
    body='<div class="center" style="padding:14px 0"><div class="ring" style="--p:100;margin:0 auto 18px;width:74px;height:74px">'+icon('check','')+'</div>'+
      '<h2 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px">'+(draft.name||'Your space')+' is live</h2>'+
      '<p class="muted" style="font-size:14px;max-width:42ch;margin:0 auto 8px">Condition verified, compliance cleared, and ready to settle instantly at check-in.</p>'+
      '<div class="row center" style="gap:8px;justify-content:center;margin:18px 0"><span class="badge ok"><span class="d"></span>AI-Auditor 96</span><span class="badge ok"><span class="d"></span>GovShield cleared</span></div>'+
      '<div class="row" style="gap:10px;max-width:360px;margin:0 auto"><button class="btn btn-primary" style="flex:1" data-go="properties">View portfolio</button><button class="btn btn-ghost" style="flex:1" data-go="home">Done</button></div></div>';
  }
  return { title:'Add property', sub:'Auditor · GovShield · Publish', html:
    '<div style="max-width:600px;margin:0 auto"><div class="steps" style="margin-bottom:26px">'+
      stepDots(['Details','AI-Auditor','GovShield','Publish'], idx)+'</div>'+body+'</div>',
    mount:function(root){
      // details
      var n=root.querySelector('#f_name'), c=root.querySelector('#f_city'), pr=root.querySelector('#f_price');
      if(n){ root.querySelectorAll('#f_cat [data-c]').forEach(function(b){ b.addEventListener('click',function(){ draft.cat=b.getAttribute('data-c'); root.querySelectorAll('#f_cat [data-c]').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); }); }); }
      var nx=root.querySelector('[data-next]'); if(nx) nx.addEventListener('click',function(){ draft.name=n.value||'Marina Gate · 2BR'; draft.city=c.value||'Dubai Marina'; draft.price=pr.value||'540'; App.go('addProperty',{step:'audit'}); });
      // audit
      var ac=root.querySelector('#auditCard');
      if(ac){ var run=ac.querySelector('[data-run]'); if(run) run.addEventListener('click',function(){ ac.innerHTML=UI.aiBlock('Reading your space','AI-Auditor is checking condition, fixtures, and safety against the InstaSpace Minimum Standard.'); UI.delay(2400,function(){ ac.innerHTML=auditStage(2); wireAudit(ac); }); }); }
      // compliance
      var cc=root.querySelector('#compCard');
      if(cc){ wireComp(cc); }
    } };
  function wireAudit(card){ var b=card.querySelector('[data-next2]'); if(b) b.addEventListener('click',function(){ App.go('addProperty',{step:'compliance'}); }); }
};
function auditStage(s){
  if(s===0) return '<div class="sec-sub" style="margin-top:0">'+icon('camera','')+' AI-Auditor</div>'+
    '<h2 style="font-size:21px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">Verify your space</h2>'+
    '<p class="muted" style="font-size:14px;margin-bottom:16px">A short photo walk-through lets AI-Auditor confirm condition and unlock instant settlement at check-in.</p>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">'+
      ['Living','Kitchen','Bedroom'].map(function(r){return '<div style="aspect-ratio:1;border-radius:12px;border:1.5px dashed var(--cream-24);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:var(--cream-40);font-size:11px;background:var(--cream-04)">'+icon('camera','')+r+'</div>';}).join('')+'</div>'+
    '<button class="btn btn-primary block" data-run>Run AI-Auditor</button>';
  // s===2 result
  return '<div class="row center" style="gap:14px;margin-bottom:16px"><div class="ring" style="--p:96"><span>96</span></div><div><div style="font-size:17px;font-weight:800;letter-spacing:-.01em">Condition verified</div><div class="muted" style="font-size:13px;margin-top:3px">Meets the InstaSpace Minimum Standard · 5 areas checked · 0 flags</div></div></div>'+
    '<div class="checks" style="margin-bottom:16px">'+crow('ok','Living area','Clear')+crow('ok','Kitchen &amp; cooktop','Clear')+crow('ok','Bedrooms','Clear')+crow('ok','Smoke &amp; safety','Clear')+crow('ok','Title match','Confirmed')+'</div>'+
    '<button class="btn btn-primary block" data-next2>Continue to compliance '+icon('arrow')+'</button>';
}
function compStage(s){
  if(s===0){
    var need = draft.cat==='Commercial'?['Trade licence','Tenancy contract / Ejari','Title NOC']:draft.cat==='Industrial'?['Industrial operating permit','Tenancy / lease','Fire-safety certificate']:['Title deed','Tenancy authorisation','Owner ID (InstaPass)'];
    return '<div class="sec-sub" style="margin-top:0">'+icon('shield','')+' GovShield · '+draft.cat+'</div>'+
      '<h2 style="font-size:21px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">'+draft.cat+' documents</h2>'+
      '<p class="muted" style="font-size:14px;margin-bottom:16px">We need the documents below. Photos or PDFs, up to 5 MB each.</p>'+
      '<div class="checks" style="margin-bottom:16px">'+need.map(function(d){return crow('pend',d,'Required');}).join('')+'</div>'+
      '<button class="btn btn-primary block" data-up>Upload documents</button>';
  }
  // result cleared
  return '<div class="row center" style="gap:14px;margin-bottom:16px"><div class="ico" style="width:54px;height:54px;border-radius:14px;background:rgba(242,98,46,.14);color:var(--orange);display:flex;align-items:center;justify-content:center">'+icon('shieldcheck','')+'</div><div><div style="font-size:17px;font-weight:800">Cleared to operate</div><div class="muted" style="font-size:13px;margin-top:3px">Documents check out against the registry. This space carries the GovShield mark.</div></div></div>'+
    '<div class="checks" style="margin-bottom:16px">'+crow('ok','Documents','Verified')+crow('ok','Registry cross-check','Passed')+crow('ok','Compliance standing','Clear')+'</div>'+
    '<button class="btn btn-primary block" data-pub>Publish listing '+icon('arrow')+'</button>';
}
function wireComp(card){
  var up=card.querySelector('[data-up]'); if(up) up.addEventListener('click',function(){ card.innerHTML=UI.aiBlock('Checking your documents','GovShield is cross-referencing your filing against the registry.'); UI.delay(2400,function(){ card.innerHTML=compStage(2); wireComp(card); }); });
  var pub=card.querySelector('[data-pub]'); if(pub) pub.addEventListener('click',function(){ App.go('addProperty',{step:'publish'}); });
}

/* ---------- WALLET ---------- */
Views.wallet=function(){
  var w=Store.wallet(), led=Store.data.ledger[Store.role];
  var rows=led.map(function(l){ return '<div class="lgr"><span class="i'+(l.kind==='out'?' out':'')+'">'+(l.kind==='out'?'⇄':'↓')+'</span><div class="m"><div class="t">'+l.t+'</div><div class="s">'+l.s+'</div></div><span class="a'+(l.kind==='in'?' in':'')+'">'+l.a+'</span></div>'; }).join('');
  return { title:'Wallet', sub:'InstaWallet', html:
    '<div class="grid g-2" style="align-items:start">'+
    '<div><div class="card pad-lg" style="background:radial-gradient(120% 120% at 20% 0,#3a1a52,#1c0c30 75%)">'+
      '<div class="eyebrow" style="margin-bottom:10px">Available balance</div>'+
      '<div style="font-size:40px;font-weight:800;letter-spacing:-.025em;line-height:1"><span class="o" style="font-size:20px;margin-right:6px">'+w.currency+'</span>'+fmt(w.balance)+'<span style="color:var(--cream-40);font-size:22px">.00</span></div>'+
      (w.escrow?'<div class="o" style="font-size:13px;margin-top:9px;font-weight:600">'+money(w.escrow)+' held in escrow</div>':'<div class="muted" style="font-size:13px;margin-top:9px">No funds in escrow</div>')+
      '<div class="row" style="gap:10px;margin-top:18px"><button class="btn btn-primary" data-add>'+icon('plus')+'Add funds</button><button class="btn btn-ghost" data-withdraw>Withdraw</button><button class="btn btn-ghost" data-convert>'+icon('swap')+'Convert</button></div>'+
    '</div>'+
    (w.escrow?'<div class="banner ok" style="margin-top:14px"><div class="bi">'+icon('lock')+'</div><div><div class="bt">'+money(w.escrow)+' releasing at check-in</div><div class="bd">The moment AI-Auditor verifies check-in, funds settle to the host\'s balance.</div></div></div>':'')+
    '</div>'+
    '<div><div class="sec-sub" style="margin-top:0"><span class="livedot"></span> Live settlement</div><div class="ledger">'+rows+'</div>'+
      '<div class="banner info" style="margin-top:14px"><div class="bi">'+icon('coin')+'</div><div><div class="bt">Convert at 1.5%</div><div class="bd">Move money across the corridor at a 1.5% margin — not the 6.4% banks charge.</div></div></div></div>'+
    '</div>',
    mount:function(root){
      root.querySelector('[data-add]').addEventListener('click',function(){ fundModal(); });
      root.querySelector('[data-withdraw]').addEventListener('click',function(){ toast('Withdrawal initiated · arrives in seconds'); });
      root.querySelector('[data-convert]').addEventListener('click',function(){ convertModal(); });
    } };
};
function fundModal(){
  UI.modal('<div class="mhead"><h3>Add funds</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="field"><label>Amount (AED)</label><input id="amt" type="number" value="5000"></div>'+
    '<div class="muted" style="font-size:12.5px;margin-bottom:16px">Choose a payment method. Funds are available instantly.</div>'+
    '<button class="btn btn-primary block" data-go2>Add from card ending 4417</button>'+
    '<button class="btn btn-ghost block" data-pf style="margin-top:10px;box-shadow:inset 0 0 0 1.5px rgba(61,220,145,.5);color:#3ddc91">'+icon('wallet')+'Top up with PayFast (PKR)</button></div>',
    {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
      m.querySelector('[data-go2]').addEventListener('click',function(){ var v=parseInt(m.querySelector('#amt').value,10)||0; Store.wallet().balance+=v; Store.save(); UI.closeModal(); App.go('wallet'); toast(money(v)+' added to your wallet'); });
      m.querySelector('[data-pf]').addEventListener('click',function(){ var v=parseInt(m.querySelector('#amt').value,10)||0;
        PayFast.checkout({ amount:v, currency:'AED', basketId:'TOPUP-'+Date.now(), description:'Wallet top-up',
          onSuccess:function(txn){ Store.wallet().balance+=v; Store.save(); App.go('wallet'); toast(money(v)+' added via PayFast'); } }); }); }});
}
function convertModal(){
  UI.modal('<div class="mhead"><h3>Convert currency</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="field"><label>From</label><input value="AED 5,000" readonly></div>'+
    '<div class="center" style="margin:-6px 0 6px;color:var(--cream-40)">'+icon('chevd','')+'</div>'+
    '<div class="field"><label>To (GBP)</label><input value="£ 1,063" readonly></div>'+
    '<div class="kv"><span>Rate</span><span>1 AED = 0.215 GBP</span></div><div class="kv"><span>InstaSpace margin</span><span class="o">1.5%</span></div><div class="kv"><span>Typical bank margin</span><span class="muted" style="text-decoration:line-through">6.4%</span></div>'+
    '<button class="btn btn-primary block" style="margin-top:14px" data-go2>Convert AED 5,000</button></div>',
    {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
      m.querySelector('[data-go2]').addEventListener('click',function(){ UI.closeModal(); toast('Converted at 1.5% — funds in your GBP balance'); }); }});
}

/* ---------- AI-YIELD ---------- */
Views.yield=function(){
  var on=Store.yieldEnabled.p1;
  if(!on) return { title:'AI-Yield', sub:'Smart pricing', html:
    '<div style="max-width:560px;margin:0 auto"><div class="page-head center"><div class="ico" style="width:60px;height:60px;border-radius:16px;background:rgba(242,98,46,.14);color:var(--orange);display:flex;align-items:center;justify-content:center;margin:0 auto 16px">'+icon('chart')+'</div><h1>Let AI-Yield price for you</h1><p style="margin:8px auto 0">We watch demand, local events, and your occupancy, then suggest rates. You approve every change.</p></div>'+
    '<button class="btn btn-primary block lg" data-enable>Enable smart pricing</button>'+
    '<button class="btn btn-text block" data-why style="margin-top:8px">How pricing works</button></div>',
    mount:function(root){ root.querySelector('[data-enable]').addEventListener('click',function(){ Store.yieldEnabled.p1=true; Store.save(); App.go('yield'); toast('Smart pricing enabled'); });
      root.querySelector('[data-why]').addEventListener('click',whyPrice); } };
  return { title:'AI-Yield', sub:'Smart pricing', html:
    '<div class="page-head"><h1>A price, and the reason for it.</h1><p>Every suggestion is optional and explainable. You stay in control.</p></div>'+
    '<div class="grid g-2" style="align-items:start">'+
    '<div class="card lift pad-lg" id="sugg"><div class="eyebrow" style="margin-bottom:10px">Suggested · Marina Gate · 14–20 Oct</div>'+
      '<div style="font-size:19px;font-weight:800;letter-spacing:-.01em;margin-bottom:14px">Raise your rate for Expo week</div>'+
      '<div class="row center" style="gap:12px;margin-bottom:14px"><span style="font-size:16px;color:var(--cream-40);text-decoration:line-through">AED 540</span><span style="font-size:32px;font-weight:800;letter-spacing:-.02em" class="o">AED 720</span><span class="badge ok">+33%</span></div>'+
      '<p class="muted" style="font-size:13.5px;line-height:1.55;margin-bottom:16px">Demand in Dubai Marina is up sharply for these dates. Conservative estimate, based on confirmed local events.</p>'+
      '<button class="btn btn-primary block" data-apply>Apply price</button>'+
      '<div class="row" style="gap:10px;margin-top:9px"><button class="btn btn-ghost" style="flex:1" data-keep>Schedule</button><button class="btn btn-ghost" style="flex:1" data-keep>Keep current</button></div>'+
      '<button class="btn btn-text block" data-why style="margin-top:6px">Why this price?</button></div>'+
    '<div><div class="grid g-2"><div class="stat"><div class="lab">Earned this quarter</div><div class="big"><span class="u">AED</span>3,180</div><div class="cap up">6 applied changes</div></div>'+
      '<div class="stat"><div class="lab">Avg uplift</div><div class="big">+18%</div><div class="cap">vs base rate</div></div></div>'+
      '<div class="card" style="margin-top:14px"><div class="sec-sub" style="margin-top:0">Recent changes</div><div class="checks">'+
        crow('ok','Expo week · +33%','Applied')+crow('ok','Weekend uplift · +12%','Applied')+crow('ok','Low-season hold','Kept')+'</div>'+
        '<button class="btn btn-ghost block sm" style="margin-top:14px" data-limits>Set price limits</button></div></div>'+
    '</div>',
    mount:function(root){
      root.querySelector('[data-apply]').addEventListener('click',function(){ var s=root.querySelector('#sugg'); s.innerHTML='<div class="center" style="padding:8px 0"><div class="ring" style="--p:100;margin:0 auto 14px;width:60px;height:60px">'+icon('check','')+'</div><div style="font-size:18px;font-weight:800;margin-bottom:6px">New rate is live</div><p class="muted" style="font-size:13.5px;max-width:30ch;margin:0 auto 16px">AED 720/night applies for 14–20 Oct. You can override it any time.</p><button class="btn btn-ghost sm" data-undo>Undo</button></div>'; s.querySelector('[data-undo]').addEventListener('click',function(){ App.go('yield'); }); toast('Rate applied for Expo week'); });
      root.querySelectorAll('[data-keep]').forEach(function(b){ b.addEventListener('click',function(){ toast('No change made — we\'ll flag the next opportunity'); }); });
      root.querySelector('[data-why]').addEventListener('click',whyPrice);
      var lm=root.querySelector('[data-limits]'); if(lm) lm.addEventListener('click',function(){ toast('Price limits — opening settings'); });
    } };
};
function whyPrice(){ UI.modal('<div class="mhead"><h3>Why this price?</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
  '<div class="stack">'+
  '<div class="banner info"><div class="bi">'+icon('calendar')+'</div><div><div class="bt">Confirmed demand event</div><div class="bd">Expo-week footfall in Dubai Marina, 14–20 Oct.</div></div></div>'+
  '<div class="banner info"><div class="bi">'+icon('chart')+'</div><div><div class="bt">Occupancy signal</div><div class="bd">Comparable verified listings are 91% booked for these dates.</div></div></div>'+
  '<div class="banner info"><div class="bi">'+icon('shield')+'</div><div><div class="bt">Conservative framing</div><div class="bd">Estimate sits below the top quartile — we never surge.</div></div></div>'+
  '</div><button class="btn btn-ghost block" style="margin-top:16px" data-x>Got it</button></div>',
  {onMount:function(m){ m.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',UI.closeModal);}); }}); }

/* ---------- GOVSHIELD CENTRE ---------- */
Views.govshield=function(){
  var mine=Store.data.portfolio.map(function(id){return Store.prop(id);});
  var rows=mine.map(function(p){ return '<div class="lrow" data-check="'+p.id+'"><div class="ico">'+icon('shieldcheck')+'</div><div><div class="tt">'+p.name+'</div><div class="ds">'+p.cat+' · documents on file</div></div><div class="end"><span class="badge ok"><span class="d"></span>Cleared</span><span class="chev">'+icon('chev')+'</span></div></div>'; }).join('');
  return { title:'GovShield', sub:'Compliance centre', html:
    '<div class="page-head"><h1>Cleared to operate, on the record.</h1><p>Document standing across your portfolio. We monitor after activation and flag changes early.</p></div>'+
    '<div class="banner ok" style="margin-bottom:18px"><div class="bi">'+icon('shieldcheck')+'</div><div><div class="bt">All listings compliant</div><div class="bd">3 of 3 verified. Next renewal in 240 days — we\'ll remind you.</div></div></div>'+
    '<div class="list">'+rows+'</div>',
    mount:function(root){ root.querySelectorAll('[data-check]').forEach(function(r){ r.addEventListener('click',function(){ var p=Store.prop(r.getAttribute('data-check'));
      UI.modal('<div class="mhead"><h3>'+p.name+'</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody"><div class="checks">'+crow('ok','Trade / tenancy authorisation','Verified')+crow('ok','Title NOC','Verified')+crow('ok','Registry cross-check','Passed')+crow('ok','No active disputes','Clear')+'</div><button class="btn btn-ghost block" style="margin-top:16px" data-x>Close</button></div>',{onMount:function(m){ m.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',UI.closeModal);}); }}); }); }); } };
};

/* ---------- DISPUTES ---------- */
Views.disputes=function(){
  var list=Store.disputeState;
  var rows=list.map(function(d){ var p=Store.prop(d.prop); var badge=d.status==='resolved'?'<span class="badge ok"><span class="d"></span>Resolved</span>':'<span class="badge warn"><span class="d"></span>Open</span>';
    return '<div class="lrow" data-go="dispute" data-id="'+d.id+'"><div class="ico">'+icon('gavel')+'</div><div><div class="tt">'+d.reason+'</div><div class="ds">Case '+d.id+' · '+p.name+' · '+money(d.amount)+'</div></div><div class="end">'+badge+'<span class="chev">'+icon('chev')+'</span></div></div>'; }).join('');
  return { title:'Disputes', sub:'Resolution court', html:
    '<div class="page-head"><div class="row between center"><div><h1>Evidence in. Verdict out.</h1><p>Impartial adjudication, settled straight from escrow.</p></div><button class="btn btn-ghost" data-file>'+icon('plus')+'File a claim</button></div></div>'+
    '<div class="list">'+rows+'</div>',
    mount:function(root){ root.querySelector('[data-file]').addEventListener('click',function(){ fileClaim(); }); } };
};
function fileClaim(){ UI.modal('<div class="mhead"><h3>File a claim</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
  '<div class="field"><label>What happened?</label><textarea rows="3" placeholder="Describe the issue — stay neutral and factual."></textarea></div>'+
  '<div class="field"><label>Amount claimed (AED)</label><input type="number" value="150"></div>'+
  '<div class="banner info" style="margin-bottom:16px"><div class="bi">'+icon('doc')+'</div><div><div class="bt">Add evidence</div><div class="bd">Photos, the listing terms — anything that shows the facts.</div></div></div>'+
  '<button class="btn btn-primary block" data-submit>Submit claim</button></div>',
  {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
    m.querySelector('[data-submit]').addEventListener('click',function(){ UI.closeModal(); toast('Claim filed — the guest has been asked to respond'); }); }}); }

Views.dispute=function(p1){
  var d=Store.disputeState.filter(function(x){return x.id===p1.id;})[0]||Store.disputeState[0];
  var p=Store.prop(d.prop);
  var stage=p1.stage||d.stage; // respond | deliberate | verdict
  var tl=['Filed','Evidence','Deliberation','Verdict'];
  var act={respond:1,deliberate:2,verdict:3}[stage];
  var body;
  if(stage==='respond'){
    body='<div class="banner warn" style="margin-bottom:16px"><div class="bi">'+icon('gavel')+'</div><div><div class="bt">Awaiting guest response</div><div class="bd">'+d.against+' has been asked to respond to a claim for '+money(d.amount)+'.</div></div></div>'+
      '<div class="card" style="margin-bottom:16px"><div class="sec-sub" style="margin-top:0">Claim</div><p style="font-size:14px;line-height:1.55">'+d.claimant+' reports: "'+d.reason+'." Evidence: 2 checkout photos attached.</p></div>'+
      '<div class="card"><div class="muted" style="font-size:13px;margin-bottom:10px">Simulate the case proceeding:</div><button class="btn btn-primary block" data-deliberate>Guest responds — open deliberation</button></div>';
  } else if(stage==='deliberate'){
    body='<div id="delibWait">'+UI.aiBlock('Under deliberation','The adjudicator is weighing both sides against the evidence and the listing terms. No one can edit the case now.')+'</div>';
  } else {
    body='<div style="border:1px solid rgba(242,98,46,.3);border-radius:18px;padding:22px;background:linear-gradient(160deg,#341a4e,#1c0c30);text-align:center;margin-bottom:16px">'+
      '<div class="eyebrow" style="color:var(--orange);border:1px solid rgba(242,98,46,.4);border-radius:999px;padding:5px 12px;display:inline-flex;align-items:center;gap:7px;margin-bottom:16px">'+icon('shield','')+'Rao Governance</div>'+
      '<div style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px">Verdict: guest liable</div>'+
      '<div style="font-size:14px;color:var(--cream-72);margin-bottom:16px"><span class="o" style="font-weight:800;font-size:16px">'+money(d.amount)+'</span> settles to the host</div>'+
      '<p style="font-size:12.5px;line-height:1.6;color:var(--cream-56);text-align:left;border-top:1px solid var(--cream-14);padding-top:14px;font-style:italic">"Checkout photos show damage to the coffee table absent at check-in. The defence does not establish prior damage. Settled from the security deposit held in escrow."</p></div>'+
      '<div class="row" style="gap:10px"><button class="btn btn-primary" style="flex:1" data-reason>View full reasoning</button><button class="btn btn-ghost" style="flex:1" data-appeal>Appeal within 48h</button></div>';
  }
  return { title:'Case '+d.id, sub:p.name, html:'<div style="max-width:560px;margin:0 auto">'+
    '<div class="steps" style="margin-bottom:24px">'+stepDots(tl,act)+'</div>'+body+'</div>',
    mount:function(root){
      var del=root.querySelector('[data-deliberate]'); if(del) del.addEventListener('click',function(){ App.go('dispute',{id:d.id,stage:'deliberate'}); });
      if(stage==='deliberate'){ UI.delay(2600,function(){ d.status='resolved'; d.stage='verdict'; Store.save(); App.go('dispute',{id:d.id,stage:'verdict'}); }); }
      var rs=root.querySelector('[data-reason]'); if(rs) rs.addEventListener('click',function(){ toast('Opening full written rationale'); });
      var ap=root.querySelector('[data-appeal]'); if(ap) ap.addEventListener('click',function(){ toast('Appeal window noted — 48 hours'); });
    } };
};

/* shared step dots (also used by booking) */
function stepDots(labels, active){ var h='';
  labels.forEach(function(l,i){ var cls=i<active?'done':i===active?'active':'';
    h+='<div class="stp '+cls+'"><div class="dot">'+(i<active?'✓':(i+1))+'</div><div class="lab">'+l+'</div></div>';
    if(i<labels.length-1) h+='<div class="bar'+(i<active?' done':'')+'"></div>'; });
  return h;
}
window.stepDots = window.stepDots || stepDots;

window.Views=Views;
})();
