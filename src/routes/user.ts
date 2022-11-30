import express from 'express';
const userController = require('../controllers/userController');

const router = express.Router();

// Get all users
router.get('/', userController.get_all_users);

//Individual user CRUD operations
// Read
router.get('/:userId', userController.get_user);
// create 
router.post('/:userId', userController.create_user);
// update 
router.put('/:userId', userController.update_user);
// delete 
router.delete('/:userId', userController.delete_user);

module.exports = router;