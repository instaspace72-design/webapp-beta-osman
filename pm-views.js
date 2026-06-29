/* InstaSpace — PM Portal · views: dashboard, listings, listing detail */
(function(){
'use strict';
var icon=UI.icon, money=PM.money, toast=UI.toast, esc=UI.esc, pmicon=window.pmicon;
var Views = window.Views || {};

/* ---------- shared bits ---------- */
function catIcon(cat){ return cat==='Commercial'?'briefcase':cat==='Industrial'?'factory':'home'; }
function rateUnit(cat){ return cat==='Commercial'?'/day':cat==='Industrial'?'/mo':'/night'; }
function statusBadge(s){ var m=PM.STATUS[s]; return '<span class="badge '+m.tone+'"><span class="d"></span>'+m.label+'</span>'; }
function occMeter(occ){
  if(!occ) return '<div class="occ"><div class="om"><i style="width:0"></i></div><span class="ov dash">—</span></div>';
  var cls=occ<60?'low':occ<75?'mid':'';
  return '<div class="occ"><div class="om"><i class="'+cls+'" style="width:'+occ+'%"></i></div><span class="ov">'+occ+'%</span></div>';
}
function compliancePill(c){
  var map={ cleared:['shieldcheck','Cleared'], expiring:['shield','Expiring'], review:['clock','In review'], none:['doc','Draft'] };
  var m=map[c]||map.none; return '<span class="cmp '+c+'">'+icon(m[0],'')+m[1]+'</span>';
}
function ownerChip(id){ var o=PM.owner(id); return '<span class="owner-cell"><span class="oa">'+o.initials+'</span><span class="on">'+o.name+'</span></span>'; }
function thumb(cls,extra){ return '<span class="lthumb '+(cls||'')+'">'+(extra||'')+'</span>'; }

/* =====================================================================
   DASHBOARD
   ===================================================================== */
Views.home=function(){
  var k=PM.kpis(), t=PM.tweaks.dashLayout, o=PM.org;
  var first=o.user.split(' ')[0];

  /* --- KPI tiles --- */
  function spark(arr){ var mx=Math.max.apply(null,arr); return '<div class="spark">'+arr.map(function(v,i){ return '<i class="'+(i===arr.length-1?'hot':'')+'" style="height:'+Math.max(14,Math.round(v/mx*34))+'px"></i>'; }).join('')+'</div>'; }
  var kpis=
    '<div class="kpi-grid six">'+
      '<div class="kpi">'+spark(PM.revenueTrend)+'<div class="klab">'+icon('coin','')+'Managed revenue · MTD</div>'+
        '<div class="kbig"><span class="u">AED</span>'+PM.group(k.revenue)+'</div>'+
        '<div class="kcap"><span class="ktrend up">'+pmicon('trendup','')+k.revenueTrend+'</span> vs last month</div></div>'+
      '<div class="kpi"><div class="klab">'+icon('chart','')+'Portfolio occupancy</div>'+
        '<div class="kbig">'+k.occ+'<span class="frac">%</span></div>'+
        '<div class="kcap"><span class="ktrend up">'+pmicon('trendup','')+k.occTrend+'</span> across active</div></div>'+
      '<div class="kpi tap" data-go="listings"><div class="klab">'+icon('building','')+'Listings</div>'+
        '<div class="kbig">'+k.active+'<span class="frac"> active</span></div>'+
        '<div class="splitbar"><div class="seg-a" style="width:'+(k.active/k.total*100)+'%"></div><div class="seg-b" style="width:'+((k.paused+k.draft)/k.total*100)+'%"></div><div class="seg-c" style="width:'+(k.pending/k.total*100)+'%"></div></div>'+
        '<div class="klegend"><span class="lg"><span class="d a"></span>'+k.active+' active</span><span class="lg"><span class="d c"></span>'+k.pending+' pending</span><span class="lg"><span class="d b"></span>'+(k.paused+k.draft)+' off</span></div></div>'+
      '<div class="kpi tap" data-go="payouts"><div class="klab">'+icon('lock','')+'Held in escrow</div>'+
        '<div class="kbig"><span class="u">AED</span>'+PM.group(k.escrow)+'</div>'+
        '<div class="kcap">Releasing at verified check-in</div></div>'+
      '<div class="kpi tap" data-go="bookings"><div class="klab">'+icon('message','')+'New inquiries</div>'+
        '<div class="kbig">'+k.newInq+'</div>'+
        '<div class="kcap"><span class="ktrend up">2 new</span> awaiting reply</div></div>'+
      '<div class="kpi tap" data-go="bookings"><div class="klab">'+icon('calendar','')+'Move-ins · checkouts</div>'+
        '<div class="kbig">'+k.movements+'<span class="frac"> · 7d</span></div>'+
        '<div class="kcap">4 need key handover</div></div>'+
    '</div>';

  /* --- revenue chart --- */
  var months=['Apr','May','Jun','Jul','Aug','Sep']; var mx=Math.max.apply(null,PM.revenueTrend);
  var revenue=
    '<div class="panel dash-revenue"><div class="ph"><span class="pt">Managed revenue</span><span class="resultcount" style="margin-left:auto">AED · last 6 months</span></div>'+
      '<div class="revchart">'+PM.revenueTrend.map(function(v,i){ return '<div class="col"><div class="bv">'+v+'k</div><div class="bar" style="height:'+Math.round(v/mx*100)+'%"></div><div class="bl">'+months[i]+'</div></div>'; }).join('')+'</div></div>';

  /* --- top listings --- */
  var top=PM.listings.filter(function(l){return l.status==='active';}).slice().sort(function(a,b){return b.mrr*( b.cur==='GBP'?4.65:b.cur==='USD'?3.67:1) - a.mrr*(a.cur==='GBP'?4.65:a.cur==='USD'?3.67:1);}).slice(0,4);
  var topListings=
    '<div class="panel"><div class="ph"><span class="pt">Top performing</span><span class="more" data-go="listings">All listings '+icon('arrow','')+'</span></div>'+
      top.map(function(l){ return '<div class="minirow" data-go="listing" data-id="'+l.id+'">'+thumb(l.img)+
        '<div><div class="mn">'+l.name+'</div><div class="ms">'+l.city+' · '+l.occ+'% occupied</div></div>'+
        '<div class="mend"><div class="mv">'+money(l.mrr,l.cur)+'</div><div class="mo">/month</div></div></div>'; }).join('')+'</div>';

  /* --- attention --- */
  var attention=
    '<div class="panel"><div class="ph"><span class="pt">Needs attention</span></div><div class="feed">'+
      PM.attention.map(function(a){ return '<div class="fr tap" data-go="'+a.go+'"><div class="fi '+(a.kind==='warn'?'warn':'')+'">'+icon(a.icon,'')+'</div><div><div class="ft">'+a.t+'</div><div class="fs">'+a.s+'</div></div><span class="fchev">'+icon('chev','')+'</span></div>'; }).join('')+'</div></div>';

  /* --- activity --- */
  var activity=
    '<div class="panel"><div class="ph"><span class="pt">Recent activity</span><span class="more" data-notif-open="1">All '+icon('arrow','')+'</span></div><div class="feed">'+
      PM.activity.map(function(a){ return '<div class="fr"><div class="fi '+(a.kind==='warn'?'warn':'')+'">'+icon(a.icon,'')+'</div><div><div class="ft">'+a.t+'</div><div class="fs">'+a.s+'</div></div></div>'; }).join('')+'</div></div>';

  var head=
    '<div class="pm-head"><div class="lead"><div class="eyebrow" style="margin-bottom:8px">Good morning, '+first+'</div><h1>Your portfolio, at a glance.</h1><p>'+PM.listings.length+' listings across '+countCountries()+' markets · '+PM.owners.length+' owners · settled the moment each stay is verified.</p></div>'+
      '<div class="acts"><button class="btn btn-ghost sm" data-export="1">'+pmicon('download')+'Export</button><button class="btn btn-primary sm" data-go="listings">'+icon('plus')+'Add listing</button></div></div>';

  var body;
  if(t==='ops'){
    body=kpis+'<div class="pm-cols even" style="margin-top:16px">'+attention+activity+'</div>'+'<div class="pm-cols" style="margin-top:16px">'+revenue+topListings+'</div>';
  } else if(t==='compact'){
    body=kpis+'<div class="pm-cols even" style="margin-top:16px">'+attention+activity+'</div>'+'<div style="margin-top:16px">'+topListings+'</div>';
  } else {
    body=kpis+'<div class="pm-cols" style="margin-top:16px">'+revenue+attention+'</div>'+'<div class="pm-cols" style="margin-top:16px">'+topListings+activity+'</div>';
  }

  return { title:'Dashboard', sub:'Portfolio console', wide:true, html: head+body,
    mount:function(root){
      var ex=root.querySelector('[data-export]'); if(ex) ex.addEventListener('click', function(){ toast('Portfolio statement exported (PDF)'); });
      var ao=root.querySelector('[data-notif-open]'); if(ao) ao.addEventListener('click', function(){ App.notif(); });
    } };
};
function countCountries(){ var s={}; PM.listings.forEach(function(l){s[l.country]=1;}); return Object.keys(s).length; }

/* =====================================================================
   LISTINGS — table / grid with filter · sort · search
   ===================================================================== */
var LS = { q:'', status:'all', cat:'all', sort:'name', dir:'asc', view:null };
Views.listings=function(){
  if(LS.view===null) LS.view=PM.tweaks.listView;
  var statusChips=[['all','All'],['active','Active'],['pending','Pending'],['paused','Paused'],['draft','Draft']];
  var catChips=[['all','All types'],['Residential','Residential'],['Commercial','Commercial'],['Industrial','Industrial']];
  var head=
    '<div class="pm-head"><div class="lead"><h1>Listings</h1><p>Every space you manage — condition, compliance, occupancy and rate in one view.</p></div>'+
      '<div class="acts"><button class="btn btn-ghost sm" data-export="1">'+pmicon('download')+'Export</button><button class="btn btn-primary sm" data-add="1">'+icon('plus')+'Add listing</button></div></div>';
  var toolbar=
    '<div class="toolbar">'+
      '<div class="tb-search">'+icon('search')+'<input id="lq" placeholder="Search name, ref, city or owner" value="'+esc(LS.q)+'"></div>'+
      '<div class="filters" id="statusChips">'+statusChips.map(function(c){return '<button class="chip'+(LS.status===c[0]?' on':'')+'" data-st="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>'+
      '<div class="tb-spacer"></div>'+
      '<div class="filters" id="catChips">'+catChips.map(function(c){return '<button class="chip'+(LS.cat===c[0]?' on':'')+'" data-ct="'+c[0]+'">'+c[1]+'</button>';}).join('')+'</div>'+
      '<div class="viewtoggle"><button class="'+(LS.view==='table'?'on':'')+'" data-vt="table" title="Table">'+pmicon('rows')+'</button><button class="'+(LS.view==='grid'?'on':'')+'" data-vt="grid" title="Grid">'+pmicon('grid')+'</button></div>'+
    '</div>'+
    '<div class="row between center" style="margin-bottom:12px"><span class="resultcount" id="rcount"></span></div>';

  return { title:'Listings', sub:'Portfolio', wide:true, html: head+toolbar+'<div id="listRegion"></div>',
    mount:function(root){
      var region=root.querySelector('#listRegion');
      function render(){
        var rows=filterSort();
        root.querySelector('#rcount').textContent=rows.length+' of '+PM.listings.length+' listings';
        region.innerHTML = LS.view==='table'? tableHtml(rows) : gridHtml(rows);
        // sortable headers
        region.querySelectorAll('th.sortable').forEach(function(th){ th.addEventListener('click', function(){ var key=th.getAttribute('data-sort'); if(LS.sort===key){ LS.dir=LS.dir==='asc'?'desc':'asc'; } else { LS.sort=key; LS.dir='asc'; } render(); }); });
        region.querySelectorAll('[data-row]').forEach(function(r){ r.addEventListener('click', function(e){ if(e.target.closest('[data-stop]')) return; App.go('listing',{id:r.getAttribute('data-row')}); }); });
        region.querySelectorAll('[data-quick]').forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); quickActions(b.getAttribute('data-quick')); }); });
      }
      // wire toolbar
      var q=root.querySelector('#lq'); q.addEventListener('input', function(){ LS.q=q.value; render(); });
      root.querySelectorAll('#statusChips [data-st]').forEach(function(b){ b.addEventListener('click', function(){ LS.status=b.getAttribute('data-st'); root.querySelectorAll('#statusChips .chip').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); render(); }); });
      root.querySelectorAll('#catChips [data-ct]').forEach(function(b){ b.addEventListener('click', function(){ LS.cat=b.getAttribute('data-ct'); root.querySelectorAll('#catChips .chip').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); render(); }); });
      root.querySelectorAll('[data-vt]').forEach(function(b){ b.addEventListener('click', function(){ LS.view=b.getAttribute('data-vt'); root.querySelectorAll('[data-vt]').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); render(); }); });
      var ex=root.querySelector('[data-export]'); if(ex) ex.addEventListener('click', function(){ toast('Listings exported (CSV)'); });
      var ad=root.querySelector('[data-add]'); if(ad) ad.addEventListener('click', function(){ addListingModal(); });
      render();
    } };
};

