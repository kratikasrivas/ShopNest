const paypal=require('paypal-rest-sdk');
paypal.configure({
    mode: "sandbox",
    client_id:"AdlNr_L_VIY92uoha-xmq4KpjGPmbXbCk9FC_FTJh2SAFWcm_P-Fg6O5iIyLeF9nwHruZ4IpS0KtgDAY",
    client_secret:"EFHWzYq9BmlHozVy5pDGJORsrt3UIQsHgRSL3Z-qjERSZm9YejXgIC5C2XPXxv3tMxvoXvRMGxNl2dsC",
})
module.exports=paypal;