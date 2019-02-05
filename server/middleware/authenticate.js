const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');

    User.findByToken(token).then( user => {
        // If no user found with valid token
        if(!user) {
            return Promise.reject({
                "error": "Unauthorized access."
            });
        }
        // If user found
        req.user = user;
        req.token = token;
        next(); // Then go to the next lines of code
    }).catch( err => {
        res.status(401).send({
            "error": "Unauthorized access."
        })
    });
};

module.exports = {authenticate};