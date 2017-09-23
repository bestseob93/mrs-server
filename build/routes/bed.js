'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bed = require('../models/bed');

var _bed2 = _interopRequireDefault(_bed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.post('/', (req, res, next) => {
	console.log(req.body.beduuid);
	console.log(typeof req.body.beduuid);
	if (req.body.beduuid === '' || typeof req.body.beduuid !== 'string') {
		return res.status(422).json({
			error: "beduuid is undefined",
			code: 0
		});
	}

	let bed = new _bed2.default({
		beduuid: req.body.beduuid,
		isChecked: false
	});

	bed.save(err => {
		if (err) throw err;

		return res.status(200).json({
			success: true
		});
	});
});

router.get('/who', (req, res, next) => {
	_bed2.default.find().exec((err, beds) => {
		if (err) throw err;
		return res.status(200).json({
			beds
		});
	});
});

router.delete('/:id', (req, res, next) => {
	_bed2.default.remove(req.params.id, err => {
		if (err) throw err;
		return res.status(200).json({
			success: true
		});
	});
});

exports.default = router;