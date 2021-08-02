/*
    Post model
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {
        type: String,
        required: true,
    },
    authorId: { 
        type: String,
        required: true,
    },
    body: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    likes: {
        type: [String],
        default: [],
    },
    date: {
        type: Date,
        default: new Date(),
    },
});

module.exports = Post = mongoose.model('Posts', postSchema);