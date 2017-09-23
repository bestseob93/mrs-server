'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

const Doctor = new Schema({
	job: { type: String, required: true },
	doctorName: { type: String, required: true },
	doctorFace: String,
	doctorPersonId: String,
	birth: { type: String, required: true },
	department: { type: String, required: true },
	doctorBarcode: String
});

exports.default = _mongoose2.default.model('doctor', Doctor);