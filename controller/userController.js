const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: "outlook",
    auth: {
        user: "birthofunicorns@outlook.com",
        pass: "dav517id"
    }
});

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const getUser = async (req, res) => {
    try {
        const users = await userModel.findById(req.params.id);


        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const users = await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { fullName, userName } = req.body;
        const findUser = await userModel.findById(req.params.id);

        if (findUser) {
            await cloudinary.uploader.destroy(findUser.avatarID);
            const image = await cloudinary.uploader.upload(req.file.path);
            const user = await userModel.findByIdAndUpdate(req.params.id, {
                fullName,
                userName,
                avatar: image.secure_url,
                avatarID: image.public_id
            }, { new: true });
            res.status(200).json({
                status: 'success',
                data: user
            });
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const image = await cloudinary.uploader.upload(req.file.path);

        const getToken = crypto.randomBytes(32).toString("hex");
        const token = jwt.sign({ getToken }, "This_isTheSEcreT", {
            expiresIn: "20m",
        });

        const user = await userModel.create({
            fullName,
            userName,
            email,
            password: hashed,
            avatar: image.secure_url,
            avatarID: image.public_id,
            verifiedToken: token,
        });

        const testURL = "http://localhost:3000";
        const mainURL = "https://social-frontend22.herokuapp.com";

        const mailOptions = {
            from: "birthofunicorns@outlook.com",
            to: email,
            subject: "Account Verification",
            html: `<h2>
            This is to verify your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to Continue</a>
            </h2>`,
        };

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Mail sent: ", info.response);
            }
        });

        res.status(201).json({ message: "Check you email...!" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


const verifiedUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (user) {
            if (user.verifiedToken !== "") {
                await userModel.findByIdAndUpdate(req.params.id, {
                    isVerified: true,
                    verifiedToken: ""
                }, { new: true });
            } else {
                res.status(404).json({
                    message: 'Your account is already verified'
                });
            }
        } else {
            res.status(404).json({
                message: 'User not found'
            });
        }
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (user) {
            const check = await bcrypt.compare(password, user.password);

            if (check) {
                if (user.isVerified && user.verifiedToken === "") {
                    const token = jwt.sign(
                        {
                            _id: user._id,
                            isVerified: user.isVerified,
                        },
                        "This_isTheSEcreT",
                        { expiresIn: "2d" }
                    );

                    const { password, ...info } = user._doc;

                    res.status(201).json({
                        message: `welcome ${user.fullName}`,
                        data: { token, ...info },
                    });
                } else {
                    const getToken = crypto.randomBytes(32).toString("hex");
                    const token = jwt.sign({ getToken }, "This_isTheSEcreT", {
                        expiresIn: "20m",
                    });

                    const testURL = "http://localhost:3000";
                    const mainURL = "https://social-frontend23.herokuapp.com";

                    const mailOptions = {
                        from: "birthofunicorns@outlook.com",
                        to: email,
                        subject: "Account Verification",
                        html: `<h2>
            This is to verify your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to Continue</a>
            </h2>`,
                    };

                    transport.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log(err.message);
                        } else {
                            console.log("Mail sent: ", info.response);
                        }
                    });

                    res.status(201).json({ message: "Check you email...!" });
                }
            } else {
                res.status(404).json({ message: "password is incorrect" });
            }
        } else {
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            if (user.isVerified && user.verifiedToken === "") {
                const getToken = crypto.randomBytes(32).toString("hex");
                const token = jwt.sign({ getToken }, "This_isTheSEcreT", {
                    expiresIn: "10m",
                });

                const testURL = "http://localhost:3000";
                const mainURL = "https://social-frontend22.herokuapp.com";

                const mailOptions = {
                    from: "projectcomsol@outlook.com",
                    to: email,
                    subject: "Reset Password Request",
                    html: `<h2>
            This is a Reset Password Request for your account, Please use this <a
            href="${testURL}/api/user/token/${user._id}/${token}"
            >Link to complete the process</a>
            </h2>`,
                };

                transport.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        console.log("Mail sent: ", info.response);
                    }
                });

                res.status(201).json({ message: "Check you email...!" });
            } else {
                res.status(404).json({ message: "cannot perform this Operation" });
            }
        } else {
            res.status(404).json({ message: "cannot find Email" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    createUser,
    verifiedUser,
    signinUser,
    forgetPassword
};