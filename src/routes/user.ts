import express from 'express';
import passport from 'passport';
const userController = require('../controllers/userController');
require("../passport");

const router = express.Router();

// Log in
router.post('/log-in', userController.login_user);

// Log out
router.get('/log-out', userController.logout_user);

//Individual user CRUD operations
// Read 
// Only get users if youre authorized
router.get('/:id', passport.authenticate('jwt', { session: false }), userController.get_user);
// create, sign up
router.post('/sign-up', userController.create_user);
// update 
router.put('/:id', userController.update_user);
// delete 
router.delete('/:id', userController.delete_user);



module.exports = router;