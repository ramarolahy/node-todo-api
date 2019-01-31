//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
// We can have mongodb help us create unique 12byte IDs
// const myID =  new ObjectID();
// console.log(myID);



// In a production example the url might be a aws url or a heroku url. 
// In our case it will be the localhost url
const url = 'mongodb://localhost:27017/TodoApp';
// Database name
const dbName = "TodoApp";
// Connect using MongoClient
MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
    if(err) {
        // Stop the program if there is an error
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB.');
    
    const col = client.db("TodoApp").collection('Todos');

    // find() returns a mongodb cursor
    // toArray() returns a promise
    // col.find({completed: false}).toArray().then( docs => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, err => {
    //     console.log("Unable to fetch todos", err)
    // })

    // count() also returns a promise: http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#count
    col.find({completed: false}).count().then( count => {
        console.log(`Todos count: ${count}`);
    }, err => {
        console.log("Unable to fetch todos", err)
    })

    //client.close();
})

