const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send(user); // setting a created status
    } catch (error) {
        res.status(400).send(error); // setting a bad request status
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(); // we don't need to send anything back
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id; // accessing the route parameters, in this case we are looking for the dynamic value id
    
    try {
        const user = await User.findById(_id) // this will need an objectId value to work (a 12 digit value will work)
        if(!user) { // checking if mongoose didn't find anything, which translates in a 200 code that we don't want to send
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}); // new: let the function return the user after the update || runValidators: validates the data that the user is trying to insert

        if(!user) return res.status(404).send();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) return res.status(404).send();

        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
})

module.exports = router;