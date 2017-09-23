import express from 'express';
import mongoose from 'mongoose';

import Bed from '../models/bed';

const router = express.Router();

router.post('/', (req, res, next) => {
	console.log(req.body.beduuid);
	console.log(typeof req.body.beduuid);
	if(req.body.beduuid === '' || typeof req.body.beduuid !== 'string') {
		return res.status(422).json({
			error: "beduuid is undefined",
			code: 0
		});
	}

	let bed = new Bed({
		beduuid: req.body.beduuid,
		isChecked: false
	});

	bed.save(err => {
		if(err) throw err;
		
		return res.status(200).json({
			success: true
		});
	});
});

router.get('/who', (req, res, next) => {
	Bed.find()
	   .exec((err, beds) => {
		if(err) throw err;
		return res.status(200).json({
			beds
		});
	});
});

router.delete('/:id', (req, res, next) => {
				Bed.remove(req.params.id, err => {
								if(err) throw err;
								return res.status(200).json({
												success: true
								});
				});
});

export default router;
