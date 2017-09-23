import express from 'express';
import multer from 'multer';
//import formidable from 'formidable';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/commons');
  },
  filename(req, file, cb) {
    console.log('asdsads');
    console.log(file);
    cb(null,file.originalname);
  }
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 7000000000
	}
});
router.post('/', upload.single('file'), (req, res) => {
	if(!req.file) {
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

export default router;
