const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Adding seed data
const todos = [{
    _id: new ObjectID(),
    text: "First GET test todo"
}, {
    _id: new ObjectID(),
    text: 'Second GET test todo'
}]

// Delete every todos before each tests so we only insert 1 for test purpose
beforeEach(done => {
    Todo.deleteMany().then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});

describe('POST /todos', () => {
    it('Should create a new todo', done => {
        const text = 'Test todo POST';

        request(app)
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

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });

    it('Should not create todo with invalid body data', done => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400) // Response should be bad request
            .end( (err, res) => {
                // Handle potential errors
                if(err) {
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

describe('GET /todos', () => {
    it('Should get all todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( res => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    });
});

describe('GET /todos/:id', () => {
    //Testing for valid id
    it('Should return todo doc', done => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) // toHexString() converts ObjectID into a string
            .expect(200)
            .expect( res => {
                //console.log(res.body.todo) // returns the object
                expect(res.body.todo.text).toBe(todos[0].text);
                
            })
            .end(done)
    });

    // Testing for _id not found (valid)
    

    it('Should return 404 if todo not found', done => {
        const _idNotFound = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${_idNotFound}`)
            .expect(404)
            .end(done)
    })

    // Testing for invalid id
    const _idInvalid= '5c54920e';

    it('Should return 404 for non-object ids', done => {
        request(app)
            .get(`/todos/${_idInvalid}`)
            .expect(404)
            .end(done)
    });
});