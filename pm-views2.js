/* InstaSpace — PM Portal · views: bookings inbox, payouts, messages == */
(function(){
'use strict';
var icon=UI.icon, money=PM.money, toast=UI.toast, esc=UI.esc, pmicon=window.pmicon;
var Views = window.Views || {};
var lbl=window.inboxStatusLabel;

function istatusBadge(s){
  var tone=({new:'warn',awaiting:'warn',confirmed:'ok',escrow:'ok',checkout:'neutral',checkin:'ok',declined:'neutral'})[s]||'neutral';
  return '<span class="badge '+tone+'"><span class="d"></span>'+lbl(s)+'</span>';
}

/* =====================================================================
   BOOKINGS / INQUIRIES INBOX
   ===================================================================== */
var IB = { tab:'all', sel:null };
Views.bookings=function(){
  var tabs=[['all','All'],['new','New'],['confirmed','Confirmed'],['escrow','In escrow'],['checkout','Checkout']];
  function inTab(b){ if(IB.tab==='all') return true; if(IB.tab==='new') return b.status==='new'||b.status==='awaiting'; return b.status===IB.tab; }
  var list=PM.inbox.filter(inTab);
  if(!IB.sel || !list.filter(function(b){return b.id===IB.sel;}).length) IB.sel=list.length?list[0].id:null;

  var tabsHtml='<div class="segtab inbox-tabs">'+tabs.map(function(t){
    var cnt = t[0]==='all'?PM.inbox.length : t[0]==='new'?PM.inbox.filter(function(b){return b.status==='new'||b.status==='awaiting';}).length : PM.inbox.filter(function(b){return b.status===t[0];}).length;
    return '<button class="'+(IB.tab===t[0]?'on':'')+'" data-tab="'+t[0]+'">'+t[1]+'<span class="cnt">'+cnt+'</span></button>';
  }).join('')+'</div>';

  var rowsHtml=list.length? list.map(function(b){ var l=PM.listing(b.listing);
    return '<div class="ibrow'+(b.id===IB.sel?' on':'')+(b.status==='new'?' unread':'')+'" data-sel="'+b.id+'">'+
      '<span class="iav">'+b.initials+'</span>'+
      '<div class="ib-main"><div class="ib-top"><span class="ib-nm">'+b.guest+'</span><span class="ib-time">'+b.time+'</span></div>'+
        '<div class="ib-sub">'+l.name+' · '+b.dates+'</div>'+
        '<div class="ib-msg">'+esc(b.msg)+'</div>'+
        '<div class="ib-foot"><span class="itype '+b.type+'">'+b.type+'</span>'+istatusBadge(b.status)+'</div>'+
      '</div></div>'; }).join('')
    : '<div class="inbox-empty"><div class="ei" style="margin-bottom:14px">'+icon('message')+'</div><p>Nothing here right now.</p></div>';

  var head='<div class="pm-head" style="margin-bottom:16px"><div class="lead"><h1>Bookings &amp; inquiries</h1><p>Every request and reservation across the portfolio — reply, confirm, and track to settlement.</p></div></div>';

  return { title:'Bookings', sub:'Inbox', wide:true, flush:true, html:
    head+tabsHtml+
    '<div class="inbox" id="inbox">'+
      '<div class="inbox-list"><div class="inbox-scroll" id="ibScroll">'+rowsHtml+'</div></div>'+
      '<div class="inbox-detail" id="ibDetail">'+detailHtml(IB.sel)+'</div>'+
    '</div>',
    mount:function(root){
      root.querySelectorAll('[data-tab]').forEach(function(b){ b.addEventListener('click', function(){ IB.tab=b.getAttribute('data-tab'); IB.sel=null; App.refresh(); }); });
      bindRows(root);
    } };
};
function bindRows(root){
  root.querySelectorAll('[data-sel]').forEach(function(r){ r.addEventListener('click', function(){
    IB.sel=r.getAttribute('data-sel');
    root.querySelectorAll('.ibrow').forEach(function(x){ x.classList.toggle('on', x===r); });
    r.classList.remove('unread');
    var d=root.querySelector('#ibDetail'); d.innerHTML=detailHtml(IB.sel); bindDetail(root);
    var inbox=root.querySelector('#inbox'); if(window.innerWidth<=840){ inbox.classList.add('show-detail'); }
  }); });
  bindDetail(root);
}
function bindDetail(root){
  var d=root.querySelector('#ibDetail'); if(!d) return;
  var back=d.querySelector('[data-back]'); if(back) back.addEventListener('click', function(){ root.querySelector('#inbox').classList.remove('show-detail'); });
  d.querySelectorAll('[data-action]').forEach(function(b){ b.addEventListener('click', function(){
    var a=b.getAttribute('data-action'), bk=PM.inboxItem(IB.sel);
    if(a==='confirm'){ bk.status='confirmed'; toast('Confirmed — funds will hold in escrow'); App.refresh(); }
    else if(a==='decline'){ bk.status='declined'; toast('Inquiry declined'); App.refresh(); }
    else if(a==='message'){ App.go('messages'); }
    else if(a==='listing'){ App.go('listing',{id:bk.listing}); }
  }); });
}
function detailHtml(id){
  if(!id) return '<div class="inbox-empty"><div class="ei" style="width:64px;height:64px;border-radius:50%;background:var(--cream-04);border:1px solid var(--cream-14);display:flex;align-items:center;justify-content:center;margin-bottom:16px">'+icon('message')+'</div><p>Select a booking or inquiry to see the details.</p></div>';
  var b=PM.inboxItem(id), l=PM.listing(b.listing), o=PM.owner(l.owner);
  var actions;
  if(b.status==='new'||b.status==='awaiting'){
    actions='<div class="row" style="gap:10px"><button class="btn btn-primary" style="flex:1" data-action="confirm">Confirm booking</button><button class="btn btn-danger" data-action="decline">Decline</button><button class="btn btn-ghost" data-action="message">'+icon('message')+'</button></div>';
  } else if(b.status==='declined'){
    actions='<div class="banner info"><div class="bi">'+icon('x')+'</div><div><div class="bt">Inquiry declined</div><div class="bd">An alternative window was offered to the guest.</div></div></div>';
  } else {
    actions='<div class="row" style="gap:10px"><button class="btn btn-ghost" style="flex:1" data-action="message">'+icon('message')+'Message guest</button><button class="btn btn-ghost" style="flex:1" data-action="listing">'+icon('eye')+'Open listing</button></div>';
  }
  var nights=b.nights?('<div class="id-fact"><div class="l">Nights / term</div><div class="v">'+b.nights+' nights</div></div>'):('<div class="id-fact"><div class="l">Term</div><div class="v">'+b.dates+'</div></div>');
  return '<button class="btn btn-ghost sm" data-back style="margin-bottom:16px;display:none" id="ibBack">'+icon('arrow')+'Back</button>'+
    '<div class="idh"><span class="iav">'+b.initials+'</span><div style="flex:1"><h2>'+b.guest+'</h2><div class="idsub">'+b.from+' · '+istatusBadge(b.status)+'</div></div></div>'+
    '<div class="row center" style="gap:8px;margin-bottom:14px;flex-wrap:wrap"><span class="itype '+b.type+'">'+b.type+'</span><span class="chip" style="cursor:pointer" data-action="listing">'+l.name+' · '+l.ref+'</span></div>'+
    '<div class="id-msg">'+esc(b.msg)+'</div>'+
    '<div class="id-grid">'+
      '<div class="id-fact"><div class="l">Dates</div><div class="v">'+b.dates+'</div></div>'+
      nights+
      '<div class="id-fact"><div class="l">Guests</div><div class="v">'+(b.guests||'—')+'</div></div>'+
      '<div class="id-fact"><div class="l">Value</div><div class="v">'+money(b.amount,b.cur)+'</div></div>'+
    '</div>'+
    '<div class="banner '+(b.status==='escrow'?'ok':'info')+'" style="margin-bottom:16px"><div class="bi">'+icon(b.status==='escrow'?'lock':b.status==='checkout'?'shieldcheck':'wallet')+'</div><div><div class="bt">'+
      (b.status==='escrow'?'Funds held in escrow':b.status==='checkout'?'Checkout & condition check due':b.status==='confirmed'?'Confirmed · awaiting check-in':'Booking value')+
      '</div><div class="bd">'+(b.status==='escrow'?'Releases to the owner the moment AI-Auditor verifies check-in.':b.status==='checkout'?'AI-Auditor runs the condition check automatically on departure.':b.status==='confirmed'?'Settlement releases at verified check-in.':'Confirm to hold the guest\'s funds in escrow until check-in.')+'</div></div></div>'+
    actions;
}

/* =====================================================================
   PAYOUTS / TRANSACTIONS
   ===================================================================== */
var PX = { tab:'all' };
Views.payouts=function(){
  var b=PM.balances;
  var primary=b[0];
  var totalDue=PM.payoutsDue.reduce(function(a,p){ return a + p.amount*(p.cur==='GBP'?4.65:p.cur==='USD'?3.67:1); },0);
  var bal=
    '<div class="bal-grid">'+
      '<div class="balcard primary"><div class="bl">'+icon('wallet','')+'Collected balance · AED</div><div class="bamt"><span class="u">AED</span>'+PM.group(primary.amount)+'</div><div class="bcap o">'+money(primary.escrow,'AED')+' held in escrow</div></div>'+
      '<div class="balcard sec"><div class="bl">'+icon('globe','')+'GBP balance</div><div class="bamt">'+money(b[1].amount,'GBP')+'</div><div class="bcap">'+money(b[1].escrow,'GBP')+' in escrow</div></div>'+
      '<div class="balcard sec"><div class="bl">'+icon('globe','')+'USD balance</div><div class="bamt">'+money(b[2].amount,'USD')+'</div><div class="bcap">'+money(b[2].escrow,'USD')+' in escrow</div></div>'+
    '</div>';
  var quick='<div class="row wrap" style="gap:10px;margin-bottom:20px"><button class="btn btn-primary" data-act="payall">'+icon('coin')+'Run owner payouts</button><button class="btn btn-ghost" data-act="convert">'+icon('swap')+'Convert currency</button><button class="btn btn-ghost" data-act="statement">'+pmicon('download')+'Statement</button></div>';

  var due=
    '<div class="panel" style="margin-bottom:16px"><div class="ph"><span class="pt">Owner payouts due</span><span class="resultcount" style="margin-left:auto">'+PM.aedK(totalDue)+' total</span></div>'+
      PM.payoutsDue.map(function(p){ var o=PM.owner(p.owner); var dcls=p.due.indexOf('approval')>-1?'appr':p.due.indexOf('Scheduled')>-1?'sched':'soon';
        return '<div class="po-row"><span class="oa">'+o.initials+'</span><div style="flex:1"><div class="on">'+o.name+'</div><div class="od">'+p.listings+' listings · '+o.props+' owned</div></div>'+
          '<div class="oamt"><div class="v">'+money(p.amount,p.cur)+'</div><div class="due '+dcls+'">'+p.due+'</div></div>'+
          '<button class="btn btn-ghost sm" data-pay="'+p.owner+'" style="margin-left:14px">Pay out</button></div>'; }).join('')+'</div>';

  /* transactions ledger */
  var txtabs=[['all','All'],['in','Settlements'],['out','Owner payouts'],['fee','Fees'],['fx','FX']];
  function inTab(x){ return PX.tab==='all'||x.kind===PX.tab; }
  var ledger=PM.ledger.filter(inTab);
  var txSymbol={in:'↓',out:'⇄',fee:'%',fx:'⇆'};
  var rows=ledger.map(function(x){
    var amt=(x.kind==='in'?'+ ':x.kind==='out'?'− ':'')+money(x.amount,x.cur).replace(/^[^\d]+/, (x.cur==='GBP'?'£':x.cur==='USD'?'$':x.cur+' '));
    return '<tr style="cursor:default">'+
      '<td class="lcell" data-l="Transaction"><div class="lname"><span class="txk '+x.kind+'">'+txSymbol[x.kind]+'</span><div><div class="lnm">'+x.t+'</div><div class="lref">'+x.s+'</div></div></div></td>'+
      '<td data-l="Date">'+x.date+'</td>'+
      '<td data-l="Status">'+(x.status==='cleared'?'<span class="badge ok"><span class="d"></span>Cleared</span>':'<span class="badge warn"><span class="d"></span>Pending</span>')+'</td>'+
      '<td class="num" data-l="Amount"><span class="txamt '+(x.kind==='in'?'in':'out')+'">'+amt+'</span></td>'+
    '</tr>';
  }).join('');
  var ledgerHtml=
    '<div class="row between center" style="margin-bottom:12px;flex-wrap:wrap;gap:10px"><div class="segtab">'+txtabs.map(function(t){ return '<button class="'+(PX.tab===t[0]?'on':'')+'" data-tx="'+t[0]+'">'+t[1]+'</button>'; }).join('')+'</div></div>'+
    '<div class="tablewrap"><table class="dtable"><thead><tr><th>Transaction</th><th>Date</th><th>Status</th><th class="num">Amount</th></tr></thead><tbody>'+rows+'</tbody></table></div>';

  var head='<div class="pm-head"><div class="lead"><h1>Payouts</h1><p>Collected rent, owner disbursements, fees and cross-border conversions — settled at a 1.5% margin, not 6.4%.</p></div></div>';

  return { title:'Payouts', sub:'InstaWallet · multi-currency', wide:true, html:
    head+bal+quick+
    '<div class="pm-cols" style="align-items:start"><div>'+due+
      '<div class="banner info"><div class="bi">'+icon('coin')+'</div><div><div class="bt">Convert at 1.5%</div><div class="bd">Move money across the corridor at a 1.5% margin — versus the 6.4% banks charge.</div></div></div></div>'+
      '<div class="panel"><div class="ph"><span class="pt">Transactions</span></div>'+ledgerHtml+'</div>'+
    '</div>',
    mount:function(root){
      root.querySelectorAll('[data-tx]').forEach(function(b){ b.addEventListener('click', function(){ PX.tab=b.getAttribute('data-tx'); App.refresh(); }); });
      root.querySelectorAll('[data-pay]').forEach(function(b){ b.addEventListener('click', function(){ var o=PM.owner(b.getAttribute('data-pay')); toast('Payout sent to '+o.name+' · arrives in seconds'); }); });
      var pa=root.querySelector('[data-act="payall"]'); if(pa) pa.addEventListener('click', function(){ toast('Owner payouts queued — 4 disbursements'); });
      var cv=root.querySelector('[data-act="convert"]'); if(cv) cv.addEventListener('click', convertModal);
      var st=root.querySelector('[data-act="statement"]'); if(st) st.addEventListener('click', function(){ toast('Statement exported (PDF)'); });
    } };
};
function convertModal(){
  UI.modal('<div class="mhead"><h3>Convert currency</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="field"><label>From</label><input value="GBP 8,000" readonly></div>'+
    '<div class="center" style="margin:-6px 0 6px;color:var(--cream-40)">'+icon('chevd','')+'</div>'+
    '<div class="field"><label>To (AED)</label><input value="AED 37,200" readonly></div>'+
    '<div class="kv"><span>Rate</span><span>1 GBP = 4.65 AED</span></div><div class="kv"><span>InstaSpace margin</span><span class="o">1.5%</span></div><div class="kv"><span>Typical bank margin</span><span class="muted" style="text-decoration:line-through">6.4%</span></div>'+
    '<button class="btn btn-primary block" style="margin-top:14px" data-go2>Convert GBP 8,000</button></div>',
    {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
      m.querySelector('[data-go2]').addEventListener('click', function(){ UI.closeModal(); toast('Converted at 1.5% — AED 37,200 added'); }); }});
}

/* =====================================================================
   MESSAGES / TENANT COMMS
   ===================================================================== */
var MS = { sel:null };
Views.messages=function(){
  if(!MS.sel) MS.sel=PM.threads[0].id;
  var listHtml=PM.threads.map(function(t){
    return '<div class="ibrow'+(t.id===MS.sel?' on':'')+(t.unread?' unread':'')+'" data-th="'+t.id+'">'+
      '<span class="iav">'+t.initials+'</span>'+
      '<div class="ib-main"><div class="ib-top"><span class="ib-nm">'+t.with+'</span><span class="ib-time">'+t.time+'</span></div>'+
        '<div class="ib-sub">'+t.sub+'</div>'+
        '<div class="ib-msg">'+esc(t.msgs[t.msgs.length-1].x)+'</div>'+
        '<div class="ib-foot"><span class="itype '+(t.role==='Owner'?'reservation':'inquiry')+'">'+t.role+'</span>'+(t.unread?'<span class="badge warn"><span class="d"></span>'+t.unread+' new</span>':'')+'</div>'+
      '</div></div>'; }).join('');
  var head='<div class="pm-head" style="margin-bottom:16px"><div class="lead"><h1>Messages</h1><p>Guests, tenants and owners in one thread list — your InstaPass identity travels with every conversation.</p></div></div>';
  return { title:'Messages', sub:'Tenant &amp; owner comms', wide:true, flush:true, html:
    head+
    '<div class="inbox" id="msgbox">'+
      '<div class="inbox-list"><div class="inbox-scroll" id="thScroll">'+listHtml+'</div></div>'+
      '<div class="inbox-detail" id="thDetail">'+threadHtml(MS.sel)+'</div>'+
    '</div>',
    mount:function(root){ bindThreads(root); } };
};
function bindThreads(root){
  root.querySelectorAll('[data-th]').forEach(function(r){ r.addEventListener('click', function(){
    MS.sel=r.getAttribute('data-th'); var t=PM.thread(MS.sel); t.unread=0;
    root.querySelectorAll('.ibrow').forEach(function(x){ x.classList.toggle('on', x===r); x===r&&x.classList.remove('unread'); });
    root.querySelector('#thDetail').innerHTML=threadHtml(MS.sel); bindThreadDetail(root);
    if(window.innerWidth<=840){ root.querySelector('#msgbox').classList.add('show-detail'); }
  }); });
  bindThreadDetail(root);
}
function bindThreadDetail(root){
  var d=root.querySelector('#thDetail'); if(!d) return;
  var back=d.querySelector('[data-back]'); if(back) back.addEventListener('click', function(){ root.querySelector('#msgbox').classList.remove('show-detail'); });
  var form=d.querySelector('.composer'); var input=d.querySelector('.composer input'); var send=d.querySelector('.composer .send');
  function doSend(){ var v=(input.value||'').trim(); if(!v) return; var t=PM.thread(MS.sel); t.msgs.push({me:true,x:v}); t.time='now'; d.querySelector('#thDetail').innerHTML=''; root.querySelector('#thDetail').innerHTML=threadHtml(MS.sel); bindThreadDetail(root); var sc=root.querySelector('.thread-scroll'); if(sc) sc.scrollTop=sc.scrollHeight; }
  if(send) send.addEventListener('click', doSend);
  if(input) input.addEventListener('keydown', function(e){ if(e.key==='Enter') doSend(); });
}
function threadHtml(id){
  var t=PM.thread(id);
  var msgs=t.msgs.map(function(m){ return '<div class="msg '+(m.me?'me':'them')+'">'+esc(m.x)+'</div>'; }).join('');
  return '<button class="btn btn-ghost sm" data-back style="margin-bottom:14px;display:none">'+icon('arrow')+'Back</button>'+
    '<div class="idh" style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--aubergine-line)"><span class="iav">'+t.initials+'</span><div style="flex:1"><h2 style="font-size:18px">'+t.with+'</h2><div class="idsub">'+t.sub+' · <span class="o" style="font-weight:600">'+t.role+'</span></div></div><span class="badge ok"><span class="d"></span>InstaPass verified</span></div>'+
    '<div class="thread-scroll" style="max-height:46vh;overflow-y:auto"><div class="thread">'+msgs+'</div></div>'+
    '<div class="composer"><input placeholder="Write a reply…"><button class="send">'+icon('send')+'</button></div>';
}

window.Views = Views;
})();
