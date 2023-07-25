const Joi = require('joi');
const uuid = require('uuid/v4');
const async = require('async');
const rp = require('request-promise');
const CryptoJS = require('crypto-js')
const utilHelper = require('./util');
const request = require('request');
const CODE = require('./code');
const MESSAGE = require('./message');


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

	checkConfig(config) {
		if(Object.keys(config).length === 0) {
			throw new Error(`Not config yet`);
		}
	}

	CheckActiveUser(options, config, cb) {
		this.checkConfig(config);

		const type = '';
		const fnc = 'CheckActiveUser';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.checkActiveUserTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
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
				mobile: options.mobile
			};

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
			}, config, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	sendUserLinked(options,config, cb) {
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
		},config, cb)
	}

	ActiveUserLinked(options,config, cb) {
		this.checkConfig(config);

		const type = '';
		const fnc = 'ActiveUserLinked';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.activeUserLinkedTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
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
			},config, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	RequestCharging(options,config, cb) {
		this.checkConfig(config);

		const type = '';
		const fnc = 'RequestCharging';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.requestChargingTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
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
			},config, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	VerifyOTP(options,config, cb) {
		this.checkConfig(config);

		const type = '';
		const fnc = 'VerifyOTP';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.verifyOTPTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
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
			}, config, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	CreateWithdrawal(options,config, cb) {
		this.checkConfig(config);

		const type = 1;
		const fnc = 'CreateWithdrawal';
		let data;
		let checksum;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.createWithdrawalTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: {
						type: type,
						fnc: fnc,
						data: options
					},
					err: result.error
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
			}, config,next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	GetBalanceUserLinked(options,config, cb) {
		const fnc = 'GetBalanceUserLinked';
		const type = '';

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.getBalanceUserLinkedTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			const data = {
				order_code: options.order_code,
				token_id: options.token_id
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
			}, config,next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	GetBalance(options,config, cb) {
		const fnc = 'GetBalance';


		const processHandle = (next) => {
			const data = {
				order_code: options.order_code
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'data': data
			}, config,next);
		}

		async.waterfall([
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	Unlinked(options,config, cb) {
		const fnc = 'UnLinkUser';
		const type = '';

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.unlinkedemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			const data = {
				order_code: options.order_code,
				token_id: options.token_id
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
			},config, next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	CreateVimoCheckout(options,config, cb) {
		const fnc = 'CreateVimoCheckout';
		const type = 1;

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.createVimoCheckoutTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
				});
			}

			next();
		}

		const standardizeInput = (next) => {
			options.order_code = options.order_code || utilHelper.generateOrderCode();
			next();
		}

		const processHandle = (next) => {
			const data = {
				order_code: options.order_code,
				amount: options.amount,
				payer_fullname: options.payer_fullname,
				payer_email: options.payer_email,
				payer_mobile: options.payer_mobile,
				bank_id: '',
				return_url: options.return_url,
				description: options.description
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
			}, config,next);
		}

		async.waterfall([
			checkParams,
			standardizeInput,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	CheckTransactionByToken(options,config, cb) {
		const fnc = 'CheckTransactionByToken';
		const type = '';

		const checkParams = (next) => {
			const result = Joi.validate(options, utilHelper.checkTransactionByTokenTemplate, {allowUnknown: true, convert: true});
			if(result.error) {
				return next({
					code: CODE.WRONG_PARAMS,
					params: options,
					err: result.error
				});
			}

			next();
		}

		const processHandle = (next) => {
			const data = {
				token_code: options.token_code
			}

			this.makeRequest(options.order_code, {
				'fnc': fnc,
				'type': type,
				'data': data
			},config, next);
		}

		async.waterfall([
			checkParams,
			processHandle
		], (err, data) => {
			cb(err, data);
		});
	}

	makeRequest(order_code, params, config, cb) {
		let paramsClone = Object.assign({}, params);

		paramsClone.mid = config.merchantId;
		paramsClone.uid = config.userid;
		paramsClone.data = utilHelper.encryptData(paramsClone.data, config.encriptionKey);
		paramsClone.checksum = utilHelper.generateChecksum([paramsClone.fnc, config.merchantId, config.userid, paramsClone.type, paramsClone.data, config.authenKey]);

		const options = {
			method: 'POST',
			uri: config.url,
			form: paramsClone
		}

		rp(options)
			.then((body) => {
				try {
					body = JSON.parse(body);
					body.error_description = MESSAGE[body.error_code] || body.error_description;

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
