/* 
Route: api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, createUsers, updateUser, deleteUser } = require('../controllers/users.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();

router.get('/', validateJWT, getUsers);
router.post('/',
  [
    check('name', "Name is required").not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Provide a valid email').isEmail(),
    fieldValidator
  ],
  createUsers
);
router.put('/:id',
  [
    validateJWT,
    check('name', "Name is required"),
    check('email', 'Provide a valid email').isEmail(),
    // check('role', 'Role is required').not().isEmpty(),
    fieldValidator
  ],
  updateUser
);
router.delete('/:id',
  validateJWT,
  deleteUser
);



module.exports = router;
