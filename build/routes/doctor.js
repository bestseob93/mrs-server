'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _doctor = require('../models/doctor');

var _doctor2 = _interopRequireDefault(_doctor);

var _Generator = require('../services/Generator');

var Generate = _interopRequireWildcard(_Generator);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();


const router = _express2.default.Router();

const storage = _multer2.default.diskStorage({
  destination(req, file, cb) {
    cb(null, './public/doctors');
  },
  filename(req, file, cb) {
    console.log('drug file in');
    console.log(file);
    cb(null, file.originalname);
  }
});

const upload = (0, _multer2.default)({
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

  (0, _requestPromise2.default)(reqOptions).then(result => {
    console.log(result);
    return res.status(200).json(result);
  }).catch(err => {
    console.log(err);
  });
});

router.post('/register', upload.single('doctorImage'), (req, res, next) => {
  let personGroupId = "doctor";

  if (req.body.job === "" && typeof req.body.job !== 'string') {
    return res.status(422).json({
      error: "job null",
      code: 1
    });
  }

  if (req.body.doctorName === "" && typeof req.body.doctorName !== 'string') {
    return res.status(422).json({
      error: "name null",
      code: 2
    });
  }

  if (req.body.birth === "" && typeof req.body.birth !== 'string') {
    return res.status(422).json({
      error: "birth null",
      code: 3
    });
  }

  if (req.body.department === "" && typeof req.body.department !== 'string') {
    return res.status(422).json({
      error: "department null",
      code: 4
    });
  }

  _doctor2.default.findOne({ doctorName: req.body.doctorName, birth: req.body.birth }, (err, exists) => {
    if (err) throw err;

    if (exists) {
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

    (0, _requestPromise2.default)(reqOptions).then(result => {
      Generate.toTokens(doctorInfo).then(token => {
        Generate.toBarcodes(token).then(image => {
          console.log(image);
          _fs2.default.writeFile(`./public/barcodes/doctors/${doctorInfo.doctorBirth}-${doctorInfo.timestamp}.png`, image, err => {
            if (err) throw err;
            console.log(req.body);
            let doctor = new _doctor2.default({
              job: req.body.job,
              doctorName: req.body.doctorName,
              doctorFace: doctorFace,
              doctorPersonId: result.personId,
              birth: req.body.birth,
              department: req.body.department,
              doctorBarcode: token
            });

            doctor.save(err => {
              if (err) throw err;
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

              (0, _requestPromise2.default)(reqSecondOptions).then(result => {
                console.log(result);
              }).catch(err => {
                if (err) throw err;
              });

              return res.status(200).json({
                success: true
              });
            });
          });
        });
      });
    }).catch(err => {
      if (err) throw err;
    });
  });
});

router.get('/who', (req, res, next) => {
  _doctor2.default.find().exec((err, doctors) => {
    if (err) throw err;
    return res.status(200).json({
      doctors
    });
  });
});
router.get('/who', (req, res, next) => {
  _doctor2.default.find().sort({ '_id': -1 }).exec((err, doctors) => {
    if (err) throw err;
    return res.status(200).json({
      doctors
    });
  });
});

router.delete('/:id', (req, res, next) => {
  if (!_mongoose2.default.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 0
    });
  }

  _doctor2.default.findById(req.params.id, (err, doctor) => {
    if (err) throw err;
    if (!doctor) {
      return res.status(419).json({
        error: "doctor is not defined",
        code: 1
      });
    }

    _doctor2.default.remove({ _id: req.params.id }, err => {
      if (err) throw err;
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
  if (deToken === 'undefined' || deToken === '') {
    return res.status(422).json({
      error: "token is invalid",
      code: 0
    });
  }

  _doctor2.default.findOne({ doctorName: decodeResult.doctorName, birth: decodeResult.doctorBirth }, (err, exists) => {
    if (err) throw err;

    if (!exists) {
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

exports.default = router;