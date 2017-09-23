import express from 'express';

import upload from './upload';
import barcode from './barcode';
import medicalcare from './medicalcare';
import doctor from './doctor';
import patient from './patient';
import bed from './bed';

const router = express.Router();

router.use('/upload', upload);
router.use('/barcode', barcode);
router.use('/doctor', doctor);
router.use('/medicalcare', medicalcare);
router.use('/patient', patient);
router.use('/bed', bed);

export default router;
