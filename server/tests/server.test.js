const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// Adding seed data
const todos = [{
    text: "First GET test todo"
}, {
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
    })
})