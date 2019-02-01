const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// To learn about queries
// Read https://mongoosejs.com/docs/queries.html

const id = '5c54920ec61681c5404bf1a5';
const fakeID = '6c54920ec61681c5404bf1a5';
const invalidID = '5c54920ec61681c5404bf1a51';

// I tried putting this inside then() but the
if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}
// Query using specific id using find()
// find() will return an array. If the id is not found then array will be empty
Todo.find({
    _id: id // Mongoose will covert id to an ObjectID
}).then( todos => {
    console.log('Todos: ', todos)
});

// findOne() returns the first instance found.
// it will return the object itself. or NULL if id not found. Better choice if looking for one entry only by 
// something other than ID and deal with null accordingly
Todo.findOne({
    _id: id // Mongoose will covert id to an ObjectID
}).then( todo => {

    if(!todo) {
        return console.log('ID not found')
    }
    console.log('Todo: ', todo)
});

// also returns the object. Recommended if looking of entry by id
Todo.findById(id).then( todo => {
    if(!todo) {
        return console.log('ID not found')
    }
    console.log('Todo by ID: ', todo)
}).catch( err => console.log(err) );

User.findById('5c53680d137094a125d5de27').then( user => {
    if(!user) {
        return console.log('User not found')
    }
    console.log(JSON.stringify(user, undefined, 2))
}).catch( err => console.log(err) );


