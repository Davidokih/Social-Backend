const userModel = require('../model/userModel');
const postModel = require('../model/postModel');
const mongoose = require('mongoose');
const cloudinary = require('../utils/cloudinary');


const createPost = async (req, res) => {
    try {
        const { message } = req.body;
        const image = await cloudinary.uploader.upload(req.file.path);

        const getUser = await userModel.findById(req.params.id);
        const postContent = await postModel.create({
            message,
            avatar: image.secure_url,
            avatar: image.public_id,
        });

        postContent.user = getUser;
        postContent.save();

        getUser.post.push(mongoose.Types.ObjectId(postContent._id));
        getUser.save();

        res.status(201).json({
            status: 'success',
            data: postContent
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const viewPosts = async (req, res) => {
    try {
        const postContent = await postModel.find();

        res.status(201).json({
            status: 'success',
            data: postContent
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const viewPost = async (req, res) => {
    try {
        const postContent = await postModel.findById(req.params.post);

        res.status(201).json({
            status: 'success',
            data: postContent
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const deletePost = async (req, res) => {
    try {
        const postData = await userModel.findById(req.params.id);
        const remove = await postModel.findByIdAndRemove(req.params.post);

        postData.posts.pull(remove);
        postData.save();

        res.status(201).json({
            status: 'success',
            data: postData
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    viewPost,
    deletePost,
    viewPosts
};