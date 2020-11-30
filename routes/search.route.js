/* 
Route: api/all/:searchWord
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getAll, getCollection } = require('../controllers/search.controller');
const { fieldValidator } = require('../middleware/fieldValidator');
const { validateJWT } = require('../middleware/validateJWT');

const router = Router();

router.get('/:searchWord', validateJWT, getAll);
router.get('/collection/:table/:search', validateJWT, getCollection);


module.exports = router;
