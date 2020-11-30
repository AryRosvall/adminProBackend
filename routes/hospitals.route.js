/*
 Route: '/api/hospitals'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitals, createHospitals, updateHospital, deleteHospital } = require('../controllers/hospitals.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();

router.get('/', validateJWT, getHospitals);
router.post('/',
  [
    validateJWT,
    check('name', 'The hospital\'s name is required').notEmpty(),
    fieldValidator
  ],
  createHospitals
);
router.put('/:id',
  [
    validateJWT,

    fieldValidator
  ],
  updateHospital
);
router.delete('/:id',
  validateJWT,
  deleteHospital
);



module.exports = router;
