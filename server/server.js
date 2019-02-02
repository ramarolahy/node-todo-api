// Vendor imports;
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//Local
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
// Set up port to allow heroku to set up env
const port = process.env.PORT || 3000;


//Middleware setup: https://www.npmjs.com/package/body-parser 
app.use(bodyParser.json());
// Setting up a route to post todos
app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then( doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then( todos => {
        res.send({todos}); // Using todo as object will give us flexibility to add other fields/params later
    }, err => {
        res.status(400).send(err);
    });
});

// Getting an individual resource
app.get('/todos/:id', (req, res) => {
    // testing :id param with Postman
    //res.send(req.params);

    const id = req.params.id;
    // Validate id using isValid()
    if(!ObjectID.isValid(id)) {
        res.status(404).send() // Insert awesome error message handling inside send
    }

    Todo.findById(id).then(todo => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo}) // Using todo as object will give us flexibility to add other fields/params later
    }).catch( err => res.status(400).send()); // Insert awesome error message handling inside send

});

app.delete('/todos/:id', (req, res) => {
    // get the id
    const id = req.params.id;
    //validate id
    if(!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    Todo.findByIdAndDelete(id).then(todo => {
        if(!todo) {
            return res.status(404).send()
        }
        res.send({todo})
    }).catch (err => res.status(400).send());
})

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})


module.exports = {app};