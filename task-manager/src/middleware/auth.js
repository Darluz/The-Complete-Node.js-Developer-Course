const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', ''); // getting the json web token (in postman the token is in Headers, key 'Authorization' and value 'Bearer "jwt"')
        const decoded = jwt.verify(token, 'thisismynewcourse'); // it will check if the token expire and if it is valid
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); // the 2nd element tells that we are looking for a user with a specific token inside the user's token array

        if(!user) throw new Error();

        req.token = token;
        req.user = user; // we are sending the user on the request to the next middleware or router for better efficiency
        next()
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.'});
    }
}

module.exports = auth;