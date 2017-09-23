'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import formidable from 'formidable';

const router = _express2.default.Router();

const storage = _multer2.default.diskStorage({
	destination(req, file, cb) {
		cb(null, './public/commons');
	},
	filename(req, file, cb) {
		console.log('asdsads');
		console.log(file);
		cb(null, file.originalname);
	}
});

const upload = (0, _multer2.default)({
	storage: storage,
	limits: {
		fileSize: 7000000000
	}
});
router.post('/', upload.single('file'), (req, res) => {
	if (!req.file) {
		console.log('file is not defined');
	}
	console.log(req.headers);
	console.log('----------');
	console.log(req.file);
	console.log('----------');
	console.log(req.files);
	res.json({ 'hello': 'world' });
});

router.post('/getme', (req, res, next) => {
	console.log('getme');
	console.log(req.body.barcodes);
});

exports.default = router;