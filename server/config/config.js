const env = process.env.NODE_ENV || 'development';
console.log('env ******** ', env);
// Switch db based on the environment
// For heroku, env is set to production so this will not matter
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}