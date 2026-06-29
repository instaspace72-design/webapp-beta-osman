/* InstaSpace Web App — core views: onboarding, dashboards, account ==== */
(function(){
'use strict';
var icon=UI.icon, money=UI.money, fmt=UI.fmt, toast=UI.toast;

/* module teaser card — icon tile + label header, status badge, corner watermark */
function modCard(go, ic, label, title, desc, tone, badge){
  return '<div class="card modcard" data-go="'+go+'">'+
    '<span class="modwm" aria-hidden="true">'+icon(ic,'')+'</span>'+
    '<div class="modcard-h">'+
      '<span class="ico-tile">'+icon(ic,'')+'</span>'+
      '<span class="modlbl">'+label+'</span>'+
      '<span class="modbadge '+(tone||'ok')+'"><span class="d"></span>'+badge+'</span>'+
    '</div>'+
    '<div class="modcard-t">'+title+'</div>'+
    '<div class="modcard-d">'+desc+'</div>'+
    '<span class="modcard-go">Open '+icon('arrow','')+'</span>'+
  '</div>';
}

/* =====================================================================
   ONBOARDING (full-screen overlay) — signup -> role -> InstaPass KYC
   ===================================================================== */
var Onboard = {
  el:null, step:0, role:'host',
  start:function(role){
    this.role = role||'host'; this.step = 0;
    var o = document.createElement('div'); o.className='wa-landing on'; o.id='onboard';
    o.style.background='radial-gradient(95% 80% at 50% 12%,#3A1E54,#1E0C30 60%,#120822)';
    document.body.appendChild(o); this.el=o; this.render();
  },
  done:function(){ if(this.el){ this.el.remove(); this.el=null; } Store.onboarded=true; Store.kyc[this.role]='active'; Store.save(); App.enter(this.role); },
  render:function(){
    var s=this.step, html='';
    var wrap=function(inner){ return '<div class="grid-tx"></div><div style="position:relative;z-index:1;width:100%;max-width:440px;margin:0 auto">'+inner+'</div>'; };
    var brand='<div class="row center" style="gap:12px;justify-content:center;margin-bottom:26px"><span class="mark"><img src="'+UI.brandIcon()+'" alt="" style="height:30px"></span><span class="wm" style="font-size:26px">Insta<span class="sp">Space</span></span></div>';
    if(s===0){
      html=wrap(brand+
        '<div class="card pad-lg">'+
        '<div class="eyebrow" style="margin-bottom:10px">Step 1 of 3 · Sign up</div>'+
        '<h1 style="font-size:26px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">Create your account</h1>'+
        '<p class="muted" style="font-size:14px;margin-bottom:20px">One verified identity for every space you list or stay in.</p>'+
        '<div class="field"><label>Email</label><input type="email" value="omar@example.com"></div>'+
        '<div class="field"><label>Password</label><input type="password" value="············"></div>'+
        '<button class="btn btn-primary block" data-on="next">Create account '+icon('arrow','')+'</button>'+
        '<div class="row center" style="gap:10px;margin:16px 0"><div class="divline" style="flex:1"></div><span class="eyebrow">or</span><div class="divline" style="flex:1"></div></div>'+
        '<div class="row" style="gap:10px"><button class="btn btn-cream" style="flex:1" data-on="next">Continue with Google</button><button class="btn btn-cream" style="flex:1" data-on="next">Continue with Apple</button></div>'+
        '<p class="center muted" style="font-size:12.5px;margin-top:18px">Already have an account? <a class="o" style="font-weight:700" data-on="login">Log in</a></p>'+
        '</div>');
    } else if(s===1){
      var roles=[['host','building','I host','List and manage my own property'],['agent','users','I\'m an agent','Represent owners and clients'],['manager','globe','I manage properties','Operate stays at scale'],['guest','search','I\'m renting','Find a verified place to stay']];
      var cards=roles.map(function(r){ var sel=(Onboard.role==='guest'? r[0]==='guest' : r[0]===Onboard.role)?' style="border-color:var(--orange);background:rgba(242,98,46,.07)"':'';
        return '<div class="lrow" data-role="'+r[0]+'"'+sel+'><div class="ico">'+icon(r[1])+'</div><div><div class="tt">'+r[2]+'</div><div class="ds">'+r[3]+'</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'; }).join('');
      html=wrap(brand+
        '<div class="card pad-lg">'+
        '<div class="eyebrow" style="margin-bottom:10px">Step 2 of 3 · Role</div>'+
        '<h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">How will you use InstaSpace?</h1>'+
        '<p class="muted" style="font-size:14px;margin-bottom:18px">Pick the closest fit. You can add another role later.</p>'+
        '<div class="list" style="margin-bottom:18px">'+cards+'</div>'+
        '<button class="btn btn-primary block" data-on="next">Continue '+icon('arrow')+'</button>'+
        '</div>');
    } else if(s===2){
      html=wrap(brand+
        '<div class="card pad-lg" id="kycCard">'+Onboard.kyc(0)+'</div>');
    }
    this.el.innerHTML=html; this.wire();
  },
  kyc:function(stage){
    // 0 intro, 1 doc, 2 liveness, 3 verifying, 4 active
    if(stage===0) return '<div class="eyebrow" style="margin-bottom:10px">Step 3 of 3 · InstaPass</div>'+
      '<h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">Get your InstaPass</h1>'+
      '<p class="muted" style="font-size:14px;margin-bottom:18px">One verified identity, accepted across every InstaSpace booking and payout. Takes about two minutes.</p>'+
      '<div class="banner info" style="margin-bottom:18px"><div class="bi">'+icon('lock')+'</div><div><div class="bt">Encrypted, used only to verify you</div><div class="bd">Never shared with hosts or guests.</div></div></div>'+
      '<button class="btn btn-primary block" data-kyc="1">Start verification '+icon('arrow')+'</button>';
    if(stage===1) return '<div class="eyebrow" style="margin-bottom:10px">InstaPass · Document</div>'+
      '<h1 style="font-size:23px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">Scan your ID</h1>'+
      '<p class="muted" style="font-size:14px;margin-bottom:16px">Passport, Emirates ID, or national ID. Lay it flat, fill the frame, hold steady.</p>'+
      '<div style="border:1.5px solid var(--cream-24);border-radius:14px;height:150px;position:relative;margin-bottom:16px;overflow:hidden;background:radial-gradient(120% 120% at 40% 0,#341a4e,#1c0c30)">'+
      '<div style="position:absolute;inset:14px;border:1.5px solid var(--orange);border-radius:10px;opacity:.45"></div>'+
      '<span class="scan-corner tl"></span><span class="scan-corner tr"></span><span class="scan-corner bl"></span><span class="scan-corner br"></span>'+
      '<div class="scan-ic">'+icon('doc','')+'</div>'+
      '<div class="scan-line"></div></div>'+
      '<button class="btn btn-primary block" data-kyc="2">Scan document</button>';
    if(stage===2) return '<div class="eyebrow" style="margin-bottom:10px">InstaPass · Liveness</div>'+
      '<h1 style="font-size:23px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px">Confirm it\'s you</h1>'+
      '<p class="muted" style="font-size:14px;margin-bottom:16px">Look at the camera and follow the prompt. This matches your face to your document.</p>'+
      '<div class="face-ring">'+icon('user','')+'</div>'+
      '<button class="btn btn-primary block" data-kyc="3">Start face check</button>';
    if(stage===3) return '<div id="kycWait">'+UI.aiBlock('Verifying your identity','Matching your document against the registry. Usually under a minute.')+'</div>';
    if(stage===4) return '<div class="center"><div class="ring" style="--p:100;margin:4px auto 16px;width:72px;height:72px">'+icon('shieldcheck','')+'</div>'+
      '<div class="eyebrow" style="margin-bottom:8px">InstaPass · Active</div>'+
      '<h1 style="font-size:24px;font-weight:800;letter-spacing:-.02em;margin-bottom:8px">InstaPass active</h1>'+
      '<p class="muted" style="font-size:14px;margin-bottom:20px">You\'re verified. Your pass now travels with every booking and message — no need to prove it again.</p>'+
      '<button class="btn btn-primary block" data-on="finish">Go to dashboard '+icon('arrow')+'</button></div>';
  },
  wire:function(){
    var self=this, el=this.el;
    el.querySelectorAll('[data-on]').forEach(function(b){ b.addEventListener('click', function(){
      var a=b.getAttribute('data-on');
      if(a==='next'){if(self.step===0&&window.EmailDB){var em=self.el.querySelector('input[type=email]');if(em&&em.value)EmailDB.add(em.value,'signup',self.role);} self.step++; self.render(); }
      else if(a==='login'){ self.el.remove(); self.el=null; Store.onboarded=true; Store.save(); App.enter(self.role); }
      else if(a==='finish'){ self.done(); }
    });});
    el.querySelectorAll('[data-role]').forEach(function(r){ r.addEventListener('click', function(){ self.role=r.getAttribute('data-role'); self.render(); }); });
    var card=el.querySelector('#kycCard');
    if(card){ card.querySelectorAll('[data-kyc]').forEach(function(b){ b.addEventListener('click', function(){
      var st=parseInt(b.getAttribute('data-kyc'),10); card.innerHTML=self.kyc(st);
      if(st===3){ var w=card.querySelector('#kycWait'); UI.delay(2200, function(){ card.innerHTML=self.kyc(4); self.wireKyc(card); }); }
      self.wireKyc(card);
    });});}
  },
  wireKyc:function(card){ var self=this;
    card.querySelectorAll('[data-kyc]').forEach(function(b){ b.addEventListener('click', function(){
      var st=parseInt(b.getAttribute('data-kyc'),10); card.innerHTML=self.kyc(st);
      if(st===3){ UI.delay(2200, function(){ card.innerHTML=self.kyc(4); self.wireKyc(card); }); }
      self.wireKyc(card);
    });});
    var fin=card.querySelector('[data-on="finish"]'); if(fin) fin.addEventListener('click', function(){ self.done(); });
  }
};
window.Onboard = Onboard;

/* =====================================================================
   VIEWS
   ===================================================================== */
var Views = window.Views || {};

/* ---------- HOME (role-aware dashboard) ---------- */
Views.home = function(){
  var role=Store.role, u=Store.user(), w=Store.wallet();
  if(role==='guest') return Views._guestHome(u,w);
  return Views._hostHome(u,w);
};
Views._hostHome=function(u,w){
  var bookings=Store.bookingState.filter(function(b){return b.side!=='guest';});
  var rows=bookings.map(function(b){ var p=Store.prop(b.prop); var st=b.status;
    var badge=st==='settled'?'<span class="badge ok"><span class="d"></span>Settled</span>':st==='escrow'?'<span class="badge ok"><span class="d"></span>In escrow</span>':'<span class="badge neutral"><span class="d"></span>Upcoming</span>';
    return '<div class="lrow" data-go="dispute-or-booking" data-id="'+b.id+'"><div class="ico">'+icon('calendar')+'</div><div><div class="tt">'+p.name+'</div><div class="ds">'+b.guest+' · '+b.from+'–'+b.to+'</div></div><div class="end">'+badge+'<span style="font-family:var(--mono);color:var(--cream-90);font-weight:700">'+money(b.total)+'</span></div></div>'; }).join('');
  return { title:'Home', sub:'Host dashboard', html:
    '<div class="page-head"><div class="eyebrow" style="margin-bottom:8px">Good morning, '+u.name.split(' ')[0]+'</div><h1>Your spaces, performing.</h1></div>'+
    '<div class="banner ok" style="margin-bottom:18px"><div class="bi">'+icon('shieldcheck')+'</div><div><div class="bt">3 properties verified</div><div class="bd">GovShield is current on every active listing. AI-Auditor cleared all condition checks.</div></div></div>'+
    '<div class="grid g-4" style="margin-bottom:8px">'+
      '<div class="stat"><div class="lab">This month</div><div class="big"><span class="u">AED</span>48.2k</div><div class="cap up">Net payout · +12%</div></div>'+
      '<div class="stat"><div class="lab">Occupancy</div><div class="big">82%</div><div class="cap up">+6 pts vs Q2</div></div>'+
      '<div class="stat"><div class="lab">Active listings</div><div class="big">3</div><div class="cap">All verified</div></div>'+
      '<div class="stat"><div class="lab">In escrow</div><div class="big"><span class="u">AED</span>'+fmt(w.escrow)+'</div><div class="cap">Releasing at check-in</div></div>'+
    '</div>'+
    '<div class="row wrap" style="gap:12px;margin:18px 0"><button class="btn btn-primary" data-go="addProperty">'+icon('plus')+'Add property</button>'+
      '<button class="btn btn-ghost" data-go="wallet">'+icon('wallet')+'Wallet</button>'+
      '<button class="btn btn-ghost" data-go="yield">'+icon('chart')+'AI-Yield</button></div>'+
    '<div class="grid g-3">'+
      modCard('yield','spark','AI-Yield','Raise your rate for Expo week','AED 540 → <span class="o" style="font-weight:700">720</span> for 14–20 Oct. Tap to review.','ok','Suggested')+
      modCard('govshield','shield','GovShield','All clear','3 of 3 listings compliant. Next renewal in 240 days.','ok','Compliant')+
      modCard('disputes','gavel','Disputes','1 case open','IS-4471 · awaiting guest response.','warn','Action')+
    '</div>'+
    '<div class="sec-title">Recent bookings<span class="more" data-go="properties">Manage</span></div>'+
    '<div class="list">'+rows+'</div>' };
};
Views._guestHome=function(u,w){
  var trip=Store.bookingState.filter(function(b){return b.side==='guest'&&b.status==='upcoming';})[0]
        || Store.bookingState.filter(function(b){return b.side==='guest';})[0];
  var p=trip?Store.prop(trip.prop):null;
  var saved=Store.saved.length;
  return { title:'Home', sub:'Guest', html:
    '<div class="page-head"><div class="eyebrow" style="margin-bottom:8px">Welcome back, '+u.name.split(' ')[0]+'</div><h1>Find a verified place to stay.</h1></div>'+
    '<div class="row wrap" style="gap:12px;margin-bottom:18px"><button class="btn btn-primary" data-go="browse">'+icon('search')+'Browse properties</button>'+
      '<button class="btn btn-ghost" data-go="trips">'+icon('trips')+'My trips</button>'+
      '<button class="btn btn-ghost" data-go="wallet">'+icon('wallet')+'Wallet</button></div>'+
    (p? '<div class="sec-title">Upcoming stay</div><div class="card" data-go="listing" data-id="'+p.id+'" style="cursor:pointer;display:flex;gap:16px;align-items:center"><div style="width:84px;height:84px;border-radius:12px;flex:none;background:radial-gradient(120% 120% at 30% 0,#3a1a54,#1c0c30)"></div><div style="flex:1"><div style="font-size:16px;font-weight:800">'+p.name+'</div><div class="muted" style="font-size:13px;margin-top:4px">'+p.city+' · '+trip.from+'–'+trip.to+' · '+trip.guests+' guests</div><div style="margin-top:8px"><span class="badge ok"><span class="d"></span>Protected by InstaSpace</span></div></div><span class="chev" style="color:var(--cream-24)">'+icon('chev')+'</span></div>' : '')+
    '<div class="grid g-2" style="margin-top:18px">'+
      '<div class="stat"><div class="lab">Wallet</div><div class="big"><span class="u">AED</span>'+fmt(w.balance)+'</div><div class="cap">'+(w.escrow?money(w.escrow)+' held in escrow':'Available')+'</div></div>'+
      '<div class="stat" data-go="browse" style="cursor:pointer"><div class="lab">Saved</div><div class="big">'+saved+'</div><div class="cap">'+(saved?'Tap to revisit':'Save places you like')+'</div></div>'+
    '</div>'+
    '<div class="sec-title">Verified near you<span class="more" data-go="browse">See all</span></div>'+
    '<div class="grid g-3">'+Store.data.properties.slice(0,3).map(propCard).join('')+'</div>' };
};

/* shared property card */
function propCard(p){
  var saved=Store.saved.indexOf(p.id)>-1;
  return '<div class="prop" data-go="listing" data-id="'+p.id+'">'+
    '<div class="img '+(p.img||'')+'">'+(p.verified&&Store.tweaks.badges?'<span class="vbadge"><span class="d"></span>Verified</span>':'')+
      '<div class="save'+(saved?' on':'')+'" data-save="'+p.id+'">'+icon('heart')+'</div>'+
      '<span class="cat">'+p.cat+'</span></div>'+
    '<div class="info"><div class="t"><span class="nm">'+p.name+'</span><span class="pr">'+money(p.price,'AED')+'<small>/night</small></span></div>'+
    '<div class="meta">'+p.city+' · '+UI.stars(Math.round(p.rating))+' '+p.rating+'</div></div></div>';
}
window.propCard = propCard;

/* ---------- ACCOUNT ---------- */
Views.account=function(){
  var u=Store.user();
  var item=function(ic,t,d,go){ return '<div class="lrow"'+(go?' data-go="'+go+'"':'')+'><div class="ico">'+icon(ic)+'</div><div><div class="tt">'+t+'</div><div class="ds">'+d+'</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'; };
  return { title:'Account', sub:u.role, html:
    '<div class="card pad-lg" style="display:flex;gap:18px;align-items:center;margin-bottom:18px">'+
      '<div style="width:62px;height:62px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-weight:800;color:#2A1240;font-size:22px;flex:none">'+u.initials+'</div>'+
      '<div style="flex:1"><div style="font-size:20px;font-weight:800">'+u.name+'</div><div class="row center" style="gap:8px;margin-top:6px"><span class="badge ok"><span class="d"></span>InstaPass · Verified</span><span class="muted" style="font-size:12.5px">'+u.kyc+' · '+u.city+'</span></div></div>'+
      '<button class="btn btn-ghost sm" data-go="instapass">View pass</button></div>'+
    '<div class="sec-sub">Identity &amp; trust</div><div class="list" style="margin-bottom:6px">'+
      item('shieldcheck','InstaPass','Verified identity · '+u.kyc,'instapass')+
      item('shield','GovShield compliance','Documents and listing standing','govshield')+'</div>'+
    '<div class="sec-sub">Money</div><div class="list" style="margin-bottom:6px">'+
      item('wallet','InstaWallet','Balance, escrow and conversions','wallet')+
      item('receipt','Payment methods','Cards and payout accounts')+'</div>'+
    '<div class="sec-sub">Preferences</div><div class="list" style="margin-bottom:6px">'+
      item('settings','Settings','Notifications, language, theme','settings')+
      item('help','Help &amp; support','Guides and live chat','help')+'</div>'+
    '<div class="list">'+
      '<div class="lrow" data-roleswap="1"><div class="ico">'+icon('swap')+'</div><div><div class="tt">Switch to '+(Store.role==='host'?'guest':'host')+' view</div><div class="ds">See the other side of InstaSpace</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'+
      '<div class="lrow" data-logout="1"><div class="ico" style="color:#FF5C82">'+icon('logout')+'</div><div><div class="tt" style="color:#FF5C82">Log out</div><div class="ds">Return to the landing screen</div></div></div></div>' };
};

/* ---------- SETTINGS ---------- */
Views.settings=function(){
  var t=Store.tweaks;
  var toggleRow=function(k,t1,d,on){ return '<div class="lrow" style="cursor:default"><div><div class="tt">'+t1+'</div><div class="ds">'+d+'</div></div><div class="end"><div class="toggle'+(on?' on':'')+'" data-set="'+k+'"></div></div></div>'; };
  return { title:'Settings', sub:'Preferences', html:
    '<div class="page-head"><h1>Settings</h1></div>'+
    '<div class="sec-sub">Notifications</div><div class="list" style="margin-bottom:6px">'+
      toggleRow('n_book','Booking activity','New requests, confirmations, check-ins',true)+
      toggleRow('n_money','Settlements &amp; payouts','When escrow releases to your wallet',true)+
      toggleRow('n_compliance','Compliance alerts','GovShield renewals and holds',true)+'</div>'+
    '<div class="sec-sub">App</div><div class="list" style="margin-bottom:6px">'+
      '<div class="lrow" style="cursor:default"><div><div class="tt">Currency display</div><div class="ds">Shown across wallet and listings</div></div><div class="end"><div class="seg"><button class="'+(t.currency==='AED'?'on':'')+'" data-cur="AED">AED</button><button class="'+(t.currency==='GBP'?'on':'')+'" data-cur="GBP">GBP</button></div></div></div>'+
      toggleRow('motion','Reduce motion','Calmer transitions and loaders',!t.motion?true:false)+'</div>'+
    '<div class="sec-sub">Account</div><div class="list">'+
      '<div class="lrow"><div><div class="tt">Change password</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'+
      '<div class="lrow" data-logout="1"><div><div class="tt" style="color:#FF5C82">Delete account</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div></div>',
    mount:function(root){
      root.querySelectorAll('[data-set]').forEach(function(t1){ t1.addEventListener('click',function(){ t1.classList.toggle('on'); toast('Preference updated'); }); });
      root.querySelectorAll('[data-cur]').forEach(function(b){ b.addEventListener('click',function(){ Store.tweaks.currency=b.getAttribute('data-cur'); Store.save(); App.go('settings'); toast('Currency set to '+Store.tweaks.currency); }); });
    } };
};

/* ---------- HELP ---------- */
Views.help=function(){
  var faq=[['How does instant settlement work?','Funds release from escrow the moment AI-Auditor verifies your guest\'s check-in.'],
    ['What does GovShield verify?','Your legal right to lease — tenancy authorisation, trade licence, or industrial permit by category.'],
    ['How is a dispute decided?','Both sides submit evidence; the adjudicator rules on the facts and settles from the deposit.'],
    ['What FX rate does InstaWallet use?','A 1.5% margin — versus the 6.4% the corridor typically charges.']];
  return { title:'Help &amp; support', sub:'We\'re here', html:
    '<div class="page-head"><h1>How can we help?</h1><p>Search guides, or reach a person when it matters.</p></div>'+
    '<div class="wa-search" style="max-width:none;margin-bottom:18px">'+icon('search')+'Search help articles</div>'+
    '<div class="row wrap" style="gap:12px;margin-bottom:22px"><button class="btn btn-primary" data-chat="1">'+icon('message')+'Contact support</button><button class="btn btn-ghost">Start live chat</button></div>'+
    '<div class="sec-sub">Popular questions</div><div class="list">'+faq.map(function(f){ return '<div class="lrow" data-faq="'+UI.esc(f[1])+'"><div class="ico">'+icon('help')+'</div><div><div class="tt">'+f[0]+'</div></div><div class="end"><span class="chev">'+icon('chev')+'</span></div></div>'; }).join('')+'</div>',
    mount:function(root){
      root.querySelectorAll('[data-faq]').forEach(function(r){ r.addEventListener('click',function(){ UI.modal('<div class="mhead"><h3>'+r.querySelector('.tt').textContent+'</h3><div class="x" data-x>'+icon('x')+'</div></div><div class="mbody"><p class="muted" style="font-size:14.5px;line-height:1.6">'+r.getAttribute('data-faq')+'</p><button class="btn btn-ghost block" data-x style="margin-top:18px">Got it</button></div>',{onMount:function(m){ m.querySelectorAll('[data-x]').forEach(function(x){x.addEventListener('click',UI.closeModal);}); }}); }); });
      var c=root.querySelector('[data-chat]'); if(c) c.addEventListener('click',function(){ toast('Support request sent — we\'ll reply shortly'); });
    } };
};

/* ---------- INSTAPASS ---------- */
Views.instapass=function(){
  var u=Store.user();
  return { title:'InstaPass', sub:'Verified identity', html:
    '<div class="page-head"><h1>Your InstaPass</h1><p>Verified once, carried into every booking, message, and payout.</p></div>'+
    '<div style="max-width:420px">'+
    '<div style="border-radius:18px;padding:22px;position:relative;overflow:hidden;background:linear-gradient(150deg,#3a1a54,#1c0c30 80%);border:1px solid var(--cream-24);box-shadow:0 22px 44px -24px rgba(0,0,0,.8)">'+
      '<div class="row between center" style="margin-bottom:30px"><span class="wm" style="font-size:18px">Insta<span class="sp">Space</span></span><span class="eyebrow" style="color:var(--orange);border:1px solid rgba(242,98,46,.5);border-radius:999px;padding:4px 10px">InstaPass</span></div>'+
      '<div style="font-size:24px;font-weight:800;letter-spacing:-.01em;margin-bottom:18px">'+u.name+'</div>'+
      '<div class="row" style="gap:30px;margin-bottom:18px"><div><div class="eyebrow" style="margin-bottom:5px">Status</div><div class="o" style="font-weight:800">Verified</div></div><div><div class="eyebrow" style="margin-bottom:5px">KYC level</div><div style="font-weight:700">'+u.kyc+'</div></div><div><div class="eyebrow" style="margin-bottom:5px">Holder since</div><div style="font-weight:700">'+u.since+'</div></div></div>'+
      '<div class="row center" style="gap:8px;border-top:1px solid var(--cream-14);padding-top:14px;font-size:11.5px;color:var(--cream-56)"><span style="width:6px;height:6px;border-radius:50%;background:var(--orange);box-shadow:0 0 0 3px rgba(242,98,46,.2)"></span>Active · travels with every booking</div>'+
    '</div>'+
    '<div class="banner info" style="margin-top:18px"><div class="bi">'+icon('lock')+'</div><div><div class="bt">Your data is yours</div><div class="bd">Used only to verify you. Never shared with hosts or guests.</div></div></div>'+
    '</div>' };
};

window.Views = Views;
})();