function filterSort(){
  var aed=function(l){ return l.mrr*(l.cur==='GBP'?4.65:l.cur==='USD'?3.67:l.cur==='SAR'?0.98:l.cur==='PKR'?0.013:1); };
  var rows=PM.listings.filter(function(l){
    if(LS.status!=='all' && l.status!==LS.status) return false;
    if(LS.cat!=='all' && l.cat!==LS.cat) return false;
    if(LS.q){ var q=LS.q.toLowerCase(); var o=PM.owner(l.owner);
      var hay=(l.name+' '+l.ref+' '+l.city+' '+l.country+' '+(o?o.name:'')).toLowerCase();
      if(hay.indexOf(q)<0) return false; }
    return true;
  });
  var dir=LS.dir==='asc'?1:-1;
  rows.sort(function(a,b){
    var x,y;
    switch(LS.sort){
      case 'city': x=a.city; y=b.city; break;
      case 'status': x=a.status; y=b.status; break;
      case 'rate': x=a.rate*(a.cur==='GBP'?4.65:a.cur==='USD'?3.67:a.cur==='SAR'?0.98:a.cur==='PKR'?0.013:1); y=b.rate*(b.cur==='GBP'?4.65:b.cur==='USD'?3.67:b.cur==='SAR'?0.98:b.cur==='PKR'?0.013:1); break;
      case 'occ': x=a.occ; y=b.occ; break;
      case 'mrr': x=aed(a); y=aed(b); break;
      default: x=a.name; y=b.name;
    }
    if(typeof x==='string'){ return x.localeCompare(y)*dir; }
    return (x-y)*dir;
  });
  return rows;
}

