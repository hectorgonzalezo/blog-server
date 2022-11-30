"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController = require('../controllers/postController');
const router = express_1.default.Router();
// Get all posts
router.get('/', postController.get_all_posts);
//Individual post CRUD operations
// Read
router.get('/:id', postController.get_post);
// create 
router.post('/', postController.create_post);
// update 
router.put('/:id', postController.update_post);
// delete 
router.delete('/:id', postController.delete_post);
module.exports = router;
//# sourceMappingURL=post.js.map