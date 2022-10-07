require("../src/db/mongooseExample");
const User = require("../src/models/user");

// EXAMPLE OF PROMISE CHAINING

User.findByIdAndUpdate("633e443f07b24e3b0786f09d", { age: 1 })
  .then((user) => {
    // updating the matching document, age will be = 1
    console.log(user); // it will return the document before the update
    return User.countDocuments({ age: 1 }); // checking the number of documents with age = 1
  })
  .then((result) => console.log(result))
  .catch((e) => console.log(e));

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("633e443f07b24e3b0786f09d", 2).then( count => console.log(count));