function sortHead(label, key, num){
  var cls=(LS.sort===key?(LS.dir==='asc'?'asc':'desc'):'')+(num?' num':'');
  return '<th class="sortable '+cls+'" data-sort="'+key+'">'+label+'<span class="sar">'+icon('chevd','')+'</span></th>';
}
function tableHtml(rows){
  if(!rows.length) return emptyState();
  var body=rows.map(function(l){
    return '<tr data-row="'+l.id+'">'+
      '<td class="lcell" data-l="Listing"><div class="lname">'+thumb(l.img,'<span class="catdot">'+pmicon(catIcon(l.cat),'')+'</span>')+'<div><div class="lnm">'+l.name+'</div><div class="lref">'+l.ref+' · '+l.cat+'</div></div></div></td>'+
      '<td data-l="Location"><div class="lcity"><span class="ct">'+l.city+'</span><span class="cc">'+l.country+'</span></div></td>'+
      '<td data-l="Status">'+statusBadge(l.status)+'</td>'+
      '<td data-l="Occupancy">'+occMeter(l.occ)+'</td>'+
      '<td class="num" data-l="Rate"><span class="rate">'+(l.rate?money(l.rate,l.cur)+'<small>'+rateUnit(l.cat)+'</small>':'—')+'</span></td>'+
      '<td class="num" data-l="Revenue / mo"><span class="mrr">'+(l.mrr?money(l.mrr,l.cur):'—')+'</span></td>'+
      '<td data-l="Compliance">'+compliancePill(l.compliance)+'</td>'+
      '<td data-l="Owner">'+ownerChip(l.owner)+'</td>'+
      '<td class="num" data-l="" data-stop="1"><div class="td-actions"><span class="ib" data-quick="'+l.id+'" title="Quick actions">'+pmicon('dots')+'</span></div></td>'+
    '</tr>';
  }).join('');
  return '<div class="tablewrap"><table class="dtable"><thead><tr>'+
    sortHead('Listing','name')+sortHead('Location','city')+sortHead('Status','status')+sortHead('Occupancy','occ')+
    sortHead('Rate','rate',true)+sortHead('Revenue / mo','mrr',true)+'<th>Compliance</th>'+'<th>Owner</th>'+'<th></th>'+
    '</tr></thead><tbody>'+body+'</tbody></table></div>';
}
function gridHtml(rows){
  if(!rows.length) return emptyState();
  return '<div class="lgrid">'+rows.map(function(l){
    var tone=l.status==='active'?'ok':l.status==='pending'?'warn':'neutral';
    return '<div class="lcard" data-row="'+l.id+'">'+
      '<div class="img '+(l.img||'')+'"><span class="stbadge '+tone+'"><span class="d"></span>'+PM.STATUS[l.status].label+'</span><span class="cat">'+l.cat+'</span></div>'+
      '<div class="body"><div class="t"><div><div class="nm">'+l.name+'</div><div class="ref">'+l.ref+'</div></div><div class="pr">'+(l.rate?money(l.rate,l.cur):'—')+'</div></div>'+
        '<div class="meta">'+l.city+', '+l.country+' · '+ownerName(l.owner)+'</div>'+
        '<div class="foot">'+occMeter(l.occ)+'<span class="mrr">'+(l.mrr?money(l.mrr,l.cur)+'/mo':compliancePillText(l.compliance))+'</span></div>'+
      '</div></div>';
  }).join('')+'</div>';
}
function ownerName(id){ var o=PM.owner(id); return o?o.name:''; }
function compliancePillText(c){ return c==='review'?'In review':c==='none'?'Draft':''; }
function emptyState(){ return '<div class="empty"><div class="ei">'+icon('search')+'</div><h3>No listings match</h3><p>Try clearing a filter or searching a different term.</p></div>'; }

