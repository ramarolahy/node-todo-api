const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
    // Valid user
    _id: userOneID,
    firstname: 'Ram',
    email: 'ram@email.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'addSomeSalt').toString()
    }]
}, {
    // Invalid user
    _id: userTwoID,
    firstname: 'Jane',
    email: 'jane@email.com',
    password: 'userTwoPass',
}
]
const todos = [{
    _id: new ObjectID(),
    text: "First GET test todo",
    completed: false,
    completedAt: 20171021
}, {
    _id: new ObjectID(),
    text: 'Second GET test todo',
    completed: true,
    completedAt: 2010
}]

const populateTodos = done => {
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
};

const populateUsers = done => {
    User.deleteMany().then(() => {
        // We will need to run the middleware to hash the pwds before saving the users
        // so instead of using insertMany(), we will save() them one at a time. save() has
        // the middleware set up in user.js
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        // The Promise.all() method returns a single Promise that resolves when all of the promises passed as an iterable have resolved or when the iterable contains no promises. It rejects with the reason of the first promise that rejects.
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

// Export todos array to use in the test file
module.exports = {todos, populateTodos, users, populateUsers};