/* InstaSpace — Property Manager Portal · mock data + store ============
   Operator: Meridian PMC — manages owners' spaces across markets.
   Multi-currency portfolio (AED / GBP / USD / PKR / SAR).
   ==================================================================== */
(function(){
'use strict';

var LS_KEY = 'instaspace-pm-portal-v1';

/* ---------- currency helpers ---------- */
var CUR_PREFIX = { AED:'AED\u00A0', SAR:'SAR\u00A0', PKR:'PKR\u00A0', GBP:'\u00A3', USD:'$' };
function group(n){ return (Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function money(n, cur){ cur = cur||'AED'; var p = CUR_PREFIX[cur]||(cur+'\u00A0'); return p + group(n); }
/* compact AED for KPI headlines */
function aedK(n){ if(n>=1e6) return 'AED\u00A0'+(n/1e6).toFixed(n>=1e7?0:1)+'M'; if(n>=1e3) return 'AED\u00A0'+(n/1e3).toFixed(n>=1e5?0:1)+'k'; return 'AED\u00A0'+group(n); }

/* ---------- the operator ---------- */
var ORG = { name:'Meridian PMC', short:'MP', user:'Nadia Rahman', initials:'NR', role:'Operations', city:'—', plan:'Scale' };

/* ---------- owners ---------- */
var OWNERS = [
  { id:'o1', name:'Karim Aydin', initials:'KA', props:4 },
  { id:'o2', name:'Greenview Holdings', initials:'GH', props:3 },
  { id:'o3', name:'Sarah Whitmore',    initials:'SW', props:2 },
  { id:'o4', name:'Indigo Estates',     initials:'IE', props:3 },
  { id:'o5', name:'Ridge Trading Co', initials:'RT', props:2 },
  { id:'o6', name:'Olive Development',  initials:'OD', props:2 }
];

/* ---------- listings (16) ---------- */
/* status: active | pending | paused | draft   compliance: cleared | review | expiring | none */
var LISTINGS = [
  { id:'L01', ref:'IS-2041', name:'Harbour Gate · 2BR', city:'Harbour District', country:'West', cat:'Residential', status:'active', owner:'o1',
    beds:2, baths:2, sqm:118, rate:540, cur:'AED', occ:88, rating:4.9, reviews:128, mrr:13860, audit:96, compliance:'cleared', img:'',
    next:{type:'checkout', who:'O. Farooq', date:'Tomorrow'} },
  { id:'L02', ref:'IS-2044', name:'Bayfront Beachfront · 2BR', city:'Bayfront Quarter', country:'West', cat:'Residential', status:'active', owner:'o1',
    beds:2, baths:2, sqm:124, rate:690, cur:'AED', occ:82, rating:4.8, reviews:94, mrr:16974, audit:94, compliance:'cleared', img:'v2',
    next:{type:'move-in', who:'S. Malik', date:'Thu'} },
  { id:'L03', ref:'IS-2049', name:'Central Loft · 1BR', city:'City Centre', country:'West', cat:'Residential', status:'active', owner:'o2',
    beds:1, baths:1, sqm:74, rate:480, cur:'AED', occ:76, rating:4.7, reviews:61, mrr:10944, audit:92, compliance:'expiring', img:'v3',
    next:{type:'review', who:'Title NOC', date:'18 days'} },
  { id:'L04', ref:'IS-2052', name:'Coastline Villa · 4BR', city:'Coastline Estate', country:'West', cat:'Residential', status:'active', owner:'o1',
    beds:4, baths:5, sqm:410, rate:1850, cur:'AED', occ:71, rating:5.0, reviews:38, mrr:39405, audit:98, compliance:'cleared', img:'v2',
    next:{type:'move-out', who:'The Hales', date:'Sat'} },
  { id:'L05', ref:'IS-2058', name:'Riverside · Studio', city:'Riverside', country:'West', cat:'Residential', status:'pending', owner:'o2',
    beds:0, baths:1, sqm:46, rate:360, cur:'AED', occ:0, rating:0, reviews:0, mrr:0, audit:0, compliance:'review', img:'v3',
    next:{type:'review', who:'GovShield docs', date:'In review'} },
  { id:'L06', ref:'IS-2061', name:'Central Plaza · Office floor', city:'Financial District', country:'West', cat:'Commercial', status:'active', owner:'o5',
    beds:0, baths:2, sqm:620, rate:1450, cur:'AED', occ:64, rating:4.9, reviews:22, mrr:27840, audit:97, compliance:'cleared', img:'',
    next:{type:'move-in', who:'Helios FZE', date:'Mon'} },
  { id:'L07', ref:'IS-2066', name:'Metro Co-working suite', city:'Innovation Park', country:'West', cat:'Commercial', status:'active', owner:'o5',
    beds:0, baths:1, sqm:180, rate:320, cur:'AED', occ:73, rating:4.6, reviews:40, mrr:7008, audit:93, compliance:'cleared', img:'v2',
    next:{type:'checkout', who:'Beacon Ltd', date:'Fri'} },
  { id:'L08', ref:'IS-2070', name:'Lakeside · 3BR', city:'Lakeside', country:'West', cat:'Residential', status:'active', owner:'o2',
    beds:3, baths:3, sqm:206, rate:820, cur:'AED', occ:68, rating:4.7, reviews:33, mrr:16728, audit:95, compliance:'cleared', img:'v3',
    next:{type:'move-in', who:'A. Nasser', date:'Wed'} },
  { id:'L09', ref:'IS-2073', name:'Skyline Tower · 2BR', city:'Lakeside', country:'West', cat:'Residential', status:'paused', owner:'o3',
    beds:2, baths:2, sqm:132, rate:600, cur:'AED', occ:0, rating:4.5, reviews:18, mrr:0, audit:90, compliance:'cleared', img:'',
    next:{type:'paused', who:'Refurbishment', date:'Until Aug'} },
  { id:'L10', ref:'IS-2081', name:'Dockside · 1BR', city:'Metro West', country:'North', cat:'Residential', status:'active', owner:'o3',
    beds:1, baths:1, sqm:58, rate:210, cur:'GBP', occ:79, rating:4.8, reviews:71, mrr:4977, audit:94, compliance:'cleared', img:'v2',
    next:{type:'checkout', who:'M. Devlin', date:'Sun'} },
  { id:'L11', ref:'IS-2088', name:'Old Town Loft', city:'Metro West', country:'North', cat:'Residential', status:'pending', owner:'o3',
    beds:1, baths:1, sqm:66, rate:240, cur:'GBP', occ:0, rating:0, reviews:0, mrr:0, audit:0, compliance:'review', img:'v3',
    next:{type:'review', who:'AI-Auditor', date:'Queued'} },
  { id:'L12', ref:'IS-2092', name:'Northgate Apt · 2BR', city:'Northgate', country:'North', cat:'Residential', status:'active', owner:'o3',
    beds:2, baths:1, sqm:84, rate:160, cur:'GBP', occ:84, rating:4.7, reviews:52, mrr:4032, audit:93, compliance:'cleared', img:'' ,
    next:{type:'move-in', who:'L. Carter', date:'Tue'} },
  { id:'L13', ref:'IS-2097', name:'Seaview · 3BR', city:'Port City', country:'East', cat:'Residential', status:'active', owner:'o4',
    beds:3, baths:3, sqm:240, rate:140, cur:'USD', occ:58, rating:4.6, reviews:14, mrr:2436, audit:91, compliance:'cleared', img:'v2',
    next:{type:'checkout', who:'F. Ahmed', date:'Sat'} },
  { id:'L14', ref:'IS-2101', name:'Parkside Townhouse', city:'Port City', country:'East', cat:'Residential', status:'draft', owner:'o4',
    beds:3, baths:3, sqm:280, rate:0, cur:'PKR', occ:0, rating:0, reviews:0, mrr:0, audit:0, compliance:'none', img:'v3',
    next:{type:'draft', who:'Details', date:'Incomplete'} },
  { id:'L15', ref:'IS-2104', name:'Free-Zone Warehouse', city:'Port City', country:'East', cat:'Industrial', status:'active', owner:'o4',
    beds:0, baths:1, sqm:1200, rate:2100, cur:'USD', occ:92, rating:4.8, reviews:11, mrr:57960, audit:95, compliance:'cleared', img:'',
    next:{type:'lease', who:'PortLogix', date:'Renews Q4'} },
  { id:'L16', ref:'IS-2110', name:'Highland · Office', city:'Highland', country:'South', cat:'Commercial', status:'pending', owner:'o6',
    beds:0, baths:2, sqm:480, rate:1200, cur:'SAR', occ:0, rating:0, reviews:0, mrr:0, audit:0, compliance:'review', img:'v2',
    next:{type:'review', who:'Trade licence', date:'In review'} }
];

/* ---------- bookings / inquiries inbox ---------- */
/* type: inquiry | reservation   status: new | awaiting | confirmed | escrow | checkin | checkout | declined */
var INBOX = [
  { id:'BK-7012', type:'inquiry', listing:'L02', guest:'Sara Malik', initials:'SM', from:'Northgate', dates:'14–18 Oct', nights:4, guests:2, amount:2760, cur:'AED', status:'new', time:'12m ago',
    msg:'Hi — is the JBR 2BR available for these dates? Travelling with my partner, would need early check-in if possible.' },
  { id:'BK-7009', type:'inquiry', listing:'L06', guest:'Helios FZE', initials:'HF', from:'Financial District', dates:'Mon · 12 mo', nights:0, guests:20, amount:27840, cur:'AED', status:'new', time:'48m ago',
    msg:'We\'d like to lease the Central Plaza floor for our regional team. Can you confirm fit-out and the trade-licence verification status?' },
  { id:'BK-7004', type:'reservation', listing:'L01', guest:'Omar Farooq', initials:'OF', from:'Northgate', dates:'12–16 Oct', nights:4, guests:2, amount:2340, cur:'AED', status:'escrow', time:'2h ago',
    msg:'Confirmed for the 12th. Funds held in escrow, releasing at verified check-in.' },
  { id:'BK-6998', type:'reservation', listing:'L08', guest:'Ahmed Nasser', initials:'AN', from:'Gulfside', dates:'16–23 Oct', nights:7, guests:5, amount:5740, cur:'AED', status:'confirmed', time:'5h ago',
    msg:'Family of five, move-in Wednesday. Requested a cot and parking for two cars.' },
  { id:'BK-6990', type:'reservation', listing:'L10', guest:'Maria Devlin', initials:'MD', from:'Bay Harbour', dates:'03–09 Oct', nights:6, guests:2, amount:1260, cur:'GBP', status:'checkout', time:'8h ago',
    msg:'Checkout due Sunday. AI-Auditor will run the condition check on departure.' },
  { id:'BK-6985', type:'inquiry', listing:'L04', guest:'The Hale Family', initials:'TH', from:'Metro West', dates:'22 Oct – 02 Nov', nights:11, guests:6, amount:20350, cur:'AED', status:'awaiting', time:'Yesterday',
    msg:'Interested in the Palm villa for half-term. Is the rate flexible for an 11-night stay?' },
  { id:'BK-6980', type:'reservation', listing:'L15', guest:'PortLogix', initials:'PL', from:'Port City', dates:'Lease · renewing', nights:0, guests:0, amount:57960, cur:'USD', status:'confirmed', time:'Yesterday',
    msg:'Warehouse lease renewal for Q4. Settlement in USD as before.' },
  { id:'BK-6974', type:'reservation', listing:'L07', guest:'Beacon Ltd', initials:'BL', from:'Innovation Park', dates:'01–05 Oct', nights:4, guests:8, amount:1280, cur:'AED', status:'checkout', time:'2d ago',
    msg:'Co-working suite checkout Friday. Invoice settled, deposit to release.' },
  { id:'BK-6968', type:'reservation', listing:'L12', guest:'Liam Carter', initials:'LC', from:'Eastvale', dates:'15–20 Oct', nights:5, guests:3, amount:800, cur:'GBP', status:'confirmed', time:'2d ago',
    msg:'Move-in Tuesday for the Deansgate apartment. All documents submitted.' },
  { id:'BK-6960', type:'inquiry', listing:'L13', guest:'Fatima Ahmed', initials:'FA', from:'Port City', dates:'05–08 Oct', nights:3, guests:4, amount:420, cur:'USD', status:'declined', time:'3d ago',
    msg:'Requested dates overlap an existing reservation — offered alternative window.' }
];

/* ---------- payouts / transactions ---------- */
var BALANCES = [
  { cur:'AED', amount:486200, escrow:86400 },
  { cur:'GBP', amount:38940,  escrow:7120 },
  { cur:'USD', amount:74300,  escrow:12480 }
];
/* kind: in | out | fee | fx   */
var LEDGER = [
  { id:'TX-9051', kind:'in',  t:'Settled · Bayfront Beachfront', s:'Check-in verified · 0.4s', listing:'L02', amount:2250, cur:'AED', date:'Today · 09:41', status:'cleared' },
  { id:'TX-9050', kind:'out', t:'Owner payout · Karim Aydin', s:'4 listings · September', owner:'o1', amount:62400, cur:'AED', date:'Today · 08:00', status:'cleared' },
  { id:'TX-9048', kind:'fee', t:'Management fee · Harbour Gate', s:'15% of settled rent', listing:'L01', amount:2079, cur:'AED', date:'Today · 07:55', status:'cleared' },
  { id:'TX-9045', kind:'in',  t:'Settled · Free-Zone Warehouse', s:'Lease instalment · global settlement', listing:'L15', amount:4830, cur:'USD', date:'Yesterday', status:'cleared' },
  { id:'TX-9043', kind:'fx',  t:'Converted GBP → AED', s:'1.5% margin · £8,000', amount:37200, cur:'AED', date:'Yesterday', status:'cleared' },
  { id:'TX-9040', kind:'out', t:'Owner payout · Sarah Whitmore', s:'Dockside · September', owner:'o3', amount:3640, cur:'GBP', date:'2 Oct', status:'pending' },
  { id:'TX-9036', kind:'in',  t:'Settled · Central Loft', s:'Check-in verified · 0.6s', listing:'L03', amount:1620, cur:'AED', date:'2 Oct', status:'cleared' },
  { id:'TX-9032', kind:'fee', t:'Management fee · Coastline Villa', s:'15% of settled rent', listing:'L04', amount:5910, cur:'AED', date:'1 Oct', status:'cleared' },
  { id:'TX-9028', kind:'out', t:'Owner payout · Greenview Holdings', s:'3 listings · September', owner:'o2', amount:41200, cur:'AED', date:'1 Oct', status:'cleared' }
];
/* owner payouts due */
var PAYOUTS_DUE = [
  { owner:'o1', amount:18600, cur:'AED', listings:4, due:'Due in 2 days' },
  { owner:'o3', amount:3640,  cur:'GBP', listings:2, due:'Awaiting approval' },
  { owner:'o4', amount:5210,  cur:'USD', listings:3, due:'Due in 5 days' },
  { owner:'o2', amount:12480, cur:'AED', listings:3, due:'Scheduled · 7 Oct' }
];

/* ---------- messages / tenant comms ---------- */
var THREADS = [
  { id:'TH1', with:'Sara Malik', sub:'Bayfront Beachfront · BK-7012', initials:'SM', role:'Guest', unread:1, time:'12m',
    msgs:[ {me:false,x:'Hi — is the JBR 2BR available for the 14th to 18th? Early check-in would help.'},
           {me:true, x:'Hello Sara — yes, those dates are open. Early check-in from 12pm is fine for this listing.'},
           {me:false,x:'Perfect, shall I go ahead and book?'} ] },
  { id:'TH2', with:'Karim Aydin', sub:'Owner · 4 listings', initials:'KA', role:'Owner', unread:0, time:'1h',
    msgs:[ {me:false,x:'Did the September payout clear? Want to confirm before the board meeting.'},
           {me:true, x:'Yes — AED 62,400 settled to your account this morning. Statement attached in the portal.'},
           {me:false,x:'Excellent, thank you.'} ] },
  { id:'TH3', with:'Helios FZE', sub:'Central Plaza · BK-7009', initials:'HF', role:'Tenant', unread:2, time:'3h',
    msgs:[ {me:false,x:'Can you confirm the trade-licence verification before we sign?'},
           {me:true, x:'GovShield has the floor cleared — I\'ll share the compliance certificate now.'} ] },
  { id:'TH4', with:'Maria Devlin', sub:'Dockside · BK-6990', initials:'MD', role:'Guest', unread:0, time:'8h',
    msgs:[ {me:false,x:'All good for checkout Sunday — keys in the lockbox?'},
           {me:true, x:'Yes, leave them in the lockbox. AI-Auditor runs the condition check automatically on departure.'} ] },
  { id:'TH5', with:'PortLogix', sub:'Free-Zone Warehouse · lease', initials:'PL', role:'Tenant', unread:0, time:'Yesterday',
    msgs:[ {me:false,x:'Renewing the warehouse lease for Q4, USD settlement as before.'},
           {me:true, x:'Noted — I\'ll prepare the renewal and send it across today.'} ] }
];

/* ---------- dashboard signals ---------- */
var REVENUE_TREND = [ 218, 240, 226, 268, 290, 312 ]; // AED k, last 6 months
var ACTIVITY = [
  { icon:'wallet', t:'AED 2,250 settled · Bayfront Beachfront', s:'Check-in verified · 12m ago', kind:'ok' },
  { icon:'message', t:'New inquiry · Helios FZE on Central Plaza', s:'48m ago', kind:'ok' },
  { icon:'shield', t:'GovShield: Central Loft NOC expiring', s:'Renew within 18 days', kind:'warn' },
  { icon:'building', t:'Old Town Loft queued for AI-Auditor', s:'1h ago', kind:'ok' },
  { icon:'coin', t:'Owner payout pending approval · S. Whitmore', s:'£3,640 · 2h ago', kind:'warn' }
];
var ATTENTION = [
  { icon:'shield', t:'3 listings awaiting GovShield clearance', s:'Riverside · Shoreditch · Highland Olaya', go:'listings', kind:'warn' },
  { icon:'coin', t:'2 owner payouts need approval', s:'£3,640 to S. Whitmore · USD 5,210 to Indus', go:'payouts', kind:'warn' },
  { icon:'message', t:'2 inquiries awaiting your reply', s:'Oldest waiting 12 minutes', go:'bookings', kind:'ok' },
  { icon:'calendar', t:'9 move-ins & checkouts in the next 7 days', s:'4 require key handover', go:'bookings', kind:'ok' }
];

/* ---------- store ---------- */
function load(){ try{ var r=localStorage.getItem(LS_KEY); if(r) return JSON.parse(r); }catch(e){} return null; }
var persisted = load() || {};
var PM = {
  org: ORG,
  listings: LISTINGS, owners: OWNERS, inbox: INBOX, threads: THREADS,
  ledger: LEDGER, balances: BALANCES, payoutsDue: PAYOUTS_DUE,
  revenueTrend: REVENUE_TREND, activity: ACTIVITY, attention: ATTENTION,
  // ui state (persisted)
  tweaks: Object.assign({ density:'comfortable', motion:true, dashLayout:'overview', listView:'table' }, persisted.tweaks||{}),
  save:function(){ try{ localStorage.setItem(LS_KEY, JSON.stringify({ tweaks:this.tweaks })); }catch(e){} },
  listing:function(id){ return LISTINGS.filter(function(l){return l.id===id;})[0]; },
  owner:function(id){ return OWNERS.filter(function(o){return o.id===id;})[0]; },
  thread:function(id){ return THREADS.filter(function(t){return t.id===id;})[0]; },
  inboxItem:function(id){ return INBOX.filter(function(b){return b.id===id;})[0]; },
  // derived KPIs
  kpis:function(){
    var active=0, pending=0, paused=0, draft=0, occSum=0, occN=0;
    LISTINGS.forEach(function(l){
      if(l.status==='active'){ active++; occSum+=l.occ; occN++; }
      else if(l.status==='pending') pending++;
      else if(l.status==='paused') paused++;
      else if(l.status==='draft') draft++;
    });
    var newInq = INBOX.filter(function(b){return b.status==='new';}).length;
    var escrowAED = BALANCES.reduce(function(a,b){ return a + b.escrow * (b.cur==='GBP'?4.65:b.cur==='USD'?3.67:b.cur==='SAR'?0.98:b.cur==='PKR'?0.013:1); }, 0);
    return {
      revenue: 312480, revenueTrend: '+14%',
      occ: Math.round(occSum/occN), occTrend:'+5 pts',
      active:active, pending:pending, paused:paused, draft:draft, total:LISTINGS.length,
      escrow: Math.round(escrowAED),
      newInq: INBOX.filter(function(b){return b.type==='inquiry'&&(b.status==='new'||b.status==='awaiting');}).length,
      movements: 9
    };
  }
};

/* status meta */
PM.STATUS = {
  active:  { label:'Active',  tone:'ok' },
  pending: { label:'Pending', tone:'warn' },
  paused:  { label:'Paused',  tone:'neutral' },
  draft:   { label:'Draft',   tone:'neutral' }
};
PM.money = money; PM.group = group; PM.aedK = aedK;

window.PM = PM;
})();