function quickActions(id){
  var l=PM.listing(id);
  UI.modal('<div class="mhead"><h3>'+l.name+'</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="muted" style="font-size:13px;margin-bottom:14px">'+l.ref+' · '+l.city+' · '+statusBadge(l.status)+'</div>'+
    '<div class="list">'+
      '<div class="lrow" data-act="open"><div class="ico">'+icon('eye')+'</div><div><div class="tt">Open listing</div><div class="ds">Full management view</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'+
      '<div class="lrow" data-act="rate"><div class="ico">'+icon('chart')+'</div><div><div class="tt">Adjust rate</div><div class="ds">AI-Yield suggestions</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'+
      (l.status==='active'?'<div class="lrow" data-act="pause"><div class="ico">'+icon('lock')+'</div><div><div class="tt">Pause listing</div><div class="ds">Existing bookings stay safe</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>':'<div class="lrow" data-act="publish"><div class="ico">'+icon('arrow')+'</div><div><div class="tt">Resume / publish</div><div class="ds">Make bookable again</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>')+
    '</div></div>',
    {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
      m.querySelectorAll('[data-act]').forEach(function(b){ b.addEventListener('click', function(){ var a=b.getAttribute('data-act'); UI.closeModal();
        if(a==='open') App.go('listing',{id:id});
        else if(a==='rate') toast('AI-Yield — opening pricing for '+l.name);
        else if(a==='pause') toast(l.name+' paused · bookings protected');
        else toast(l.name+' resumed'); }); }); }});
}
function addListingModal(){
  UI.modal('<div class="mhead"><h3>Add a listing</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody">'+
    '<div class="field"><label>Property name</label><input placeholder="e.g. Marina Gate · 2BR"></div>'+
    '<div class="field"><label>Owner</label><select>'+PM.owners.map(function(o){return '<option>'+o.name+'</option>';}).join('')+'</select></div>'+
    '<div class="field"><label>Category</label><div class="seg"><button class="on">Residential</button><button>Commercial</button><button>Industrial</button></div></div>'+
    '<div class="banner info" style="margin:4px 0 16px"><div class="bi">'+icon('shield')+'</div><div><div class="bt">Verified before it goes live</div><div class="bd">New listings run AI-Auditor and GovShield before publishing.</div></div></div>'+
    '<button class="btn btn-primary block" data-create>Start verification '+icon('arrow')+'</button></div>',
    {onMount:function(m){ m.querySelector('[data-x]').addEventListener('click',UI.closeModal);
      m.querySelectorAll('.seg button').forEach(function(b){ b.addEventListener('click',function(){ m.querySelectorAll('.seg button').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); }); });
      m.querySelector('[data-create]').addEventListener('click', function(){ UI.closeModal(); toast('Listing created — queued for AI-Auditor'); }); }});
}

