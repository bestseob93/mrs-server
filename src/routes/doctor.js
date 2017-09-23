import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';

import Doctor from '../models/doctor';
import * as Generate from '../services/Generator';
import multer from 'multer';
import async from 'async';
import request from 'request-promise';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/doctors');
  },
  filename(req, file, cb) {
    console.log('drug file in');
    console.log(file);
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

router.post('/azureTest', (req, res, next) => {
	let personGroupId = "doctor";
					
	const reqOptions = {
					method: 'POST',
					json: true,
					uri: `https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons`,
					headers: {
									'content-type': 'application/json; charset=utf-8',
									'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY
					},
					body: {
									'name': req.body.doctorName
					}
	};

	request(reqOptions)
		.then(
		result => {
						console.log(result);
						return res.status(200).json(result);
	}).catch( err => {
					console.log(err);
	});
});

router.post('/register', upload.single('doctorImage'),  (req, res, next) => {
	let personGroupId = "doctor";
	
	console.log(req.body);
  	if(req.body.job === "" && typeof req.body.job !== 'string') {
    		return res.status(422).json({
      			error: "job null",
      			code: 1
    		});
		}

  	if(req.body.doctorName === "" && typeof req.body.doctorName !== 'string') {
    		return res.status(422).json({
      			error: "name null",
      			code: 2
    		});
		}

  	if(req.body.birth === "" && typeof req.body.birth !== 'string') {
    		return res.status(422).json({
      			error: "birth null",
      			code: 3
    		});
  	}

  	if(req.body.department === "" && typeof req.body.department !== 'string') {
    		return res.status(422).json({
      			error: "department null",
      			code: 4
    		});
  	}

	  Doctor.findOne({ doctorName: req.body.doctorName, birth: req.body.birth }, (err, exists) => {
    if(err) throw err;

    if(exists) {
      return res.status(419).json({
        error: "doctor is already exists",
        code: 5
      });
    }

    let doctorFace = `http://13.124.126.30:3000/doctors/${req.file.filename}`;

    let doctorInfo = {
      doctorName: req.body.doctorName,
      doctorBirth: req.body.birth,
      timestamp: new Date().getTime()
    };

	const reqOptions = {
		method: 'POST',
    json: true,
    uri: `https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons`,
    headers: {
			'content-type': 'application/json; charset=utf-8',
			'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY
		},
		body: {
						'name': req.body.doctorName
		}
	};

  request(reqOptions).then(result => {
    Generate.toTokens(doctorInfo).then(token => {
			Generate.toBarcodes(token).then(image => {
        console.log(image);
        fs.writeFile(`./public/barcodes/doctors/${doctorInfo.doctorBirth}-${doctorInfo.timestamp}.png`, image, err => {
          if(err) throw err;
					console.log(req.body);
          let doctor = new Doctor({
            job: req.body.job,
            doctorName: req.body.doctorName,
            doctorFace: doctorFace,
	    			doctorPersonId: result.personId,
            birth: req.body.birth,
            department: req.body.department,
            doctorBarcode: token
          });

          doctor.save(err => {
            if(err) throw err;
            console.log('success');
						const reqSecondOptions = {
										method: 'POST',
										json: true,
										uri: `https://southeastasia.api.cognitive.microsoft.com/face/v1.0/persongroups/${personGroupId}/persons/${result.personId}/persistedFaces`,
										headers: {
														'content-type': 'application/json; charset=utf-8',
														'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY
										},
										body: {
														'url': doctorFace
										}
						};

						request(reqSecondOptions).then(result => {
							console.log(result);
						}).catch(err => { if(err) throw err; });

            return res.status(200).json({
              success: true
            });
          });
        });
      });
		});
	}).catch(err => {
		if(err) throw err;
  });
});
});

router.get('/who', (req, res, next) => {
	Doctor.find()
	      .exec((err, doctors) => {
			if(err) throw err;
			return res.status(200).json({
				doctors
			});
	});
});
router.get('/who', (req, res, next) => {
				Doctor.find()
							.sort({'_id': -1})
							.exec((err, doctors) => {
											if(err) throw err;
											return res.status(200).json({
															doctors
											});
							});
});

router.delete('/:id', (req, res, next) => {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
								      return res.status(400).json({
										        error: "INVALID ID",
										        code: 0
											});
				}

				Doctor.findById(req.params.id, (err, doctor) => {
								if(err) throw err;
								if(!doctor) {
												return res.status(419).json({
																error: "doctor is not defined",
																code: 1
												});
								}

								Doctor.remove({_id: req.params.id}, err => {
												if(err) throw err;
												return res.status(200).json({
																success: true 
												});
								});
				});
});

router.get('/', (req, res, next) => {
  let deToken = req.headers.authorization;
  let decodeResult = Generate.decodeToken(deToken);
  console.log(decodeResult);
  if(deToken === 'undefined' || deToken === '') {
    return res.status(422).json({
      error: "token is invalid",
      code: 0
    });
  }

  Doctor.findOne({ doctorName: decodeResult.doctorName, birth: decodeResult.doctorBirth }, (err, exists) => {
    if(err) throw err;

    if(!exists) {
      return res.status(419).json({
        error: "doctor is not registered",
        code: 1
      });
    }

    return res.status(200).json({
      success: true
    });

  });
});

export default router;
