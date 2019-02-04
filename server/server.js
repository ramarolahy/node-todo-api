// Vendor imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');

//Local
const config = require('./config/config');
const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');

const app = express();
// Set up port to allow heroku to set up env
const port = process.env.PORT;


//Middleware setup: https://www.npmjs.com/package/body-parser 
app.use(bodyParser.json());
// Setting up a route to post todos
app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({
            todos
        }); // Using todo as object will give us flexibility to add other fields/params later
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
    if (!ObjectID.isValid(id)) {
        res.status(404).send() // Insert awesome error message handling inside send
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        }) // Using todo as object will give us flexibility to add other fields/params later
    }).catch(err => res.status(400).send()); // Insert awesome error message handling inside send

});

app.delete('/todos/:id', (req, res) => {
    // get the id
    const id = req.params.id;
    //validate id
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    Todo.findByIdAndDelete(id).then(todo => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({
            todo
        })
    }).catch(err => res.status(400).send());
})

app.patch('/todos/:id', (req, res) => {
    // get id
    const id = req.params.id;
    // get body
    // _.pick will allow us to restrict the user from modifying/adding unwanted properties
    // We don't want the user to update id or completedAt.
    // see https://lodash.com/docs/4.17.11#pick 
    const body = _.pick(req.body, ['text', 'completed'])

    //validate id
    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }
    // If user updates complete and is a boolean
    //
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // Update the db by using mongodb operators. Mongoose use new: instead of returnOriginal
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate 
    Todo.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch(err => {
        res.status(400).send();
    })

})



app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
})


module.exports = {
    app
};