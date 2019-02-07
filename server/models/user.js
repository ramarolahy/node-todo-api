const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

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
// Find user that matches the email and password passed in
UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    // Find the user using the email provided
    // IF FOUND, compare passwords
    return User.findOne({email}).then( user => {
        if (!user) {
            return Promise.reject();
        }
        // We are going to create a new Promise where bcrypt can be called in. bcrypt can only take callbacks inside
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                //(res) ? resolve(user) : reject();
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });

        // // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
        // return bcrypt.compare(password, user.password).then( res => {
        //         res.send(user);
        //     }).catch( err => {
        //         res.status(400).send({"Error": "Bad Request."})
        //     })
    });
};

// Hashing user passwords with mongoose middleware
// with pre middleware functions, the function hash is called BEFORE save
UserSchema.pre('save', function (next) {
    const user = this;
  
    // We only want to hash string passwords, not hashed passwords (example if the user modifies their email later one)
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User};