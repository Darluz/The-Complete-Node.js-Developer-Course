const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // setting the type stored in owner to ObjectId
        required: true,
        ref: 'User' // User as the model's name, this ref allows us to reach the entire user profile with populate function 
    }
})

module.exports = Task;