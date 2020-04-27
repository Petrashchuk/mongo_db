const router = require('express').Router();
// const auth = require('../auth');


const ideaController = require('../../controllers/Ideas.controller');

router.post('/create_idea', ideaController.create_idea);


module.exports = router;
