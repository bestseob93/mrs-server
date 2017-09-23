'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
const bloodTypes = ['A', 'B', 'AB', 'O'];

const Patient = new Schema({
	patientName: { type: String, required: true },
	gender: { type: String, required: true },
	patientTel: { type: String, required: true },
	birth: { type: String, required: true },
	address: { type: String, required: true },
	bloodType: { type: String, enum: bloodTypes },
	chargeDoctor: { type: Schema.Types.ObjectId, ref: 'doctor' },
	bed: { type: Schema.Types.ObjectId, ref: 'bed' },
	disease: String,
	date: {
		Admission: { type: Date, default: Date.now }
	},
	patientBarcode: String,
	recordFiles: [{
		recordedTime: { type: Date, default: Date.now },
		doctorName: { type: String },
		fileName: { type: String }
	}],
	care: [{ type: Schema.Types.ObjectId, ref: 'medicalcare' }]
});

exports.default = _mongoose2.default.model('patient', Patient);
// 환자 정보
// name : String
// birth : String
// address : String
// bloodType : String
// chargeDoctor : String
// bed : String
// room : String
// disease : String
// Date : Date
// barcordID : String
// recordFile : [String]
// Drug : String