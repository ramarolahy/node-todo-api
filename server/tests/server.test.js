const expect = require('expect');
const request = require('supertest');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

// Delete every todos before each tests so we only insert 1 for test purpose
beforeEach(done => {
    Todo.deleteMany().then(() => done());
});

describe('POST /todos', () => {
    it('Should create a new todo', done => {
        const text = 'Test todo text';

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

                Todo.find().then(todos => {
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
                    expect(todos.length).toBe(0);
                    // End async testing
                    done();
                }).catch(err => done(err));
            });
    })
})