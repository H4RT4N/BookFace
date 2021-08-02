/*
    Operations for posts
*/
const router = require('express').Router();
const { json } = require('body-parser');

// middleware import
const auth = require('../middleware/auth.middleware');

// Schema import
const Post = require('../models/post.model');

// Create post
router.post('/', auth, async(req, res) => {
    if(!req.userId)
        return res.json({message: "Cannot retrieve user id"});
    const newPost = new Post({
        ...req.body,
        authorId: req.userId
    });
    await newPost.save((err, docs) => {
        if(!err)
            res.send(docs);
        else
            console.log(err);
    });
});

// Get all postss
router.get('/', async(req, res) => {
    await Post.find((err, docs) => {
        if(!err)
            res.send(docs);
        else
            console.log(err);
    });
});

// Get specific post
router.get('/:id', async(req, res) => {
    await Post.findById(req.params.id, (err, docs) => {
        if (!err)
            res.send(docs);
        else
            console.log(err);
    });
});

// Update post
router.put('/:id', async(req, res) => {
    await Post.findByIdAndUpdate(req.params.id, 
        {$set: req.body}, 
        {new: true},
        (err, docs) => {
            if (!err)
                res.send(docs);
            else
                console.log(err);
        });
});

// Delete Post
router.delete('/:id', async(req, res) => {
    await Post.findByIdAndRemove(req.params.id, 
        (err, docs) => {
            if (!err)
                res.send(docs);
            else
                console.log(err);
        });
});

// Like Post
router.put('/:id/like', auth, async(req, res) => {
    if(!req.userId)
        return res.json({message: "Cannot retrieve user id"});
    const post = await Post.findById(req.params.id);
    const inIndex = post.likes.findIndex((id) => id == String(req.userId));
    // like
    if(inIndex == -1)
        post.likes.push(req.userId);
    // unlike
    else
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    await Post.findByIdAndUpdate(req.params.id, 
        post,
        {new: true},
        (err, docs) => {
            if (!err)
                res.send(docs);
            else
                console.log(err);
        });
})

module.exports = router;