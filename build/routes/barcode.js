'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Generator = require('../services/Generator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express2.default.Router();

router.get('/:name', (req, res) => {

  (0, _Generator.toBarcodes)('usesomething').then(image => {
    // 인자값 주고, 성공하면 then 실행. image 는 바코드 제너레이트에서 resolve(png) 값.
    _fs2.default.writeFile(`./public/barcodes/${req.params.name}.png`, image, err => {
      if (err) throw err;
      console.log('wrote success');
      res.status(200).json({
        success: true
      });
    });
  });
});

exports.default = router;