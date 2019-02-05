const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Create User schema
// schemas will use validators for emails: see https://www.npmjs.com/package/validator 
const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{value} is not a valid email.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
        // Set password requirements?
    },

    // Read about token-based authorization here: https://appdividend.com/2018/02/07/node-js-jwt-authentication-tutorial-scratch/ 
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// The following methods need the 'this' binding
//=======================================================
// Override a method so we can leave off password and token to be sent back to client
UserSchema.methods.toJSON = function () {
    const user = this; // We use user because this will be an instance method
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

// .methods turns methods into an instance method
UserSchema.methods.generateAuthToken = function () {
    const user =  this; // We use user because this will be an instance method
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'addSomeSalt').toString();

    //user.tokens.push({access, token});
    // Try this one if .push() runs into issues
    user.tokens =  user.tokens.concat([{access, token}]);

    // To allow server.js to chain on to the promise, we will return this promise (returning another promise here is fine since token is a value, this is legal)
    // See https://javascript.info/promise-chaining for promise-chaining
    return user.save().then(() => {
        // this will be passed on to another promise in server.js
        return token;
    })
};
// .statics turns methods into a model method
UserSchema.statics.findByToken = function (token) {
    const User = this; // We use User because this will be a model method
    let decoded;

    try {
        decoded = jwt.verify(token, 'addSomeSalt')
    } catch (err) {
        // return new Promise( (resolve, reject) => {
        //     reject();
        // })
        return Promise.reject();  // Same thing bu simpler
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token, // Using quotes allow to query a nested document
        'tokens.access': 'auth'
    })

};

const User = mongoose.model('User', UserSchema);

module.exports = {User};