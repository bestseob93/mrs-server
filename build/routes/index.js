'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _upload = require('./upload');

var _upload2 = _interopRequireDefault(_upload);

var _barcode = require('./barcode');

var _barcode2 = _interopRequireDefault(_barcode);

var _medicalcare = require('./medicalcare');

var _medicalcare2 = _interopRequireDefault(_medicalcare);

var _doctor = require('./doctor');

var _doctor2 = _interopRequireDefault(_doctor);

var _patient = require('./patient');

var _patient2 = _interopRequireDefault(_patient);

var _bed = require('./bed');

var _bed2 = _interopRequireDefault(_bed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.use('/upload', _upload2.default);
router.use('/barcode', _barcode2.default);
router.use('/doctor', _doctor2.default);
router.use('/medicalcare', _medicalcare2.default);
router.use('/patient', _patient2.default);
router.use('/bed', _bed2.default);

exports.default = router;