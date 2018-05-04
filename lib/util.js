const Joi = require('joi');
const CryptoJS = require('crypto-js')
const crypto = require('crypto');
const Base64 = require('crypto-js/enc-base64')
module.exports = {
  configTemplate: {
    authenKey: Joi.string().required(),
    merchantId: Joi.string().required(),
    encriptionKey: Joi.string().required(),
    userid: Joi.string().required()
  },
  createWithdrawalTemplate: {
    order_code: Joi.string().max(50),
    amount: Joi.number().min(100000).required(),
    mobile: Joi.string().required(),
    description: Joi.string().max(255)
  },
  activeUserLinkedTemplate: {
    order_code: Joi.string().max(50),
    mobile: Joi.string().required(),
    linked_id: Joi.string().required(),
    otp: Joi.string().required()
  },
  requestChargingTemplate: {
    token_id: Joi.string().required(),
    order_code: Joi.string().max(50),
    amount: Joi.number().max(20000000).required(),
  },
  verifyOTPTemplate: {
    token_id: Joi.string().required(),
    order_code: Joi.string().max(50),
    token_opt_code: Joi.string().required(),
    otp: Joi.string().required()
  },
  encryptData: (data, key) => {
    let dataString = JSON.stringify(data).trim();
    const keyUsed = CryptoJS.MD5(key).toString().substr(0, 24);

    return CryptoJS.TripleDES.encrypt(dataString,  CryptoJS.enc.Utf8.parse(keyUsed), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString();
  },
  generateChecksum: (values) => {
    let stringToHash = '';
    values.forEach((value) => {
      stringToHash += value;
    });
    return CryptoJS.MD5(stringToHash).toString();
  },
  generateOrderCode: () => {
    return "VM01-"+uuid();
  }
}