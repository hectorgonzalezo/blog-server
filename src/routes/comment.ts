
import express from 'express';
const commentController = require('../controllers/commentController');

const router = express.Router();

// Get all comments in a particular post
router.get('/', commentController.get_all_comments);

//Individual comment CRUD operations
// Read
router.get('/:commentId', commentController.get_comment);
// create 
router.post('/:commentId', commentController.create_comment);
// update 
router.put('/:commentId', commentController.update_comment);
// delete 
router.delete('/:commentId', commentController.delete_comment);

module.exports = router;