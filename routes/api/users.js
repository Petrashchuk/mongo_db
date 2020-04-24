const router = require('express').Router();
// const auth = require('../auth');


const userController = require('../../controllers/Users');

router.post('/create_user', userController.create_user);
router.delete('/remove_users', userController.remove_all_users);


module.exports = router;
