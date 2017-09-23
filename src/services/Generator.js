import bwipjs from 'bwip-js';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
dotenv.config();

const S_KEY = process.env.S_K;

export function toBarcodes(id) {
  return new Promise(
    (resolve, reject) => {
      bwipjs.toBuffer({
      bcid: 'code128',           // Barcode type
      text: id,                  // Text to encode
      includetext: true          // Show human-readable text
      // scale: 2,               // 2x scaling factor
      // height: 10,             // Bar height, in millimeters
      // textxalign: 'center',   // Always good to set this
      // textfont: 'D2Coding', // Use your custom font
      // textsize: 13            // Font size, in points
      }, (err, png) => {
        if(err) {
          return reject(err);
        }
        console.log(typeof png);
        resolve(png);
      });
    }
  );
  //bwipjs.loadFont('D2Coding', 108, fs.readFileSync('./fonts/D2Coding.ttf', 'binary'));
}

export function toTokens(info) {
  return new Promise(
    (resolve, reject) => {
      if(!info) {
        return reject('info is null');
      }

      let token = jwt.encode(info, S_KEY);
        resolve(token);
    }
  );
}

export function decodeToken(token) {
  return jwt.decode(token, S_KEY);
}

export function genRandom(length) {
  return new Promise(
    (resolve, reject) => {
	if(!length) {
	  return reject('length is null');
	}
	var randomNumber =  Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
	resolve(randomNumber);
  });
}
