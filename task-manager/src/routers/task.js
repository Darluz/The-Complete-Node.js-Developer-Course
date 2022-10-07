const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks)
    } catch (error) {
        res.status(500).send(); // we don't need to send anything back
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id; // accessing the route parameters, in this case we are looking for the dynamic value id
    try {
        const task = await Task.findById(_id);
        if(!task) { // checking if mongoose didn't find anything, which translates in a 200 code that we don't want to send
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}); // new: let the function return the user after the update || runValidators: validates the data that the user is trying to insert

        if(!task) return res.status(404).send();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
    
        if (!task) return res.status(404).send();
    
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;