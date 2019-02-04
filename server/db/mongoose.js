const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
// Currently url is used for both development and testing. We need to set up a local env for testing so
// we don't have to clear the db every single time
// See server.js


// Verify connection
const db = mongoose.connection;
const Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We are connected'));


module.exports = {mongoose};