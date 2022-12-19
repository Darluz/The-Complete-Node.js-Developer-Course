const express = require('express');
require('./db/mongooseExample'); // getting the mongo connection
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()) // customizing our server, in this case we call .json to parse the incoming json to objects that we can access
app.use(userRouter); // We define a router for users, which is an object with several routes inserted on it. Here we indicate to server that it needs to held the routes contained 
app.use(taskRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

const Task = require('./models/task');
const User = require('./models/user');

const main = async () => {
    // const task = await Task.findById('634d5c7e8b04792f5a761fd2');
    // await task.populate('owner');
    // console.log(task.owner);

    const user = await User.findById('6344c2bfc3e47c46455a0c7a');
    await user.populate('tasks');
    console.log(user.tasks);
}

main();