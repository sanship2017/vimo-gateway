```javascript
VimoLib.setConfig({
 authenKey: "",
 merchantId: "",
 encriptionKey: "",
 userid: ""
});

VimoLib.sendUserLinked({
 mobile: "",
 order_code: "VM01-"+uuid()
}, (err, data) => {
});

VimoLib.ActiveUserLinked({
 mobile: "",
 order_code: "VM01-"+uuid(),
 linked_id: '',
 otp: ''
}, (err, data) => {
});

VimoLib.RequestCharging({
 mobile: "",
 order_code: "VM01-"+uuid(),
 token_id: '',
 amount: 100000
}, (err, data) => {
});

VimoLib.VerifyOTP({
 order_code: "VM01-"+uuid(),
 token_id: '',
 token_opt_code: '',
 otp: ''
}, (err, data) => {
});

VimoLib.GetBalanceUserLinked({
  'token_id': ''
}, (err, result) => {
});

VimoLib.Unlinked({
  'token_id': ''
}, (err, result) => {
});
```
