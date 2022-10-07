require('../src/db/mongooseExample');
let Task = require('../src/models/task');

Task.findByIdAndDelete('633e44351ae03cbcee7a4ab0')
    .then(task => {
        console.log(task)
        return Task.countDocuments({ completed: false});
    })
    .then(result => console.log(result))
    .catch(error => console.log(error));


const deleteTaskAndCount = async (id) => {
    await Task.findByIdAndDelete(id);
    let count = await Task.countDocuments({completed: false});
    return count;
}

deleteTaskAndCount('633e44351ae03cbcee7a4ab0')
    .then(count => console.log(count))
    .catch(error => console.log(error));