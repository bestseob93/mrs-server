'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

const Bed = new Schema({
  beduuid: { type: String, required: true },
  isChecked: { type: Boolean }
});

exports.default = _mongoose2.default.model('bed', Bed);