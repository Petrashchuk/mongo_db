const router = require('express').Router();
// const auth = require('../auth');


const feedbackController = require('../../controllers/Feedbacks.controller');

router.post('/create_feedback', feedbackController.create_feedback);
router.delete('/remove_feedback',feedbackController.remove_feedbacks);


module.exports = router;
