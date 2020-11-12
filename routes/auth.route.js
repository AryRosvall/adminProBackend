/*
  Path: 'api/login'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller');
const { fieldValidator } = require('../middleware/fieldValidator');

const router = Router();

router.post('/',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    fieldValidator
  ],
  login
);

module.exports = router;