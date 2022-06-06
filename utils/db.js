const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.URL;

mongoose.connect(url).then(() => {
    console.log("connected to database");
}).catch((error) => {
    console.log(error);
});

module.exports = mongoose;