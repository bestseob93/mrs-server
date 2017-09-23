import express from 'express';
import mongoose from 'mongoose';
import async from 'async';
import fs from 'fs';
import multer from 'multer';

import Patient from '../models/patient';
import Doctor from '../models/doctor';
import Bed from '../models/bed';
import MedicalCare from '../models/medicalcare';

import * as Generate from '../services/Generator';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/files');
  },
  filename(req, file, cb) {
    console.log('asdsads');
    console.log(file);
    cb(null,file.originalname);
  }
});

const upload = multer({
	storage: storage
});

router.post('/upload/:recogDoctorName', upload.single('boxcam'), (req, res, next) => {
    console.log(req.params.recogDoctorName);
		console.log(typeof req.params.recogDoctorName);
		let bedId = req.headers.authorization; // 침대 uuid
		if(req.params.recogDoctorName === '' || typeof req.params.recogDoctorName !== 'string') {
			return res.status(422).json({
							error: "Doctor Name Undefined",
							code: 0
			});
		}

    Bed.findOne({beduuid: bedId}, (err, bed) => {
			console.log(bed);
      if(err) throw err;
      if(!bed) {
        return res.status(422).json({
          error: "bed is not registered",
          code: 3
        });
      }

      Patient.findOne({ bed: bed._id }, (err, patient) => {
        if(err) throw err;
        if(!patient) {
          return res.status(422).json({
            error: "patient does not exists",
            code: 1
          });
        }

        if(req.file === undefined) {
          return res.status(422).json({
            error: "VIDEO DOES NOT RECORDED",
            code: 2
          });
        }

				Doctor.findOne({doctorPersonId: req.params.recogDoctorName}, (err, doctor) => {
								if(err) throw err;
								if(!doctor) {
												return res.status(422).json({
																error: "doctor does not exists",
																code: 7
												});
								}

								

        let recordFile = 'http://13.124.126.30:3000/files/' + req.file.filename;
				let recordFileGroup = {
								doctorName: doctor.doctorName,
								fileName: recordFile
				};

				console.log(recordFileGroup);

        patient.recordFiles.push(recordFileGroup);
        patient.save(err => {
          if(err) throw err;
          return res.status(200).json({
            success: true
          });
				});
        });
      });
    });
});

router.post('/register', (req, res, next) => {
  if(req.body.patientName === '' || typeof req.body.patientName !== 'string') {
    return res.status(422).json({
      error: "patient name does not filled",
      code: 2
    });
  }

  if(req.body.gender === '' || typeof req.body.gender !== 'string') {
    return res.status(422).json({
      error: "patient gender does not filled",
      code: 8
    });
  }

  if(req.body.patientTel === '' || typeof req.body.patientTel !== 'string') {
    return res.status(422).json({
      error: "patient tel does not filled",
      code: 3
    });
  }

  if(req.body.patientBirth === '' || typeof req.body.patientBirth !== 'string') {
    return res.status(422).json({
      error: "patient birth does not filled",
      code: 4
    });
  }

  if(req.body.address === '' || typeof req.body.address !== 'string') {
    return res.status(422).json({
      error: "address does not filled",
      code: 5
    });
  }

  if(req.body.bloodType === '' || typeof req.body.bloodType !== 'string') {
    return res.status(422).json({
      error: "blood type does not filled",
      code: 6
    });
  }

  Patient.findOne({patientName: req.body.patientName, birth: req.body.patientBirth}, (err, exists) => {
    if(err) throw err;

    if(exists) {
      return res.status(422).json({
        error: "patient already exists",
        code: 7
      });
    }

    let patientInfo = {
      patientName: req.body.patientName,
      gender: req.body.gender,
      patientTel: req.body.patientTel,
      patientBirth: req.body.patientBirth,
      timestamp: new Date().getTime()
    };

    Generate.genRandom(4).then(randomNumber => {
      Generate.toBarcodes(req.body.patientBirth + randomNumber).then(image => {
        console.log(image);
        fs.writeFile(`./public/barcodes/patients/${patientInfo.patientBirth}-${randomNumber}.png`, image, err => {
          if(err) throw err;

          let patient = new Patient({
            patientName: req.body.patientName,
            gender: req.body.gender,
	    			patientTel: req.body.patientTel,
            birth: req.body.patientBirth,
            address: req.body.address,
            bloodType: req.body.bloodType,
	    			chargeDoctor: null,
	    			bed: null,
	    			disease: '',
            patientBarcode: req.body.patientBirth + randomNumber,
	    			care: []
          });

          patient.save(err => {
            if(err) throw err;

            return res.status(200).json({
              success: true,
              patient_id: patient._id,
	      			patient_uuid: patient.patientBarcode
            });
          });
        });
      });
    });
  });
});

