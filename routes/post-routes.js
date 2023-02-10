const express = require('express');
const {addPost, 
       getAllPosts, 
       getPost,
       updatePost,
       deletePost,
       fetchAllPostByUserId
      } = require('../controllers/postController');

const router = express.Router();

router.post('/post', addPost);
router.get('/posts', getAllPosts);
router.get('/post/:id', getPost);
router.put('/post/:id/:userId', updatePost);
router.delete('/post/:id/:userId', deletePost);
router.get('/posts/:userId', fetchAllPostByUserId);

module.exports = {
    routes: router
}