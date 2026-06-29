/* ============================================================
   InstaSpace — Admin & Ops Console · mock data + store
   Platform-wide trust, verification, disputes, compliance.
   Region-neutral: markets are internal zones (N/S/E/W).
   ============================================================ */
(function(){
'use strict';
var LS_KEY = 'instaspace-admin-v1';

var ORG = { name:'Trust & Ops', user:'Yara Soto', initials:'YS', role:'Compliance Lead' };

/* ---------- verification queue (identity + listings) ----------
   kind: identity | listing
   status: pending | approved | rejected
   tier: requested KYC tier (identity)  ·  cat (listing) */
var VERIFICATIONS = [
  { id:'VR-3081', kind:'identity', who:'Omar Farooq', initials:'OF', tier:'Tier 2', status:'pending', ai:97, time:'4m ago',
    docs:['Government ID','Selfie liveness','Proof of address'], note:'Face match 99.2% · document authentic · no watchlist hits.' },
  { id:'VR-3080', kind:'listing', who:'Harbour Gate · 2BR', initials:'HG', cat:'Residential', status:'pending', ai:96, time:'11m ago',
    docs:['Tenancy authorisation','Title NOC','Condition scan'], note:'AI-Auditor matched 412 reference points · no tamper detected.' },
  { id:'VR-3079', kind:'identity', who:'Helios FZE', initials:'HF', tier:'Business', status:'pending', ai:88, time:'26m ago',
    docs:['Trade licence','Authorised signatory','Beneficial owners'], note:'Licence valid · one signatory pending counter-signature.' },
  { id:'VR-3078', kind:'listing', who:'Central Plaza · Office floor', initials:'CP', cat:'Commercial', status:'pending', ai:94, time:'38m ago',
    docs:['Trade licence','Fit-out certificate','Floor plan'], note:'Grade-A fit-out confirmed · fire certificate current.' },
  { id:'VR-3077', kind:'listing', who:'Free-Zone Warehouse', initials:'FZ', cat:'Industrial', status:'pending', ai:91, time:'1h ago',
    docs:['Industrial permit','Fire suppression','Loading access'], note:'1,200 m² verified · suppression system certified.' },
  { id:'VR-3074', kind:'identity', who:'Sara Malik', initials:'SM', tier:'Tier 1', status:'approved', ai:98, time:'2h ago',
    docs:['Government ID','Selfie liveness'], note:'Cleared automatically · high confidence.' },
  { id:'VR-3071', kind:'listing', who:'Old Town Loft', initials:'OT', cat:'Residential', status:'rejected', ai:54, time:'3h ago',
    docs:['Tenancy authorisation','Title NOC'], note:'Title NOC expired · returned to host for re-upload.' }
];

/* ---------- disputes (platform adjudication) ----------
   stage: review | evidence | decision | resolved */
var DISPUTES = [
  { id:'IS-4471', listing:'Harbour Gate · 2BR', cat:'Residential', claimant:'L. Haddad (Host)', respondent:'S. Malik (Guest)',
    amount:150, cur:'USD', reason:'Coffee table damaged at checkout', stage:'decision', opened:'2 days ago', sla:'18h left',
    evidence:[ {by:'Host', t:'Checkout condition scan', s:'AI-Auditor flagged a surface crack on the living-room table.'},
               {by:'Guest', t:'Arrival photos', s:'Guest submitted check-in photos showing the table intact.'},
               {by:'AI-Auditor', t:'Difference report', s:'87% confidence the damage occurred during the stay.'} ] },
  { id:'IS-4469', listing:'Dockside · 1BR', cat:'Residential', claimant:'M. Devlin (Guest)', respondent:'Owner',
    amount:210, cur:'GBP', reason:'Listing access code did not work on arrival', stage:'evidence', opened:'1 day ago', sla:'2d left',
    evidence:[ {by:'Guest', t:'Timeline', s:'Locked out for 40 minutes, support thread attached.'},
               {by:'Host', t:'Response', s:'New code was issued; offered partial credit for the delay.'} ] },
  { id:'IS-4465', listing:'Metro Co-working suite', cat:'Commercial', claimant:'Beacon Ltd (Tenant)', respondent:'Operator',
    amount:320, cur:'USD', reason:'Deposit not released within 5 days of checkout', stage:'review', opened:'6h ago', sla:'4d left',
    evidence:[ {by:'Tenant', t:'Statement', s:'Checkout verified Friday, deposit still held.'} ] },
  { id:'IS-4460', listing:'Coastline Villa · 4BR', cat:'Residential', claimant:'The Hales (Guest)', respondent:'Host',
    amount:0, cur:'USD', reason:'Cleaning fee dispute, resolved by mutual agreement', stage:'resolved', opened:'5 days ago', sla:'Closed',
    evidence:[ {by:'Resolution', t:'Outcome', s:'Fee waived 50%, both parties accepted. Escrow released.'} ] }
];

/* ---------- compliance (GovShield doc oversight) ----------
   state: cleared | review | expiring | missing */
var COMPLIANCE = [
  { listing:'Harbour Gate · 2BR', cat:'Residential', zone:'West', owner:'Karim Aydin', state:'cleared', doc:'Tenancy authorisation', renews:'Mar 2027' },
  { listing:'Central Loft · 1BR', cat:'Residential', zone:'West', owner:'Greenview Holdings', state:'expiring', doc:'Title NOC', renews:'18 days' },
  { listing:'Riverside · Studio', cat:'Residential', zone:'West', owner:'Greenview Holdings', state:'review', doc:'GovShield documents', renews:'In review' },
  { listing:'Central Plaza · Office floor', cat:'Commercial', zone:'West', owner:'Ridge Trading Co', state:'cleared', doc:'Trade licence', renews:'Aug 2027' },
  { listing:'Dockside · 1BR', cat:'Residential', zone:'North', owner:'Sarah Whitmore', state:'cleared', doc:'Tenancy authorisation', renews:'Jan 2027' },
  { listing:'Old Town Loft', cat:'Residential', zone:'North', owner:'Sarah Whitmore', state:'missing', doc:'Title NOC', renews:'Re-upload needed' },
  { listing:'Free-Zone Warehouse', cat:'Industrial', zone:'East', owner:'Indigo Estates', state:'cleared', doc:'Industrial permit', renews:'Q4 renewal' },
  { listing:'Highland · Office', cat:'Commercial', zone:'South', owner:'Olive Development', state:'review', doc:'Trade licence', renews:'In review' }
];

/* ---------- platform activity ---------- */
var ACTIVITY = [
  { icon:'shieldcheck', t:'Identity VR-3074 cleared automatically', s:'High-confidence match · 2h ago', kind:'ok' },
  { icon:'gavel', t:'New evidence on case IS-4469', s:'Guest submitted timeline · 3h ago', kind:'warn' },
  { icon:'building', t:'Old Town Loft returned to host', s:'Title NOC expired · 3h ago', kind:'warn' },
  { icon:'coin', t:'Settlement volume crossed daily target', s:'Across all zones · 5h ago', kind:'ok' },
  { icon:'shield', t:'2 listings entered GovShield review', s:'Auto-queued for AI-Auditor · 6h ago', kind:'ok' }
];

/* ---------- zone overview (neutral internal markets) ---------- */
var ZONES = [
  { zone:'North', listings:64, occ:81, verified:96, disputes:1 },
  { zone:'South', listings:38, occ:73, verified:92, disputes:0 },
  { zone:'East',  listings:51, occ:69, verified:94, disputes:1 },
  { zone:'West',  listings:112, occ:84, verified:97, disputes:2 }
];

/* ---------- store ---------- */
function load(){ try{ var r=localStorage.getItem(LS_KEY); if(r) return JSON.parse(r); }catch(e){} return null; }
var persisted = load() || {};
var ADMIN = {
  org:ORG,
  verifications: persisted.verifications || JSON.parse(JSON.stringify(VERIFICATIONS)),
  disputes: persisted.disputes || JSON.parse(JSON.stringify(DISPUTES)),
  compliance: COMPLIANCE, activity: ACTIVITY, zones: ZONES,
  tweaks: Object.assign({ density:'comfortable', motion:true }, persisted.tweaks||{}),
  save:function(){ try{ localStorage.setItem(LS_KEY, JSON.stringify({ verifications:this.verifications, disputes:this.disputes, tweaks:this.tweaks })); }catch(e){} },
  verification:function(id){ return this.verifications.filter(function(v){return v.id===id;})[0]; },
  dispute:function(id){ return this.disputes.filter(function(d){return d.id===id;})[0]; },
  kpis:function(){
    var vp=this.verifications.filter(function(v){return v.status==='pending';}).length;
    var dop=this.disputes.filter(function(d){return d.stage!=='resolved';}).length;
    var rev=this.compliance.filter(function(c){return c.state==='review'||c.state==='expiring'||c.state==='missing';}).length;
    return { verPending:vp, disputesOpen:dop, complianceFlags:rev,
      listings:this.zones.reduce(function(a,z){return a+z.listings;},0),
      settlement:'2.4M', verifiedRate:96 };
  }
};
window.ADMIN = ADMIN;
})();
