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
		const result = Joi.validate(options, utilHelper.configTemplate, {allowUnknown: true, convert: true});
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

		const data = {
			order_code: options.order_code,
			mobile: options.mobile
		};

		this.makeRequest(options.order_code, {
			fnc,
			data,
			type
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
			data = {
				order_code: options.order_code,
				mobile: options.mobile,
				linked_id: options.linked_id,
				otp: options.otp
			};

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
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
			data = {
				order_code: options.order_code,
				amount: options.amount,
				token_id: options.token_id
			};

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
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
			data = {
				order_code: options.order_code,
				token_id: options.token_id,
				token_opt_code: options.token_opt_code,
				otp: options.otp
			};

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
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
			data = {
				order_code: options.order_code,
				mobile: options.mobile,
				amount: options.amount,
				description: options.description
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
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
		let paramsClone = Object.assign({}, params);

		paramsClone.mid = this.config.merchantId;
		paramsClone.uid = this.config.userid;
		paramsClone.data = utilHelper.encryptData(paramsClone.data, this.config.encriptionKey);
		paramsClone.checksum = utilHelper.generateChecksum([paramsClone.fnc, this.config.merchantId, this.config.userid, paramsClone.type, paramsClone.data, this.config.authenKey]);

		const options = {
			method: 'POST',
			uri: ROOT_URL,
			form: paramsClone
		}

		rp(options)
			.then((body) => {
				try {
					body = JSON.parse(body);
					const data = {
						code: CODE.FAIL,
            params,
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
            err
          });
				}
			})
			.catch((err) => {
				cb({
          code: CODE.SYSTEM_ERROR,
          params,
          err
        });
			})
	}
}

module.exports = new Vimo
