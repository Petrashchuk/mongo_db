const router = require('express').Router();

const feedbackController = require('../../controllers/feedbacks.controller');

router.get('/show_statistic', feedbackController.show_statistic);

module.exports = router;
