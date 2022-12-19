const mongoose = require('mongoose');
const validator = require('validator'); // npm i validator for better validation of inputs (used on email)
const bcrypt = require('bcryptjs'); // password hashing function
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({ // defining a schema, for better validation of the input through the use of middleware
    name: { // here we start to set up fields as properties of this object
        type: String, // setting mandatory type string for the field name
        required: true, // making the name NOT optional
        trim: true // (SANITIZATION) One of the options to sanitize our input data before it is save
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')) throw new Error('The password can not contain the word password');
        }
    } ,
    age: {
        type: Number,
        default: 0, // giving a default value if nothing is inserted
        validate(value) { // this sets a validator for age, which catches age values that are less than 0 but does not require it
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        unique: true, // it creates an index to guarantee uniqueness
        required: true,
        trim: true, // sanitization
        lowercase: true, // sanitization
        validate(value){
            if(!validator.isEmail(value)){ // using validator package function to validate email
                throw new Error('Email is invalid');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('tasks', { // is virtual because we are not changing what we store for the user document, is just a way to tell mongoose how this things are related
    ref: 'Task', // the difference with the ref of owner in the task model is that this is not stored in the db
    localField: '_id', // localField user's id is related to the foreignField
    foreignField: 'owner' // task's field in the relation
}) 

userSchema.methods.toJSON = function () { // this method overrides the typical json response and we define what properties we want to show
    const user = this;
    const userObject = user.toObject(); // allows the modification of user data

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() { // methods differs from statistic (used in the function below) because its use is concentrated in instances and individual entities 
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse', { expiresIn: "10 days" }); // it returns the authentication token, the first argument that the token will contain to identify the user and the second argument is the secret which shows if the token has been tampered
    
    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => { // by setting up a value on schema statics, we will be able to access the method directly on the model whenever we want
    const user = await User.findOne({ email });

    if(!user) throw new Error('Unable to login');

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) throw new Error('Unable to login');

    return user;
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next){ // pre is a method for defining something that occurs before an event like validation or saving (specified in the first argument)
    // the second argument is a function to run after, it cannot be arrow function because it does not bind with 'this'
    const user = this; // this gives us access to the individual user that is about to be saved
    
    if (user.isModified('password')) { // checking if the password is being modified
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); // here we indicate that we are done
}) 

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;

    Task.deleteMany({ owner: user._id });

    next();
})

const User = mongoose.model('User', userSchema) // difference between model and schema https://stackoverflow.com/questions/22950282/mongoose-schema-vs-model#:~:text=A%20schema%20is%20fundamentally%20describing,compiled%20version%20of%20the%20schema.

module.exports = User;