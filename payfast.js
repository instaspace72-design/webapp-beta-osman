/* ============================================================
   InstaSpace — PayFast (Pakistan) payment gateway integration
   ------------------------------------------------------------
   PayFast by APPS (payfast.pk) two-step hosted checkout:
     1. SERVER  → GET access token  (MERCHANT_ID + SECURED_KEY + BASKET_ID + TXNAMT)
     2. CLIENT  → POST form to PayFast hosted checkout with the token
     3. PayFast → redirects to SUCCESS_URL / FAILURE_URL
     4. SERVER  → validates the returned signature / queries txn status

   This file ships a WORKING SANDBOX SIMULATION so the prototype runs
   end to end with no backend, plus the PRODUCTION code path (guarded by
   PayFast.CONFIG.mode) and inline notes for the developer. See
   docs/PAYFAST_INTEGRATION.md for the full server contract.
   ============================================================ */
(function(){
'use strict';

var CONFIG = {
  mode: 'sandbox',                      // 'sandbox' (simulated) | 'live' (real form POST)
  merchantId: '__PAYFAST_MERCHANT_ID__',     // set on the SERVER, never hard-code in prod
  merchantName: 'InstaSpace',
  securedKey: '__PAYFAST_SECURED_KEY__',     // SERVER-ONLY secret — never exposed to client
  // endpoints (UAT = sandbox, IPG1 = production)
  endpoints: {
    sandbox: {
      token: 'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
      post:  'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction'
    },
    live: {
      token: 'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
      post:  'https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction'
    }
  },
  currency: 'PKR',
  // your deployed callback routes (handled by the backend, see docs)
  returnUrl:  '/payments/payfast/return',
  cancelUrl:  '/payments/payfast/cancel',
  // backend route that returns { ACCESS_TOKEN } for a basket (keeps SECURED_KEY server-side)
  tokenProxy: '/api/payfast/token'
};

var ICON = UI && UI.icon ? UI.icon : function(){return '';};

/* Format a PKR amount for display (gateway settles in PKR). */
function pkr(n){ return 'PKR ' + (Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

/* Convert a display amount (any currency) to a PKR figure for the gateway.
   Demo rates only — production should price in PKR or use a live FX quote. */
var FX_TO_PKR = { PKR:1, USD:278, AED:76, GBP:355, EUR:300, SAR:74, TRY:8.6, AZN:163 };
function toPKR(amount, cur){ return Math.round(amount * (FX_TO_PKR[cur] || 1)); }

/* ---------------------------------------------------------------
   PUBLIC: PayFast.checkout(order)
   order = { amount, currency, basketId, description, customer:{name,email,mobile},
             onSuccess(txn), onCancel() }
   --------------------------------------------------------------- */
function checkout(order){
  order = order || {};
  var amountPKR = toPKR(order.amount || 0, order.currency || 'PKR');
  var basketId = order.basketId || ('IS-' + Date.now());

  if(CONFIG.mode === 'live'){ return liveCheckout(order, amountPKR, basketId); }
  return sandboxCheckout(order, amountPKR, basketId);
}

/* ---------------- SANDBOX (simulated hosted checkout) ---------------- */
function sandboxCheckout(order, amountPKR, basketId){
  var paid = false;
  var m = UI.modal(
    '<div class="pf-gw">'+
      '<div class="pf-top"><span class="pf-logo">Pay<b>Fast</b></span><span class="pf-secure">'+ICON('lock')+' Secure checkout</span></div>'+
      '<div class="pf-body">'+
        '<div class="pf-amt"><span class="pf-amt-lab">Amount due</span><span class="pf-amt-val">'+pkr(amountPKR)+'</span></div>'+
        '<div class="pf-merchant">'+CONFIG.merchantName+' · Basket '+basketId+'</div>'+
        '<div class="pf-sub">'+(order.description||'InstaSpace payment')+'</div>'+
        '<div class="pf-methods">'+
          '<button class="pf-method on" data-pm="wallet">PayFast Wallet</button>'+
          '<button class="pf-method" data-pm="card">Debit / Credit card</button>'+
          '<button class="pf-method" data-pm="bank">Bank account</button>'+
        '</div>'+
        '<div class="pf-note">Sandbox mode · no real charge. In production this is the PayFast hosted page; InstaSpace never sees card data.</div>'+
        '<button class="btn btn-primary block lg" data-pf-pay style="background:#1fa463;color:#fff;box-shadow:0 10px 26px -12px rgba(31,164,99,.6)">'+ICON('lock')+'Pay '+pkr(amountPKR)+'</button>'+
        '<button class="btn btn-text block" data-pf-cancel>Cancel and go back</button>'+
      '</div>'+
    '</div>',
    { onMount:function(node){
      node.querySelectorAll('[data-pm]').forEach(function(b){ b.addEventListener('click',function(){
        node.querySelectorAll('[data-pm]').forEach(function(x){x.classList.remove('on');}); b.classList.add('on'); }); });
      node.querySelector('[data-pf-cancel]').addEventListener('click',function(){ UI.closeModal(); if(order.onCancel) order.onCancel(); });
      node.querySelector('[data-pf-pay]').addEventListener('click',function(){
        var body = node.querySelector('.pf-body');
        body.innerHTML = UI.aiBlock('Processing with PayFast', 'Confirming the payment and returning you to InstaSpace.');
        UI.delay(1900, function(){
          paid = true;
          var txn = { ok:true, transactionId:'PF'+Math.floor(Math.random()*1e8), basketId:basketId, amount:amountPKR, currency:'PKR', method:'payfast' };
          UI.closeModal();
          if(UI.toast) UI.toast('PayFast payment approved');
          if(order.onSuccess) order.onSuccess(txn);
        });
      });
    }}
  );
  return m;
}

/* ---------------- LIVE (production hosted checkout) ----------------
   Requires a backend. The browser must NOT hold the SECURED_KEY, so we
   ask our own server (CONFIG.tokenProxy) for an ACCESS_TOKEN, then auto
   submit a form POST to PayFast's hosted page. PayFast then redirects the
   browser to CONFIG.returnUrl, which the backend validates. */
function liveCheckout(order, amountPKR, basketId){
  var ep = CONFIG.endpoints.live;
  return fetch(CONFIG.tokenProxy, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ basketId: basketId, amount: amountPKR })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    var token = data.ACCESS_TOKEN || data.token;
    if(!token) throw new Error('No access token from server');
    var fields = {
      MERCHANT_ID: data.MERCHANT_ID,            // returned by server, not hard-coded here
      MERCHANT_NAME: CONFIG.merchantName,
      TOKEN: token,
      PROCCODE: '00',
      TXNAMT: amountPKR,
      CUSTOMER_MOBILE_NO: (order.customer&&order.customer.mobile) || '',
      CUSTOMER_EMAIL_ADDRESS: (order.customer&&order.customer.email) || '',
      SIGNATURE: data.SIGNATURE || '',          // computed server-side
      VERSION: 'MERCHANT-CART-0.1',
      TXNDESC: order.description || 'InstaSpace booking',
      SUCCESS_URL: window.location.origin + CONFIG.returnUrl,
      FAILURE_URL: window.location.origin + CONFIG.cancelUrl,
      BASKET_ID: basketId,
      ORDER_DATE: new Date().toISOString(),
      CHECKOUT_URL: window.location.origin + CONFIG.returnUrl,
      CURRENCY_CODE: CONFIG.currency
    };
    var form = document.createElement('form');
    form.method = 'POST'; form.action = ep.post;
    Object.keys(fields).forEach(function(k){
      var i = document.createElement('input'); i.type='hidden'; i.name=k; i.value=fields[k]; form.appendChild(i);
    });
    document.body.appendChild(form); form.submit();   // browser redirects to PayFast
  })
  .catch(function(err){
    if(UI.toast) UI.toast('Could not reach PayFast. Please try again.');
    console.error('[payfast] live checkout failed:', err);
    if(order.onCancel) order.onCancel(err);
  });
}

window.PayFast = { CONFIG:CONFIG, checkout:checkout, pkr:pkr, toPKR:toPKR };
})();
