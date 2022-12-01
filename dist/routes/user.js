"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController = require('../controllers/userController');
const router = express_1.default.Router();
// Log in
router.post('/log-in', userController.login_user);
// Log out
router.get('/log-out', userController.logout_user);
//Individual user CRUD operations
// Read
router.get('/:id', userController.get_user);
// create, sign up
router.post('/sign-up', userController.create_user);
// update 
router.put('/:id', userController.update_user);
// delete 
router.delete('/:id', userController.delete_user);
module.exports = router;
//# sourceMappingURL=user.js.map