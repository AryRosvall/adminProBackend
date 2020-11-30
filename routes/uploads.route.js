/* 
Route: api/uploads/:collection/:id
*/

const { Router } = require('express');
const fileUpload = require('express-fileupload');
const { check } = require('express-validator');
const { uploadFile, returnFile } = require('../controllers/uploads.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();
router.use(fileUpload());
router.put('/:table/:id', [
  validateJWT,
  check('id', 'Invalid Id').isMongoId(),
  check('table', 'The table must be users/doctors/hospitals').isIn(['hospitals', 'users', 'doctors']),
  fieldValidator
],
  uploadFile
);
router.get('/:table/:photo', [
  validateJWT,
  check('table', 'The table must be users/doctors/hospitals').isIn(['hospitals', 'users', 'doctors']),
  fieldValidator
],
  returnFile
);

module.exports = router;
