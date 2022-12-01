
import express from 'express';
const commentController = require('../controllers/commentController');

const router = express.Router();

// Get all comments in a particular post
router.get('/', commentController.get_all_comments);

//Individual comment CRUD operations
// Read
router.get('/:id', commentController.get_comment);
// create 
router.post('/', commentController.create_comment);
// update 
router.put('/:id', commentController.update_comment);
// delete 
router.delete('/:id', commentController.delete_comment);

module.exports = router;