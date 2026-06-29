/* InstaSpace Web App — mock data + store ============================= */
(function(){
'use strict';

var LS_KEY = 'instaspace-webapp-v1';

var seed = {
  users: {
    host:  { name:'Layla Haddad',  initials:'LH', role:'Host',  kyc:'Tier 2', since:'2026', city:'—' },
    guest: { name:'Omar Farooq',   initials:'OF', role:'Guest', kyc:'Tier 1', since:'2026', city:'Northgate' }
  },
  // properties (marketplace + host portfolio)
  properties: [
    { id:'p1', name:'Harbour Gate · 2BR', cat:'Residential', city:'Harbour District', price:540, rating:4.9, reviews:128, beds:2, baths:2, guests:4, verified:true, img:'', host:'Layla Haddad', auditScore:96, blurb:'High-floor two-bed with full marina views, borderless payout, instant settlement at check-in.' },
    { id:'p2', name:'Bayfront Beachfront', cat:'Residential', city:'JBR', price:690, rating:4.8, reviews:94, beds:2, baths:2, guests:4, verified:true, img:'v2', host:'Layla Haddad', auditScore:94, blurb:'Steps from the beach, serviced residence with verified condition and 24/7 access.' },
    { id:'p3', name:'Central Loft', cat:'Residential', city:'City Centre', price:480, rating:4.7, reviews:61, beds:1, baths:1, guests:2, verified:true, img:'v3', host:'Layla Haddad', auditScore:92, blurb:'Open-plan loft by the Burj, smart-home verified, flexible check-in.' },
    { id:'p4', name:'Central Plaza · Office floor', cat:'Commercial', city:'—', price:1450, rating:4.9, reviews:22, beds:0, baths:2, guests:20, verified:true, img:'', host:'Meridian PMC', auditScore:97, blurb:'Grade-A fitted floor, trade-licence verified, ready for immediate occupancy.' },
    { id:'p5', name:'Metro Co-working suite', cat:'Commercial', city:'Innovation Park', price:320, rating:4.6, reviews:40, beds:0, baths:1, guests:8, verified:true, img:'v2', host:'WorkSpace Co', auditScore:93, blurb:'Flexi-desk suite with AV and connectivity confirmed, monthly or daily.' },
    { id:'p6', name:'Port City Free-Zone warehouse', cat:'Industrial', city:'Port City', price:2100, rating:4.8, reviews:11, beds:0, baths:1, guests:0, verified:true, img:'v3', host:'PortLogix', auditScore:95, blurb:'1,200 m² logistics bay, loading access and fire-suppression verified, USD settlement.' }
  ],
  // host portfolio (subset they own/manage)
  portfolio: ['p1','p2','p3'],
  // bookings (guest trips + host reservations)
  bookings: [
    { id:'b1', prop:'p1', guest:'Omar Farooq', host:'Layla Haddad', from:'12 Oct', to:'16 Oct', nights:4, guests:2, rate:540, total:2340, status:'escrow', side:'both', checkin:false },
    { id:'b2', prop:'p2', guest:'Sara Malik', host:'Layla Haddad', from:'02 Oct', to:'05 Oct', nights:3, guests:2, rate:690, total:2250, status:'settled', side:'host', checkin:true },
    { id:'b3', prop:'p3', guest:'Omar Farooq', host:'Layla Haddad', from:'24 Nov', to:'27 Nov', nights:3, guests:2, rate:480, total:1620, status:'upcoming', side:'guest', checkin:false }
  ],
  // wallet
  wallet: {
    host:  { balance:48250, currency:'AED', escrow:2160, settling:0 },
    guest: { balance:3200,  currency:'AED', escrow:2340, settling:0 }
  },
  ledger: {
    host: [
      { id:'l1', kind:'in', t:'Settled · Bayfront Beachfront', s:'Check-in verified · 0.4s', a:'+ 2,250' },
      { id:'l2', kind:'in', t:'Settled · Central Loft', s:'Check-in verified · 0.6s', a:'+ 1,620' },
      { id:'l3', kind:'out', t:'Converted to GBP', s:'1.5% margin', a:'− 5,000' },
      { id:'l4', kind:'in', t:'AI-Yield uplift · Expo week', s:'6 applied changes', a:'+ 3,180' }
    ],
    guest: [
      { id:'g1', kind:'out', t:'Booking · Harbour Gate', s:'Held in escrow until check-in', a:'− 2,340' },
      { id:'g2', kind:'in', t:'Top-up', s:'Card ending 4417', a:'+ 5,000' }
    ]
  },
  // messages
  threads: [
    { id:'t1', with:'Layla Haddad', role:'Host', verified:true, last:'I\'ll send the access code the day before.', time:'09:41', unread:0,
      msgs:[ {me:false,x:'Hi! The apartment is ready for your dates. Early check-in works if you need it.'},
             {me:true, x:'Perfect — we\'ll arrive around 1pm. Is parking included?'},
             {me:false,x:'Yes, one bay in the building. I\'ll send the access code the day before.'} ] },
    { id:'t2', with:'Omar Farooq', role:'Guest', verified:true, last:'Thanks — looking forward to it.', time:'Yesterday', unread:2,
      msgs:[ {me:false,x:'Hello, is the 2BR available for the 12th to 16th?'},
             {me:true, x:'It is — I\'ve held it for you. Booking protected by InstaSpace.'},
             {me:false,x:'Thanks — looking forward to it.'} ] },
    { id:'t3', with:'Meridian PMC', role:'Host', verified:true, last:'Trade licence is on file and verified.', time:'Mon', unread:0,
      msgs:[ {me:false,x:'Trade licence is on file and verified.'} ] }
  ],
  // reviews
  reviews: [
    { id:'r1', prop:'p1', by:'Sara Malik', stars:5, when:'Sep 2026', text:'Exactly as verified. Settlement was instant and the host was responsive. Would book again.' },
    { id:'r2', prop:'p1', by:'James O.', stars:5, when:'Aug 2026', text:'The verified condition report gave us total confidence before arriving. Spotless.' },
    { id:'r3', prop:'p1', by:'Aisha R.', stars:4, when:'Aug 2026', text:'Great location and trust felt built-in. Minor wait for parking access.' }
  ],
  // disputes
  disputes: [
    { id:'IS-4471', prop:'p1', claimant:'Layla Haddad', against:'Sara Malik', amount:150, reason:'Coffee table damaged at checkout',
      status:'open', stage:'respond' }
  ],
  // notifications
  notifs: [
    { id:'n1', icon:'shield', t:'GovShield cleared Central Loft', s:'2h ago', kind:'ok' },
    { id:'n2', icon:'wallet', t:'AED 2,250 settled to your wallet', s:'5h ago', kind:'ok' },
    { id:'n3', icon:'gavel', t:'A guest responded on case IS-4471', s:'Yesterday', kind:'warn' }
  ]
};

function load(){
  try{ var raw = localStorage.getItem(LS_KEY); if(raw) return JSON.parse(raw); }catch(e){}
  return null;
}

var persisted = load() || {};
var Store = {
  // session/ui state (persisted)
  role: persisted.role || 'host',
  kyc:  persisted.kyc  || { host:'active', guest:'active' }, // 'none' | 'active'
  saved: persisted.saved || [],
  onboarded: persisted.onboarded || false,
  tweaks: Object.assign({ density:'comfortable', motion:true, badges:true, currency:'AED' }, persisted.tweaks||{}),
  // mutable data (persisted shallow)
  walletState: persisted.walletState || JSON.parse(JSON.stringify(seed.wallet)),
  bookingState: persisted.bookingState || JSON.parse(JSON.stringify(seed.bookings)),
  disputeState: persisted.disputeState || JSON.parse(JSON.stringify(seed.disputes)),
  yieldEnabled: persisted.yieldEnabled || {},
  data: seed,
  save:function(){
    try{
      localStorage.setItem(LS_KEY, JSON.stringify({
        role:this.role, kyc:this.kyc, saved:this.saved, onboarded:this.onboarded, tweaks:this.tweaks,
        walletState:this.walletState, bookingState:this.bookingState, disputeState:this.disputeState, yieldEnabled:this.yieldEnabled
      }));
    }catch(e){}
  },
  user:function(){ return seed.users[this.role]; },
  wallet:function(){ return this.walletState[this.role]; },
  prop:function(id){ return seed.properties.filter(function(p){return p.id===id;})[0]; },
  booking:function(id){ return this.bookingState.filter(function(b){return b.id===id;})[0]; }
};

window.DATA = seed;
window.Store = Store;
})();
