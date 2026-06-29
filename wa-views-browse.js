/* InstaSpace Web App — browse, listing, booking, trips, messaging ===== */
(function(){
'use strict';
var icon=UI.icon, money=UI.money, fmt=UI.fmt, toast=UI.toast;
var Views=window.Views||{};

/* ---------- BROWSE / SEARCH ---------- */
var browseState={ cat:'All', q:'', sort:'Recommended' };
Views.browse=function(){
  var cats=['All','Residential','Commercial','Industrial'];
  var list=Store.data.properties.filter(function(p){
    return (browseState.cat==='All'||p.cat===browseState.cat) &&
      (!browseState.q || (p.name+' '+p.city).toLowerCase().indexOf(browseState.q.toLowerCase())>-1);
  });
  if(browseState.sort==='Price') list=list.slice().sort(function(a,b){return a.price-b.price;});
  if(browseState.sort==='Rating') list=list.slice().sort(function(a,b){return b.rating-a.rating;});
  var chips=cats.map(function(c){ return '<span class="chip'+(browseState.cat===c?' on':'')+'" data-cat="'+c+'">'+c+'</span>'; }).join('');
  return { title:'Browse', sub:'Verified spaces', wide:true, html:
    '<div class="page-head"><h1>Find it, trust it.</h1><p>Every result wears its verification state — confidence is visible before a single tap.</p></div>'+
    '<div class="wa-search" id="bsearch" style="max-width:none;margin-bottom:14px">'+icon('search')+'<input id="bq" placeholder="City, area, or space type" value="'+UI.esc(browseState.q)+'" style="flex:1;background:transparent;border:none;color:var(--cream);font-size:14px;font-family:var(--sans);outline:none"></div>'+
    '<div class="row between center" style="margin-bottom:18px;gap:12px;flex-wrap:wrap"><div class="row wrap" style="gap:8px">'+chips+'</div>'+
      '<div class="seg"><button class="'+(browseState.sort==='Recommended'?'on':'')+'" data-sort="Recommended">Recommended</button><button class="'+(browseState.sort==='Price'?'on':'')+'" data-sort="Price">Price</button><button class="'+(browseState.sort==='Rating'?'on':'')+'" data-sort="Rating">Rating</button></div></div>'+
    (list.length? '<div class="grid g-3">'+list.map(window.propCard).join('')+'</div>'
      : '<div class="empty"><div class="ei">'+icon('search')+'</div><h3>Nothing matches yet</h3><p>Try a different category or clear your search.</p><button class="btn btn-ghost" data-clear="1">Clear filters</button></div>'),
    mount:function(root){
      root.querySelectorAll('[data-cat]').forEach(function(c){ c.addEventListener('click',function(){ browseState.cat=c.getAttribute('data-cat'); App.go('browse'); }); });
      root.querySelectorAll('[data-sort]').forEach(function(c){ c.addEventListener('click',function(){ browseState.sort=c.getAttribute('data-sort'); App.go('browse'); }); });
      var q=root.querySelector('#bq'); if(q){ q.addEventListener('input',function(){ browseState.q=q.value; }); q.addEventListener('keydown',function(e){ if(e.key==='Enter') App.go('browse'); }); }
      var cl=root.querySelector('[data-clear]'); if(cl) cl.addEventListener('click',function(){ browseState.cat='All'; browseState.q=''; App.go('browse'); });
    } };
};

/* ---------- LISTING DETAIL ---------- */
Views.listing=function(p1){
  var p=Store.prop(p1.id)||Store.data.properties[0];
  var revs=Store.data.reviews.filter(function(r){return r.prop===p.id;});
  if(!revs.length) revs=Store.data.reviews.slice(0,2);
  var saved=Store.saved.indexOf(p.id)>-1;
  var amen=['Verified condition','Borderless payout','Instant settlement','Self check-in','High-speed Wi-Fi','Parking'];
  return { title:p.name, sub:p.cat, wide:true, html:
    '<div style="height:260px;border-radius:18px;position:relative;overflow:hidden;margin-bottom:20px;background:radial-gradient(120% 120% at 30% 0,#3a1a54,#1c0c30)">'+
      (p.verified?'<span class="vbadge" style="top:16px;left:16px">'+'<span class="d"></span>Verified · InstaSpace</span>':'')+
      '<div class="save'+(saved?' on':'')+'" data-save="'+p.id+'" style="top:14px;right:14px;width:40px;height:40px">'+icon('heart')+'</div></div>'+
    '<div class="grid" style="grid-template-columns:1.7fr 1fr;gap:24px;align-items:start" id="lgrid">'+
      '<div><div class="row between center" style="gap:12px"><div><h1 style="font-size:26px;font-weight:800;letter-spacing:-.02em">'+p.name+'</h1>'+
        '<div class="muted" style="font-size:14px;margin-top:6px">'+icon('pin','')+' '+p.city+' · '+UI.stars(Math.round(p.rating))+' '+p.rating+' ('+p.reviews+' reviews)</div></div></div>'+
      '<p class="muted" style="font-size:15px;line-height:1.6;margin:18px 0">'+p.blurb+'</p>'+
      '<div class="grid g-3" style="margin-bottom:20px">'+
        '<div class="card"><div class="row center" style="gap:12px"><div class="ring" style="--p:'+p.auditScore+';width:54px;height:54px;font-size:17px"><span>'+p.auditScore+'</span></div><div><div style="font-size:13px;font-weight:700">AI-Auditor</div><div class="muted" style="font-size:11.5px">Condition verified</div></div></div></div>'+
        '<div class="card"><div class="row center" style="gap:12px"><div class="ico" style="width:40px;height:40px;border-radius:10px;background:var(--cream-08);display:flex;align-items:center;justify-content:center;color:var(--orange)">'+icon('shieldcheck')+'</div><div><div style="font-size:13px;font-weight:700">GovShield</div><div class="muted" style="font-size:11.5px">Cleared to operate</div></div></div></div>'+
        '<div class="card"><div class="row center" style="gap:12px"><div class="ico" style="width:40px;height:40px;border-radius:10px;background:var(--cream-08);display:flex;align-items:center;justify-content:center;color:var(--orange)">'+icon('lock')+'</div><div><div style="font-size:13px;font-weight:700">Escrow</div><div class="muted" style="font-size:11.5px">Settled on proof</div></div></div></div>'+
      '</div>'+
      '<div class="sec-sub">What this space offers</div><div class="row wrap" style="gap:8px;margin-bottom:8px">'+amen.map(function(a){return '<span class="chip" style="cursor:default">'+a+'</span>';}).join('')+'</div>'+
      '<div class="sec-title">Reviews<span class="more" data-review="'+p.id+'">Write a review</span></div>'+
      '<div class="stack">'+revs.map(reviewCard).join('')+'</div>'+
      '</div>'+
      '<div class="card pad-lg" style="position:sticky;top:8px">'+
        '<div class="row between" style="align-items:baseline;margin-bottom:14px"><span style="font-size:26px;font-weight:800;letter-spacing:-.02em">'+money(p.price,'AED')+'</span><span class="muted">/ night</span></div>'+
        '<div class="field"><label>Dates</label><input value="12 – 16 Oct 2026" readonly></div>'+
        '<div class="field"><label>Guests</label><input value="2 guests" readonly></div>'+
        '<div class="divline" style="margin:14px 0"></div>'+
        '<div class="kv"><span>'+money(p.price,'AED')+' × 4 nights</span><span>'+money(p.price*4,'AED')+'</span></div>'+
        '<div class="kv"><span>Service &amp; protection</span><span>AED 180</span></div>'+
        '<div class="kv total"><span>Total</span><span class="o">'+money(p.price*4+180,'AED')+'</span></div>'+
        '<button class="btn btn-primary block lg" style="margin-top:16px" data-go="booking" data-id="'+p.id+'">Book now '+icon('arrow')+'</button>'+
        '<div class="row center" style="gap:8px;justify-content:center;margin-top:12px;font-size:12px;color:var(--cream-56)">'+icon('lock','')+' Funds held in escrow until check-in</div>'+
      '</div>'+
    '</div>',
    mount:function(root){
      var r=root.querySelector('[data-review]'); if(r) r.addEventListener('click',function(){ openReview(p.id); });
    } };
};
function reviewCard(r){ return '<div class="card"><div class="row between center" style="margin-bottom:8px"><div class="row center" style="gap:10px"><div style="width:34px;height:34px;border-radius:50%;background:var(--cream-08);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--cream-90)">'+r.by[0]+'</div><div><div style="font-size:13.5px;font-weight:700">'+r.by+'</div><div class="muted" style="font-size:11px">'+r.when+'</div></div></div>'+UI.stars(r.stars)+'</div><p class="muted" style="font-size:13.5px;line-height:1.55">'+r.text+'</p></div>'; }

function openReview(pid){
  UI.modal('<div class="mhead"><h3>Write a review</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="center" style="margin-bottom:14px"><div class="stars starpick" id="rp">'+UI.stars(5)+'</div></div>'+
    '<div class="field"><label>Your review</label><textarea rows="4" placeholder="Was the space as verified? How was settlement?"></textarea></div>'+
    '<button class="btn btn-primary block" data-submit>Post review</button></div>',
    {onMount:function(m){ m.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',UI.closeModal);});
      m.querySelector('[data-submit]').addEventListener('click',function(){ UI.closeModal(); toast('Review posted — thank you'); }); }});
}

/* ---------- BOOKING FLOW (review -> escrow held -> settling -> settled) ---------- */
Views.booking=function(p1){
  var p=Store.prop(p1.id)||Store.data.properties[0];
  var step=p1.step||'review';
  var total=p.price*4+180, hostNet=p.price*4;
  var content;
  if(step==='review'){
    content='<div class="banner info" style="margin-bottom:16px"><div class="bi">'+icon('lock')+'</div><div><div class="bt">Protected by InstaSpace</div><div class="bd">Your payment is held in escrow and released only when AI-Auditor verifies check-in. Full refund before 8 Oct.</div></div></div>'+
      '<div class="card pad-lg" style="margin-bottom:16px"><div style="font-size:17px;font-weight:800;margin-bottom:4px">'+p.name+'</div><div class="muted" style="font-size:13px;margin-bottom:14px">12–16 Oct · 2 guests · '+p.city+'</div>'+
        '<div class="kv"><span>'+money(p.price,'AED')+' × 4 nights</span><span>'+money(p.price*4,'AED')+'</span></div>'+
        '<div class="kv"><span>Service &amp; protection</span><span>AED 180</span></div>'+
        '<div class="kv total"><span>Total</span><span class="o">'+money(total,'AED')+'</span></div></div>'+
      '<button class="btn btn-primary block lg" data-confirm>Confirm booking</button>'+
      '<button class="btn btn-ghost block" data-payfast style="margin-top:10px;box-shadow:inset 0 0 0 1.5px rgba(61,220,145,.5);color:#3ddc91">'+icon('wallet')+'Pay with PayFast'+'</button>'+
      '<div class="muted" style="font-size:12px;text-align:center;margin-top:8px">Paying from Pakistan? PayFast settles in PKR ('+PayFast.pkr(PayFast.toPKR(total,'AED'))+').</div>'+
      '<button class="btn btn-text block" data-go="listing" data-id="'+p.id+'" style="margin-top:6px">Back to listing</button>';
  } else if(step==='held'){
    content='<div class="center" style="padding:10px 0 4px"><div class="ring" style="--p:100;margin:0 auto 18px;width:72px;height:72px">'+icon('lock','')+'</div>'+
      '<h2 style="font-size:23px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px">'+money(total,'AED')+' held safely</h2>'+
      '<p class="muted" style="font-size:14px;max-width:40ch;margin:0 auto 6px">Your payment is in escrow until check-in. If the space isn\'t as verified, it\'s refunded in full.</p></div>'+
      '<div class="banner ok" style="margin:18px 0"><div class="bi">'+icon('shieldcheck')+'</div><div><div class="bt">Booking confirmed</div><div class="bd">'+p.name+' · 12–16 Oct. The host has been notified.</div></div></div>'+
      '<div class="card" style="margin-bottom:16px"><div class="muted" style="font-size:13px;margin-bottom:10px">Simulate the next step in the loop:</div><button class="btn btn-primary block" data-checkin>Verify check-in (AI-Auditor)</button></div>'+
      '<button class="btn btn-ghost block" data-go="trips">Go to my trips</button>';
  } else if(step==='settling'){
    content='<div id="settleWait">'+UI.aiBlock('Settling now','Check-in verified. Releasing escrow to the host — this takes seconds, not days.')+'</div>';
  } else { // settled
    content='<div class="center" style="padding:10px 0 4px"><div class="ring" style="--p:100;margin:0 auto 18px;width:72px;height:72px">'+icon('check','')+'</div>'+
      '<h2 style="font-size:23px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px">Settled to the host</h2>'+
      '<p class="muted" style="font-size:14px;max-width:42ch;margin:0 auto">'+money(hostNet,'AED')+' cleared the instant check-in passed. Your stay is all set — enjoy '+p.name+'.</p></div>'+
      '<div class="ledger" style="margin:20px 0"><div class="lgr"><span class="i">'+icon('check','')+'</span><div class="m"><div class="t">Settled · '+p.name+'</div><div class="s">Check-in verified · 0.5s</div></div><span class="a in">'+money(hostNet,'AED')+'</span></div></div>'+
      '<div class="row" style="gap:10px"><button class="btn btn-primary" style="flex:1" data-go="trips">My trips</button><button class="btn btn-ghost" style="flex:1" data-go="wallet">View wallet</button></div>';
  }
  return { title:'Booking', sub:p.name, html:'<div style="max-width:560px;margin:0 auto">'+
    '<div class="steps" style="margin-bottom:26px">'+stepDots(['Review','Escrow','Check-in','Settled'], {review:0,held:1,settling:2,settled:3}[step])+'</div>'+content+'</div>',
    mount:function(root){
      var c=root.querySelector('[data-confirm]'); if(c) c.addEventListener('click',function(){
        var gw=Store.walletState.guest; gw.escrow=total; Store.save(); App.go('booking',{id:p.id,step:'held'}); toast('Payment secured in escrow'); });
      var pf=root.querySelector('[data-payfast]'); if(pf) pf.addEventListener('click',function(){
        PayFast.checkout({ amount:total, currency:'AED', basketId:'BK-'+p.id+'-'+Date.now(), description:p.name+' · 4 nights',
          customer:{ name:Store.user().name },
          onSuccess:function(txn){ var gw=Store.walletState.guest; gw.escrow=total; Store.save(); App.go('booking',{id:p.id,step:'held'}); }
        }); });
      var ci=root.querySelector('[data-checkin]'); if(ci) ci.addEventListener('click',function(){ App.go('booking',{id:p.id,step:'settling'}); });
      if(step==='settling'){ UI.delay(2300,function(){
        var hw=Store.walletState.host, gw=Store.walletState.guest;
        hw.balance+=hostNet; gw.escrow=0; Store.save(); App.go('booking',{id:p.id,step:'settled'}); }); }
    } };
};
function stepDots(labels, active){ var h='';
  labels.forEach(function(l,i){ var cls=i<active?'done':i===active?'active':'';
    h+='<div class="stp '+cls+'"><div class="dot">'+(i<active?'✓':(i+1))+'</div><div class="lab">'+l+'</div></div>';
    if(i<labels.length-1) h+='<div class="bar'+(i<active?' done':'')+'" style="'+(i<active?'background:var(--orange)':'')+'"></div>'; });
  return h;
}

/* ---------- TRIPS (guest) ---------- */
Views.trips=function(){
  var mine=Store.bookingState.filter(function(b){return b.side!=='host';});
  if(!mine.length) return { title:'My trips', sub:'Bookings', html:'<div class="empty"><div class="ei">'+icon('trips')+'</div><h3>No trips yet</h3><p>When you book a verified space, it shows up here with its protection status.</p><button class="btn btn-primary" data-go="browse">Browse properties</button></div>' };
  var rows=mine.map(function(b){ var p=Store.prop(b.prop);
    var badge=b.status==='settled'?'<span class="badge ok"><span class="d"></span>Completed</span>':b.status==='escrow'?'<span class="badge ok"><span class="d"></span>In escrow</span>':'<span class="badge neutral"><span class="d"></span>Upcoming</span>';
    return '<div class="lrow" data-go="listing" data-id="'+b.prop+'"><div style="width:48px;height:48px;border-radius:10px;flex:none;background:radial-gradient(120% 120% at 30% 0,#3a1a54,#1c0c30)"></div><div><div class="tt">'+p.name+'</div><div class="ds">'+b.from+'–'+b.to+' · '+b.guests+' guests</div></div><div class="end">'+badge+'<span class="chev">'+icon('chev')+'</span></div></div>'; }).join('');
  return { title:'My trips', sub:'Bookings', html:'<div class="page-head"><h1>My trips</h1></div><div class="list">'+rows+'</div>' };
};

/* ---------- MESSAGES ---------- */
Views.messages=function(){
  var rows=Store.data.threads.map(function(t){
    return '<div class="lrow" data-go="thread" data-id="'+t.id+'"><div style="width:44px;height:44px;border-radius:50%;flex:none;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:700;color:#2A1240">'+t.with[0]+'</div>'+
      '<div style="flex:1;min-width:0"><div class="row center" style="gap:8px"><span class="tt">'+t.with+'</span>'+(t.verified?'<span class="eyebrow" style="color:var(--orange)">Verified</span>':'')+'</div><div class="ds" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+t.last+'</div></div>'+
      '<div class="end" style="flex-direction:column;align-items:flex-end;gap:6px"><span class="muted" style="font-size:11px">'+t.time+'</span>'+(t.unread?'<span class="badge ok" style="padding:1px 8px">'+t.unread+'</span>':'')+'</div></div>'; }).join('');
  return { title:'Messages', sub:'Conversations', html:'<div class="page-head"><h1>Messages</h1></div><div class="list">'+rows+'</div>' };
};
Views.thread=function(p1){
  var t=Store.data.threads.filter(function(x){return x.id===p1.id;})[0]||Store.data.threads[0];
  t.unread=0;
  var msgs=function(){ var h='<div class="msg-meta">Today</div>'; t.msgs.forEach(function(m){ h+='<div class="msg '+(m.me?'me':'them')+'">'+UI.esc(m.x)+'</div>'; }); return h; };
  return { title:t.with, sub:(t.verified?'Verified · '+t.role:t.role), html:
    '<div style="max-width:640px;margin:0 auto;display:flex;flex-direction:column;height:100%">'+
    '<div class="thread" id="thread" style="flex:1;display:flex;flex-direction:column">'+msgs()+'</div>'+
    '<div class="composer"><input id="cmp" placeholder="Message…"><button class="send" data-send>'+icon('send','')+'</button></div></div>',
    mount:function(root){
      var box=root.querySelector('#thread'), inp=root.querySelector('#cmp');
      function send(){ var v=inp.value.trim(); if(!v) return; t.msgs.push({me:true,x:v}); inp.value='';
        box.insertAdjacentHTML('beforeend','<div class="msg me">'+UI.esc(v)+'</div>'); box.scrollTop=box.scrollHeight;
        UI.delay(1100,function(){ var reply='Got it — I\'ll confirm shortly. Everything is protected by InstaSpace.'; t.msgs.push({me:false,x:reply}); t.last=reply;
          box.insertAdjacentHTML('beforeend','<div class="msg them">'+UI.esc(reply)+'</div>'); box.scrollTop=box.scrollHeight; }); }
      root.querySelector('[data-send]').addEventListener('click',send);
      inp.addEventListener('keydown',function(e){ if(e.key==='Enter') send(); });
      box.scrollTop=box.scrollHeight;
    } };
};

window.Views=Views;
})();
