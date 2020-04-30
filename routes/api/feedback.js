const router = require('express').Router();
// const auth = require('../auth');


const feedbackController = require('../../controllers/feedbacks.controller');

router.post('/create_feedback', feedbackController.create_feedback);
router.delete('/remove_feedback', feedbackController.remove_feedbacks);
router.get('/show_statistic', feedbackController.show_statistic);


module.exports = router;