router.post('/moreInfo/:p_id/:b_id', (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  if(!mongoose.Types.ObjectId.isValid(req.params.p_id)) {
    return res.status(419).json({
      error: "invalid id",
      code: 0
    });
  }

  if(!mongoose.Types.ObjectId.isValid(req.params.b_id)) {
    return res.status(419).json({
      error: "invalid id",
      code: 0
    });
  }

  if(req.body.disease === '' || typeof req.body.disease !== 'string') {
    return res.status(422).json({
      error: "disease is not defined",
      code: 1
    })
  }

  Patient.findById(req.params.p_id, (err, patient) => {
    if(err) throw err;

    if(!patient) {
      return res.status(422).json({
        error: "patient does not exist",
        code: 5
      });
    }


    patient.disease = req.body.disease;
    patient.bed = req.params.b_id;
    patient.chargeDoctor = req.body.doctor_id;

    for(let i=0; i<req.body.medicalCareArr.length; i++) {
			patient.care.push(req.body.medicalCareArr[i]);
    }

    patient.save( err => {
      if(err) throw err;
      console.log('patient saved');
			Bed.findById(req.params.b_id, (err, bed) => {
							if(err) throw err;
							bed.isChecked = true;
			});

      return res.status(200).json({
        success: true
      });
    });
  });
});

router.post('/signIn', (req, res, next) => {
  if(typeof req.body.patientName !== 'string' || typeof req.body.patientBarcode !== 'string') {
	return res.status(422).json({
		error: "LOGIN FAILED",
		code: 1
	});
  }
  
  Patient.findOne({ patientName: req.body.patientName, patientBarcode: req.body.patientBarcode}, (err, patient) => {
	if(err) throw err;
	
	if(!patient) {
		return res.status(422).json({
			error: "LOGIN FAILED",
			code: 1
		});
	}

	Generate.toTokens(patient._id).then((token) => {
		return res.status(200).json({
			success: true,
			token
		});
	});
  }); 
});

router.post('/logout', (req, res, next) => {
    		return res.json({ sucess: true });
});

router.get('/', (req, res, next) => {
  Patient.find()
	 .exec((err, patients) => {
		if(err) throw err;
		return res.status(200).json({
		  patients
		});
  });
});

router.get('/moreInfoPage', (req, res, next) => {
  async.parallel([
    cb => {
      Doctor.find()
            .sort({_id: -1})
            .exec((err, doctors) => {
              if(err) throw err;
              cb(null, doctors);
            });
    },
    cb => {
	// isChecked false 인 애만 주기 (나중에)
      Bed.find({isChecked: false})
         .sort({_id: -1})
         .exec((err, beds) => {
           if(err) throw err;
           cb(null, beds);
         });
    },
    cb => {
      MedicalCare.find()
                 .sort({_id: -1})
                 .exec((err, medicalcares) => {
                   if(err) throw err;
                   cb(null, medicalcares);
                 });
    }
  ],
    (err, results) => {
      if(err) throw err;
	console.log(results);
      return res.status(200).json(results);
  });
});

router.delete('/:p_id', (req, res) => {
  Patient.findById(req.params.p_id, (err, patient) => {
    if(err) throw err;
    if(!patient) {
      return res.status(419).json({
        error: "NO PATIENT",
        code: 0
      });
    }
    Patient.remove({ _id: req.params.p_id }, err => {
      if(err) throw err;
      return res.status(200).json({
        success: true
      });
    });
  });
});

