const firebase = require('../db');
const Post = require('../models/post');
const firestore = firebase.firestore();


const addPost = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('posts').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllPosts = async (req, res, next) => {
    try {
        const post = await firestore.collection('posts');
        const data = await post.get();
        const postsArray = [];
        if (data.empty) {
            res.status(404).send('No post record found');
        } else {
            data.forEach(doc => {
                const post = new Post(
                    doc.id,
                    doc.data().author,
                    doc.data().title,
                    doc.data().userId,

                );
                postsArray.push(post);
            });
            res.send(postsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await firestore.collection('posts').doc(id);
        const data = await post.get();
        if (!data.exists) {
            res.status(404).send('post with the given ID not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.params.userId;
        const data = req.body;
        const infos = await firestore.collection('posts').doc(id);
        const info = await infos.get();
        if (!info.exists) {
            res.status(404).send('post with the given ID not found');
        }
        if (info.data().userId != userId) {
            res.status(400).json({ error: "You are not authorized to do this action" })
        } else {
            const post = await firestore.collection('posts').doc(id);
            await post.update(data);
            res.send('post record updated successfuly');
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.params.userId;
        const post = await firestore.collection('posts').doc(id);
        const data = await post.get();
        if (!data.exists) {
            res.status(404).send('post with the given ID not found');
        }
        if (data.data().userId != userId) {
            res.status(400).json({ error: "You are not authorized to do this action" })
        } else {
            await firestore.collection('posts').doc(id).delete();
            res.send('Record deleted successfuly');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const fetchAllPostByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const data = await firestore
            .collection('posts')
            .where('userId', '==', userId)
            .get()

        const postsArray = [];
        let post;
        if (data.empty) {
            res.status(404).send('No post record found');
        } else {
            data.forEach(doc => {
                const post = new Post(
                    doc.id,
                    doc.data().author,
                    doc.data().title,
                    doc.data().userId,
                );
                postsArray.push(post);
            });
            console.log(postsArray)
            res.send(postsArray);
        }
    } catch (error) {
        console.log(error)
        res.status(400).send(error.message);
    }
}

module.exports = {
    addPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    fetchAllPostByUserId
}