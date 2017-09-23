'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBarcodes = toBarcodes;
exports.toTokens = toTokens;
exports.decodeToken = decodeToken;
exports.genRandom = genRandom;

var _bwipJs = require('bwip-js');

var _bwipJs2 = _interopRequireDefault(_bwipJs);

var _jwtSimple = require('jwt-simple');

var _jwtSimple2 = _interopRequireDefault(_jwtSimple);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const S_KEY = process.env.S_K;

function toBarcodes(id) {
  return new Promise((resolve, reject) => {
    _bwipJs2.default.toBuffer({
      bcid: 'code128', // Barcode type
      text: id, // Text to encode
      includetext: true // Show human-readable text
      // scale: 2,               // 2x scaling factor
      // height: 10,             // Bar height, in millimeters
      // textxalign: 'center',   // Always good to set this
      // textfont: 'D2Coding', // Use your custom font
      // textsize: 13            // Font size, in points
    }, (err, png) => {
      if (err) {
        return reject(err);
      }
      console.log(typeof png);
      resolve(png);
    });
  });
  //bwipjs.loadFont('D2Coding', 108, fs.readFileSync('./fonts/D2Coding.ttf', 'binary'));
}

function toTokens(info) {
  return new Promise((resolve, reject) => {
    if (!info) {
      return reject('info is null');
    }

    let token = _jwtSimple2.default.encode(info, S_KEY);
    resolve(token);
  });
}

function decodeToken(token) {
  return _jwtSimple2.default.decode(token, S_KEY);
}

function genRandom(length) {
  return new Promise((resolve, reject) => {
    if (!length) {
      return reject('length is null');
    }
    var randomNumber = Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
    resolve(randomNumber);
  });
}