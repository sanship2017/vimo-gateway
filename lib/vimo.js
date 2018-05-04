const Joi = require('joi');
const uuid = require('uuid/v4');
const async = require('async');
const rp = require('request-promise');
const CryptoJS = require('crypto-js')
const utilHelper = require('./util');
const request = require('request');
const CODE = require('./code');

const ROOT_URL = 'http://sandbox.vimo.vn/checkout_api/payment/v2/checkout.php';

class Vimo {
	constructor() {
		this.config = {}
	}

	setConfig(options) {
		const result = Joi.validate(options, utilHelper.configTemplate, {allowUnknown: true, convert: false});
		if(result.error) {
			throw result.error;
		}

		this.config = options;
	}

	checkConfig() {
		if(Object.keys(this.config).length === 0) {
			throw new Error(`Not config yet`);
		}
	}

	sendUserLinked(options, cb) {
		this.checkConfig();

		const fnc = 'SendUserLinked';
		const type = '';
		options.order_code = options.order_code ||  utilHelper.generateOrderCode();

		const data = utilHelper.encryptData({
			order_code: options.order_code,
			mobile: options.mobile
		}, this.config.encriptionKey);

		const checksum = utilHelper.generateChecksum([fnc, this.config.merchantId, this.config.userid, type, data, this.config.authenKey]);

		this.makeRequest(options.order_code, {
			fnc,
			data,
			type,
			checksum
		}, cb)
	}

	ActiveUserLinked(options, cb) {
		this.checkConfig();

		const type = '';
		const fnc = 'ActiveUserLinked';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.activeUserLinkedTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					message: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			data = utilHelper.encryptData({
				order_code: options.order_code,
				mobile: options.mobile,
				linked_id: options.linked_id,
				otp: options.otp
			}, this.config.encriptionKey);

			checksum = utilHelper.generateChecksum([fnc, this.config.merchantId, this.config.userid, type, data, this.config.authenKey]);

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data,
				'checksum': checksum
			}, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	RequestCharging(options, cb) {
		this.checkConfig();

		const type = '';
		const fnc = 'RequestCharging';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.requestChargingTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					message: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			data = utilHelper.encryptData({
				order_code: options.order_code,
				amount: options.amount,
				token_id: options.token_id
			}, this.config.encriptionKey);

			checksum = utilHelper.generateChecksum([fnc, this.config.merchantId, this.config.userid, type, data, this.config.authenKey]);

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data,
				'checksum': checksum
			}, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	VerifyOTP(options, cb) {
		this.checkConfig();

		const type = '';
		const fnc = 'VerifyOTP';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.verifyOTPTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					message: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			data = utilHelper.encryptData({
				order_code: options.order_code,
				token_id: options.token_id,
				token_opt_code: options.token_opt_code,
				otp: options.otp
			}, this.config.encriptionKey);

			checksum = utilHelper.generateChecksum([fnc, this.config.merchantId, this.config.userid, type, data, this.config.authenKey]);

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data,
				'checksum': checksum
			}, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	CreateWithdrawal(options, cb) {
		this.checkConfig();

		const type = 1;
		const fnc = 'CreateWithdrawal';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.createWithdrawalTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					message: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			options.description = options.description || '';
			next();
		}

		const processHandle = (next) => {
			data = utilHelper.encryptData({
				order_code: options.order_code,
				mobile: options.mobile,
				amount: options.amount,
				description: options.description
			}, this.config.encriptionKey);

			checksum = utilHelper.generateChecksum([fnc, this.config.merchantId, this.config.userid, type, data, this.config.authenKey]);

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data,
				'checksum': checksum
			}, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	makeRequest(order_code, params, cb) {
		params.mid = this.config.merchantId;
		params.uid = this.config.userid;

		const options = {
			method: 'POST',
			uri: ROOT_URL,
			form: params
		}

		rp(options)
			.then((body) => {
				try {
					body = JSON.parse(body);
					const data = {
						code: CODE.FAIL,
            params,
            order_code,
						res: body
					}

					if(body.error_code === '00') {
						data.code = CODE.SUCCESS
					}

					cb(null, data);
				} catch (err) {
					cb({
            code: CODE.SYSTEM_ERROR,
            params,
            order_code,
            err
          });
				}
			})
			.catch((err) => {
				cb({
          code: CODE.SYSTEM_ERROR,
          params,
          order_code,
          err
        });
			})
	}
}

module.exports = new Vimo