"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require('../controllers/userController');
const router = express_1.default.Router();
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
//# sourceMappingURL=user.js.map