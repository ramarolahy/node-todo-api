const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');

const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

const supertest = request(app);

// Adding seed data
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

// Delete every todos before each tests so we only insert 1 for test purpose
beforeEach(done => {
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});
//============================================
//============================================
// Testing POST
describe('POST /todos', () => {
    it('Should create a new todo', done => {
        const text ='Third GET test todo';

        supertest
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should not create todo with invalid body data', done => {

        supertest
            .post('/todos')
            .send({})
            .expect(400) // Response should be bad request
            .end((err, res) => {
                // Handle potential errors
                if (err) {
                    // End Async test if there is error
                    return done(err);
                }

                // Mke sure no todo was created
                Todo.find().then(todos => {
                    // There should be 2 seed data
                    expect(todos.length).toBe(2);
                    // End async testing
                    done();
                }).catch(err => done(err));
            });
    });
});
//============================================
//============================================
// Testing GET
describe('GET /todos', () => {
    it('Should get all todos', done => {
        supertest
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    });
});
//============================================
//Testing GET by id
describe('GET /todos/:id', () => {
    //Testing for valid id
    it('Should return todo doc', done => {
        supertest
            .get(`/todos/${todos[0]._id.toHexString()}`) // toHexString() converts ObjectID into a string
            .expect(200)
            .expect(res => {
                //console.log(res.body.todo) // returns the object
                expect(res.body.todo.text).toBe(todos[0].text);

            })
            .end(done)
    });

    // Testing for _id not found (valid)
    it('Should return 404 if todo not found', done => {
        const _idNotFound = new ObjectID().toHexString();

        supertest
            .get(`/todos/${_idNotFound}`)
            .expect(404)
            .end(done)
    })

    // Testing for invalid id
    const _idInvalid = '5c54920e';

    it('Should return 404 for non-object ids', done => {
        supertest
            .get(`/todos/${_idInvalid}`)
            .expect(404)
            .end(done)
    });
});
//============================================
//============================================
// Testing DELETE by id
describe('DELETE /todos/:id', () => {
    const hexID = todos[1]._id.toHexString();
    // Test for valid id
    it('Should delete todo', done => {
        supertest
            .delete(`/todos/${hexID}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexID) // Check if the todo returned is what we wanted to delete
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(hexID).then(todo => {
                    expect(todo).toBeFalsy(); // Check that it is null
                    done()
                }).catch(err => done(err));
            })
    })

    it('Should return 404 if todo not found', done => {
        const _idNotFound = new ObjectID().toHexString();

        supertest
            .delete(`/todos/${_idNotFound}`)
            .expect(404)
            .end(done)
    })

    // Testing for invalid id
    const _idInvalid = '5c54920e';

    it('Should return 404 for non-object ids', done => {
        supertest
            .delete(`/todos/${_idInvalid}`)
            .expect(404)
            .end(done)
    });
})
//============================================
//============================================
// Testing PATCH by id
describe('PATCH /todos/:id', () => {
    it('Should update todo', done => {
        // Get the id
        const hexID = todos[1]._id.toHexString();
        const newBody = {
            text: "Test PATCH text",
            completed: true
        }
        supertest
            .patch(`/todos/${hexID}`)
            .send(newBody)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexID);
                expect(res.body.todo.text).toBe(newBody.text);
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.completedAt).toBeTruthy(); // This should test for a number or better a Date 
            })
            .end(done);
    })

    it('Should clear completedAt when to do not completed', done => {
        // Get the id.
        const hexID = todos[1]._id.toHexString();
        const newBody = {
            text: "Test PATCH text",
            completed: false
        }
        supertest
            .patch(`/todos/${hexID}`)
            .send(newBody)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexID);
                expect(res.body.todo.text).toBe(newBody.text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done);
    })

})