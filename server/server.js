// Vendor imports;
const express = require('express');
const bodyParser = require('body-parser');

//Local
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
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
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then( todos => {
        res.send({todos})
    }, err => {
        res.status(400).send(err);
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000.');
})


module.exports = {app};