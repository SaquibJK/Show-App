const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");

const usersSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true
    },
    pic: {
        type: String
    }
})

usersSchema.plugin(findOrCreate);

module.exports = new mongoose.model("User", usersSchema);