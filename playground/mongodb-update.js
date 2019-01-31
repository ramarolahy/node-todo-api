//const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');
// We can have mongodb help us create unique 12byte IDs
// const myID =  new ObjectID();
// console.log(myID);



// In a production example the url might be a aws url or a heroku url. 
// In our case it will be the localhost url
const url = 'mongodb://localhost:27017/TodoApp';
// Database name
const dbName = "TodoApp";
// Connect using MongoClient
MongoClient.connect(url, {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        // Stop the program if there is an error
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB.');

    const col = client.db("TodoApp").collection('Todos');

    col.findOneAndUpdate({
        _id: new ObjectID("5c5240ca320c1988f42bce51"),
    }, {
        // Use mongodb update operators
        $set: { completed: true}
    }, {
        returnOriginal: false
    }).then( result => {
        console.log(result);
    })

    //client.close();
})