/* =====================================================================
   LISTING DETAIL
   ===================================================================== */
Views.listing=function(p){
  var l=PM.listing(p.id)||PM.listings[0]; var o=PM.owner(l.owner);
  var related=PM.inbox.filter(function(b){return b.listing===l.id;});
  var bk=related.map(function(b){ return '<div class="lrow" data-go="bookings"><div class="ico">'+icon(b.type==='inquiry'?'message':'calendar')+'</div><div><div class="tt">'+b.guest+'</div><div class="ds">'+b.dates+' · '+inboxStatusLabel(b.status)+'</div></div><div class="end"><span style="font-family:var(--mono);font-weight:700;color:var(--cream-90)">'+money(b.amount,b.cur)+'</span><span class="chev">'+icon('chev')+'</span></div></div>'; }).join('')
    || '<div class="empty" style="padding:28px"><div class="ei">'+icon('calendar')+'</div><p>No bookings or inquiries yet.</p></div>';

  return { title:l.name, sub:l.ref+' · '+l.city, wide:true, html:
    '<div class="ld-hero '+(l.img||'')+'"><span class="ld-back" data-go="listings">'+icon('arrow','')+'Listings</span></div>'+
    '<div class="pm-head"><div class="lead"><div class="row center" style="gap:10px;flex-wrap:wrap"><h1>'+l.name+'</h1>'+statusBadge(l.status)+'</div>'+
      '<div class="ld-facts"><span><b>'+l.city+'</b>, '+l.country+'</span><span>'+l.cat+'</span>'+(l.beds?'<span><b>'+l.beds+'</b> bed</span>':'')+'<span><b>'+l.baths+'</b> bath</span><span><b>'+l.sqm+'</b> m²</span><span>Owner · <b>'+o.name+'</b></span></div></div>'+
      '<div class="acts"><button class="btn btn-ghost sm" data-rate="1">'+icon('chart')+'AI-Yield</button><button class="btn btn-ghost sm" data-edit="1">Edit</button>'+(l.status==='active'?'<button class="btn btn-danger sm" data-pause="1">Pause</button>':'<button class="btn btn-primary sm" data-pub="1">Publish</button>')+'</div></div>'+

    '<div class="kpi-grid" style="margin-bottom:16px">'+
      '<div class="kpi"><div class="klab">'+icon('coin','')+'Rate</div><div class="kbig">'+(l.rate?'<span class="u">'+(l.cur==='GBP'?'£':l.cur==='USD'?'$':l.cur)+'</span>'+PM.group(l.rate):'—')+'</div><div class="kcap">'+rateUnit(l.cat).replace('/','per ')+(l.occ?' · AI-Yield active':'')+'</div></div>'+
      '<div class="kpi"><div class="klab">'+icon('chart','')+'Occupancy</div><div class="kbig">'+(l.occ?l.occ+'<span class="frac">%</span>':'—')+'</div><div class="kcap">'+(l.rating?l.rating+' ★ · '+l.reviews+' reviews':'No stays yet')+'</div></div>'+
      '<div class="kpi"><div class="klab">'+icon('shieldcheck','')+'AI-Auditor</div><div class="kbig">'+(l.audit?l.audit:'—')+'</div><div class="kcap">'+(l.audit?'Condition verified':'Not yet audited')+'</div></div>'+
      '<div class="kpi"><div class="klab">'+icon('wallet','')+'Revenue · MTD</div><div class="kbig">'+(l.mrr?money(l.mrr,l.cur):'—')+'</div><div class="kcap">Net to owner after fee</div></div>'+
    '</div>'+

    '<div class="pm-cols">'+
      '<div class="panel"><div class="ph"><span class="pt">Bookings &amp; inquiries</span><span class="more" data-go="bookings">Inbox '+icon('arrow','')+'</span></div><div class="list">'+bk+'</div></div>'+
      '<div>'+
        '<div class="panel" style="margin-bottom:16px"><div class="ph"><span class="pt">Condition · AI-Auditor</span></div><div class="checks">'+
          (l.audit? crow('ok','Living area','Clear')+crow('ok','Kitchen &amp; safety','Clear')+crow('ok','Bedrooms','Clear')+crow('ok','Title match','Confirmed') : crow('pend','Photo walk-through','Required')+crow('pend','Condition check','Pending'))+'</div></div>'+
        '<div class="panel"><div class="ph"><span class="pt">Compliance · GovShield</span></div><div class="checks">'+
          (l.compliance==='cleared'? crow('ok','Tenancy authorisation','Verified')+crow('ok','Title NOC','Verified')+crow('ok','Registry cross-check','Passed') :
           l.compliance==='expiring'? crow('ok','Tenancy authorisation','Verified')+crow('miss','Title NOC','Expiring · 18d')+crow('ok','Registry cross-check','Passed') :
           crow('pend','Documents','In review')+crow('pend','Registry cross-check','Queued'))+'</div>'+
          (l.compliance!=='cleared'?'<button class="btn btn-ghost block sm" style="margin-top:13px" data-comp="1">Open compliance</button>':'')+'</div>'+
      '</div>'+
    '</div>',
    mount:function(root){
      var r=root.querySelector('[data-rate]'); if(r) r.addEventListener('click', function(){ toast('AI-Yield — opening pricing'); });
      var e=root.querySelector('[data-edit]'); if(e) e.addEventListener('click', function(){ toast('Opening listing editor'); });
      var pa=root.querySelector('[data-pause]'); if(pa) pa.addEventListener('click', function(){ toast(l.name+' paused · bookings protected'); });
      var pu=root.querySelector('[data-pub]'); if(pu) pu.addEventListener('click', function(){ toast(l.name+' — verification started'); });
      var c=root.querySelector('[data-comp]'); if(c) c.addEventListener('click', function(){ toast('GovShield — opening compliance centre'); });
    } };
};
function crow(s,t,st){ var ic=s==='miss'?'<path d="M12 8v5M12 16h.01"/>':s==='pend'?'<circle cx="12" cy="12" r="7"/><path d="M12 9v3l2 2"/>':'<path d="M5 13l4 4L19 7"/>';
  return '<div class="crow '+s+'"><span class="ci"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor">'+ic+'</svg></span>'+t+'<span class="st">'+st+'</span></div>'; }
function inboxStatusLabel(s){ return ({new:'New inquiry',awaiting:'Awaiting reply',confirmed:'Confirmed',escrow:'In escrow',checkin:'Checking in',checkout:'Checkout due',declined:'Declined'})[s]||s; }
window.inboxStatusLabel = inboxStatusLabel;

window.Views = Views;
})();
