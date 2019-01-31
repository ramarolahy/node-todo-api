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
    
    // Create a collection we want to drop later
    const col = client.db("TodoApp").collection('Users');
    // Insert or first field
    col.insertOne({
        firstname: "Anna",
        lastname: "smith",
        deleted: false
    }, (err, result) => {
        if(err) {
            return console.log("Unable to add User", err);
        }
        // ops is going to store all docs inserted
        //console.log(JSON.stringify(result.ops, undefined, 2));
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp()))
        // MongoDB will assign a 12 byte [4 byte timestamp, 3 byte machine id, 2 byte process id, 3 byte counter]  unique ID _id in order to scale easier.
        // You can assign your own id by adding _id as a field.
    });

    client.close();
})

