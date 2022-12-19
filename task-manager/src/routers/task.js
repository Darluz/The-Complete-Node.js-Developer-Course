const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id // creating the association between task and user, adding the id
    })

    try {
        await task.save()
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks')
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(); // we don't need to send anything back
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id; // accessing the route parameters, in this case we are looking for the dynamic value id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id }); // filtering the task by its id and the owners id, in order to only look for the task related to the logged user

        if(!task) { // checking if mongoose didn't find anything, which translates in a 200 code that we don't want to send
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) return res.status(400).send({error: 'Invalid updates!'})

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        // The following line was change to implement a possible middleware in the schema, before an action like save()
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}); // new: let the function return the user after the update || runValidators: validates the data that the user is trying to insert

        if(!task) return res.status(404).send();

        updates.forEach(update => task[update] = req.body[update]);

        await task.save();

        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    
        if (!task) return res.status(404).send();
    
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;