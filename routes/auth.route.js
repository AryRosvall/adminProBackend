/*
  Path: 'api/login'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, renewToken } = require('../controllers/auth.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();

router.post('/',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    fieldValidator
  ],
  login
);

router.post('/google',
  [
    check('token', 'Token is required').not().isEmpty(),
    fieldValidator
  ],
  googleSignIn
);

router.get('/renew',
  validateJWT,
  renewToken
);

module.exports = router;