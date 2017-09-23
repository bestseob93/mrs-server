'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

const Medicalcare = new Schema({
	medicalType: String,
	drug: {
		drugName: String,
		drugImageUrl: String,
		drugCompany: String,
		drugCompanyInfo: String,
		insuranceCode: String,
		drugShape: String,
		drugIngrident: String,
		drugSave: String,
		drugEffect: String,
		drugAmount: String,
		drugCaution: String,
		drugBarcode: String
	},
	inject: {
		injectName: String,
		injectAmount: String,
		injectBarcode: String
	},
	medicalInfo: String,
	date: {
		edited: { type: Date, default: Date.now }
	}
});

exports.default = _mongoose2.default.model('medicalcare', Medicalcare);
// 약 정보

// drugName : String
// drugBacord : String
// drugImageUrl : String