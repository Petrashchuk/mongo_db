const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));
router.use('/ideas',require('./ideas'));
router.use('/feedback',require('./feedback'));


module.exports = router;
