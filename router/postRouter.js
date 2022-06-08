const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
    createPost,
    viewPosts,
    viewPost,
    deletePost,
} = require('../controller/postController');

router.route('/posts').get(viewPosts);
router.route('/:id/post').get(viewPost);
router.route('/:id/delete').delete(deletePost);


router.route('/:id/upload').post(upload, createPost);

module.exports = router;