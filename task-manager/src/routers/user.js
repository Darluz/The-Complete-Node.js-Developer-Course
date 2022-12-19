const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth'); // middleware function created for authentication in the middleware folder (we created it)
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token }); // setting a created status, 'send' method stringify objects
    } catch (error) {
        res.status(400).send(error); // setting a bad request status
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password); // method created by us in models
        const token = await user.generateAuthToken(); // method created by us in models
        res.send({user, token}); // sending both the user information and the token created, 'send' method stringify objects
    } catch (error) {
        res.status(400).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send(); // 'send' method stringify objects
    } catch (error) {
        res.status(500).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
        await req.user.save();

        res.send(); // 'send' method stringify objects
    } catch (error) {
        res.status(500).send();
    }
})

router.get('/users/me', auth ,async (req, res) => { // the second argument is the middleware function to run before the function (3rd arg)
        res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})

    try {
        updates.forEach(update => req.user[update] = req.body[update]);

        await req.user.save();

        // The following line was replace by the previous code in order to make use of the middleware configure previous to any save() in user schema
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}); // new: let the function return the user after the update || runValidators: validates the data that the user is trying to insert

        res.send(req.user); // 'send' method stringify objects
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/me', auth ,async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user); // 'send' method stringify objects
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;