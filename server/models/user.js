const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create User schema
const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User};