router.get('/myPage', (req, res) => {
	let token = req.headers.authorization;
	if(typeof token !== 'string' || token === "") {
		return res.status(401).json({
			error: "SESSION EXPIRED",
			code: 0
		});
	}

	let patient_id = Generate.decodeToken(token);

	async.series([
		cb => {
			Patient.findById(patient_id)
			       .populate('chargeDoctor')
			       .exec((err, patient) => {
					if(err) throw err;
					cb(null, patient.chargeDoctor);
			       });
		},
		cb => {
			Patient.findById(patient_id)
			       .populate('bed')
			       .exec((err, patient) => {
					if(err) throw err;
					cb(null, patient.bed);
				});
		},
		cb => {
			Patient.findById(patient_id)
			       .populate({path: 'care', options: { sort: { 'date.dosage': -1 }}})
			       .exec((err, patient) => {
					if(err) throw err;
					cb(null, patient.care);
				});
		},
		cb => {
			Patient.findById(patient_id)
			       .exec((err, patient) => {
					if(err) throw err;
					cb(null, patient);
				});
		}],
		(err, results) => {
			if(err) throw err;
			return res.status(200).json(results);
		}
			
	);
});

router.post('/addMedicalTime', (req, res, next) => {
	let firstBarcode = req.body.barcode;
	let splitArr = firstBarcode.split("\n");
	let barcode = splitArr[0];
  console.log(barcode);
	console.log(req.headers.authorization);
  async.waterfall([
		cb => {
  Bed.findOne({beduuid: req.headers.authorization})
	     .exec((err, bed) => {
							 if(err) throw err;
							 console.log(bed);
						   if(!bed) {
											 return res.status(419).json({
															 error: "Can Not Find Bed",
															 code: 3
											 }); 
						   }   
               Patient.findOne({bed: bed._id})																		                    .exec((err, patient) => {
											 	if(err) throw err;
											  if(!patient) {
																return res.status(419).json({
																	error: "Can Not Find Patient",
																	code: 4
																}); 
												}
												cb(null, patient);
							});
			 });
		},
		(patient, cb) => {
						  console.log(patient.care[1]);
							console.log(typeof barcode);
						  MedicalCare.findOne({'drug.drugBarcode': barcode})
							           .exec((err, medicalcare) => {
																 console.log(medicalcare);
																 if(err) throw err;
																 if(!medicalcare) {
																				 return res.status(419).json({
																								 error: "Can Not Find MedicalCare",
																								 code: 5
																				 });
																 }
																 let isDrugIn;
																 console.log(isDrugIn);
																 console.log(patient.care.length);
																 for(let i=0; i<patient.care.length; i++) {
																				if(patient.care[i].toString() === medicalcare._id.toString()) {
																				isDrugIn = true;
																				}
												 }
												 	console.log('isDrugIn');
													console.log(isDrugIn);
												  medicalcare.date.edited = new Date();
													medicalcare.save(err => {
																	if(err) throw err;
																	cb(null, isDrugIn);
													});
												 });
		}], (err, result) => {
						console.log(result);
						if(err) throw err;
						if(result) {
										return res.status(200).json({
														result: result
										});
						} else {
										return res.status(200).json({
														result: false
										});
						}
		});
});

router.post('/leave/:id', (req, res, next) => {
				let patientId = req.params.id;
				if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
								return res.status(422).json({
												error: "id is not valid",
												code: 0
								});
				}

				Patient.findById(patientId, (err, patient) => {
								if(err) throw err;
								let bedId = patient.bed;
								
								patient.bed = undefined;

								patient.save((err) => {
												if(err) throw err;
												Bed.findById(bedId, (err, bed) => {
																if(err) throw err;
																bed.isChecked = false;
																return res.status(200).json({
																				success: true
																});
												});
								});
				});
});

export default router;
