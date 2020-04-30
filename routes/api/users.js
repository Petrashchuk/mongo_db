const router = require('express').Router();

const userController = require('../../controllers/users.controller');

router.post('/create_user', userController.create_user);
router.delete('/remove_users', userController.remove_all_users);


module.exports = router;
