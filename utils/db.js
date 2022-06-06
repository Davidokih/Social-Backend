const mongoose = require('mongoose');

const url = 'mongodb+srv://Davidokih:dav517id@cluster0.1nweu.mongodb.net/socialBuild?retryWrites=true&w=majority';

mongoose.connect(url).then(() => {
    console.log("connected to database");
}).catch((error) => {
    console.log(error);
});

module.exports = mongoose;