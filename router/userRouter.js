const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');

const {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    verifiedUser,
    signinUser
} = require('../controller/userController');

router.route('/').get(getUsers);

router.route('/register').post(upload, createUser);
router.route('/signin').post(signinUser);
router.route('/token/:id/:token').get(verifiedUser);

router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;