const mongoose = require('mongoose');
const validator = require('validator'); // npm i validator for better validation of inputs (used on email)

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api') // the url contains the database name at the end 'task-manager-api'

// const User = mongoose.model('User', { // defining a model, the string is the name
//     name: { // here we start to set up fields as properties of this object
//         type: String, // setting mandatory type string for the field name
//         required: true, // making the name NOT optional
//         trim: true // (SANITIZATION) One of the options to sanitize our input data before it is save
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value){
//             if(value.toLowerCase().includes('password')) throw new Error('The password can not contain the word password');
//         }
//     } ,
//     age: {
//         type: Number,
//         default: 0, // giving a default value if nothing is inserted
//         validate(value) { // this sets a validator for age, which catches age values that are less than 0 but does not require it
//             if (value < 0) {
//                 throw new Error('Age must be a positive number');
//             }
//         }
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true, // sanitization
//         lowercase: true, // sanitization
//         validate(value){
//             if(!validator.isEmail(value)){ // using validator package function to validate email
//                 throw new Error('Email is invalid');
//             }
//         }
//     }
// })

// // FIRST TRY OF INSTANTIATION OF MODEL
// const me = new User({ // creating a instance of our model
//     name: 'Andrew     ',
//     email: 'MYEMAIL@MEAD.IO',
//     password: '     xasdfasdf'
// })

// me.save().then(() => { // this method saves the data, it returns a promise 
//     console.log(me);
// }).catch(error => {
//     console.log('Error!', error);
// })

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Task({
//     description: 'Learn the Mongoose library',
//     completed: false
// })

// task.save().then(() => {
//     console.log(task)
// }).catch(error => console.log(error))