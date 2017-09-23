import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';

import MedicalCare from '../models/medicalcare';

import * as Generate from '../services/Generator';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/drugs');
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

router.get('/who', (req, res, next) => {
	MedicalCare.find()
		   .exec((err, medicalcares) => {
			if(err) throw err;
			return res.status(200).json({
				medicalcares
			});
	});
});

router.post('/drugRegister', upload.single('medicalImage'), (req, res, next) => {
  if(req.body.medicalType === '' && typeof req.body.medicalType !== 'string') {
    return res.status(422).json({
      error: "type is not defined",
      code: 0
    });
  }

  if(req.body.drugName === '' && typeof req.body.drugName !== 'string') {
    return res.status(422).json({
      error: "drugname is not defined",
      code: 1
    });
  }

  if(req.body.drugCompany === '' && typeof req.body.drugCompany !== 'string') {
    return res.status(422).json({
      error: "drugcompany is not defined",
      code: 2
    });
  }

  if(req.body.drugCompanyInfo === '' && typeof req.body.drugCompanyInfo !== 'string') {
    return res.status(422).json({
      error: "drugcompanyinfo is not defined",
      code: 3
    });
  }

  if(req.body.insuranceCode === '' && typeof req.body.insuranceCode !== 'string') {
    return res.status(422).json({
      error: "insuranceCode is not defined",
      code: 4
    });
  }

  if(req.body.drugShape === '' && typeof req.body.drugShape !== 'string') {
    return res.status(422).json({
      error: "drugShape is not defined",
      code: 5
    });
  }

  if(req.body.drugIngrident === '' && typeof req.body.drugIngrident !== 'string') {
    return res.status(422).json({
      error: "drugIngrident is not defined",
      code: 6
    });
  }

  if(req.body.drugSave === '' && typeof req.body.drugSave !== 'string') {
    return res.status(422).json({
      error: "drugSave is not defined",
      code: 7
    });
  }

  if(req.body.drugEffect === '' && typeof req.body.drugEffect !== 'string') {
    return res.status(422).json({
      error: "drugeffect is not defned",
      code: 8
    });
  }

  if(req.body.drugAmount === '' && typeof req.body.drugAmount !== 'string') {
    return res.status(422).json({
      error: "drugAmount is not defined",
      code: 9
    });
  }

  if(req.body.drugCaution === '' && typeof req.body.drugCaution !== 'string') {
    return res.status(422).json({
      error: "drugCaution is not defined",
      code: 10
    });
  }


  /* 메디컬 타입에 따른 객체 에러 처리 */

  MedicalCare.findOne({drug: {insuranceCode: req.body.insuranceCode}}, (err, result) => {
    if(err) throw err;
    if(result) {
      return res.status(422).json({
        error: "medicalcare already exists",
        code: 11
      });
    }

    if(req.file === undefined) {
      return res.status(422).json({
        error: "image does not exist",
        code: 12
      });
    }

    const drugImage = `http://13.124.126.30:3000/drugs/${req.file.filename}`;

    Generate.genRandom(4).then(randomNumber => {
      Generate.toBarcodes(req.body.insuranceCode + randomNumber).then(barcodeImg => {
        fs.writeFile(`./public/barcodes/drugs/${req.body.insuranceCode + randomNumber}.png`, barcodeImg, err => {
          if(err) throw err;

          let result = new MedicalCare({
            medicalType: req.body.medicalType,
            drug: {
              drugName: req.body.drugName,
              drugImageUrl: drugImage,
              drugCompany: req.body.drugCompany,
              drugCompanyInfo: req.body.drugCompanyInfo,
              insuranceCode: req.body.insuranceCode,
              drugShape: req.body.drugShape,
              drugIngrident: req.body.drugIngrident,
              drugSave: req.body.drugSave,
              drugEffect: req.body.drugEffect,
              drugAmount: req.body.drugAmount,
              drugCaution: req.body.drugCaution,
              drugBarcode: req.body.insuranceCode + randomNumber
            }
          });

          result.save( err => {
            if(err) throw err;
            return res.status(200).json({
              success: true
            });
          });
        });
      });
    });
  });
});

router.put('/modifypal', (req, res, next) => {

	MedicalCare.findById('591e8287b52f383e6686aca2', (err, result) => {
					console.log(result);
					result.drug.drugEffect = '발기부전의 치료';
					
					result.save();
	});
});

export default router;

