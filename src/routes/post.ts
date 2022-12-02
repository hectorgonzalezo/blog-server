import express from "express";
const postController = require("../controllers/postController");

const router = express.Router();

// Get all posts
router.get("/", postController.get_all_posts);

//Individual post CRUD operations
// Read
router.get("/:id", postController.get_post);

// create
router.post("/", postController.create_post);

// update
router.put("/:id", postController.update_post);

// delete
router.delete("/:id", postController.delete_post);

module.exports = router;
