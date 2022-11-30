"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController = require('../controllers/commentController');
const router = express_1.default.Router();
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
