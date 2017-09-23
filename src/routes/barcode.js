import express from 'express';
import fs from 'fs';
import { toBarcodes } from '../services/Generator';

const router = express.Router();

router.get('/:name', (req, res) => {

  toBarcodes('usesomething').then(image => {   // 인자값 주고, 성공하면 then 실행. image 는 바코드 제너레이트에서 resolve(png) 값.
    fs.writeFile(`./public/barcodes/${req.params.name}.png`, image, err => {
      if(err) throw err;
      console.log('wrote success');
      res.status(200).json({
        success: true
      });
    });
  });
});


export default router;
