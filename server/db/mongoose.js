const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp';
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || url, {useNewUrlParser: true});
// Verify connection
const db = mongoose.connection;
const Schema = mongoose.Schema;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('We are connected'));


module.exports = {mongoose};