/*
 Route: '/api/doctors'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getDoctors, createDoctors, updateDoctor, deleteDoctor } = require('../controllers/doctors.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();

router.get('/', validateJWT, getDoctors);
router.post('/',
  [
    validateJWT,
    check('name', 'The doctor\'s name is required').notEmpty(),
    check('hospitals', 'At least one hospital is necessary').isArray({ min: 1 }),
    check('hospitals.*', 'Invalid Id').isMongoId(),
    fieldValidator
  ],
  createDoctors
);

router.put('/:id',
  [
    validateJWT,
    check('name', 'The doctor\'s name is required').optional().notEmpty(),
    check('hospitals', 'At least one hospital is necessary').optional().isArray({ min: 1 }),
    check('hospitals.*', 'Invalid Id').isMongoId(),
    fieldValidator
  ],
  updateDoctor
);

router.delete('/:id',
  validateJWT,
  deleteDoctor
);



module.exports = router;
