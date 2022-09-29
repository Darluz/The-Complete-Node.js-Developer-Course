// CRUD create read update delete

// NOTE: currently the database is executed locally with the command '/Users/darlu/mongodb/bin/mongod.exe --dbpath=/Users/darlu/mongodb-data'

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient // gives access necessary to use the functions to connect to the database

const { MongoClient, ObjectId } = require("mongodb"); // shorthand of the statements above using destructuring

const connectionURL = "mongodb://127.0.0.1:27017"; //the ip 127.0.0.1 is the localhost, if we use the typical url it will have unexpected results in the speed of the application (usually reducing it)
const databaseName = "task-manager";

// const id = new ObjectId(); // this will allow us to generate new IDs
// console.log(id);
// console.log(id.toString()); // getting the id string
// console.log(id.toHexString()); // is the same as toString, the method was a component of the deprecated ObjectID
// console.log(id.getTimestamp()); // getting the related timestamp

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    // setting up the connection // the default parser is being deprecated, that is why we set up the other one // the last argument is a function that it will be executed when the connection is completed
    if (error) {
      return console.log("Unable to connect to database!");
    }

    const db = client.db(databaseName); // creating a db instance

    db.collection('users').insertOne({// inserting one single element in the collection users which don't exist and will be created
        _id: id, // inserting the new id created
        name: 'Vikram',
        age: 26
    }).then(result => console.log(result),error => console.log('Unable to insert user.'))

    db.collection('users').insertMany([ // inserting multiple documents
        {
            name: 'Jen',
            age: 28
        },
        {
            name: 'Gunther',
            age: 29
        }
    ]).then(result => console.log(result),error => console.log('Unable to insert user.'));

    db.collection('tasks').insertMany([ // inserting multiple documents
        {
            description: 'Clean the house',
            completed: true
        },
        {
            description: 'Renew inspection',
            completed: false
        },
        {
            description: 'Pot plants',
            completed: false
        }
    ]).then(result => console.log(result),error => console.log('Unable to insert user.'));

    db.collection('users').findOne({ _id: new ObjectId("632f233f5d30116899226f53"), name: 'Jen' }).then(result => console.log(result),error => console.log('Unable to fetch user.'));
    // method to find an unique user, if nothing is find we obtain null // If we want to search by id, we will need to send an ObjectId

    db.collection('users').find({ age: 27 }).toArray();
    // the method returns cursors, which are a pointers to the database document, toArray method organize everything in an array object

    db.collection('users').find({ age: 27 }).countDocuments().then(result => console.log(result),error => console.log('Unable to insert user.')); // the method provides the number of documents

    const updatePromise = db.collection("users").updateOne( // method use to update a single document
      {
        // this is a filter object as first parameter which contains the criteria to find the document
        _id: new ObjectId("632f233f5d30116899226f53"),
      },
      {
        // here we define an object with behavior operators that points what we want to do
        $set: {
          // $set allows us to set new values in the existent fields
          name: "Pepe", // it will impact only the name field, not the others
        },
        $inc:{
            age: 1 // we could use -1 to decrement the value in 1
        }
      }
    );

    updatePromise
      .then((result) => console.log(result))
         .catch((error) => console.log(error));

    db.collection("tasks").updateMany({ // method that allows the modification of multiple documents
        completed: false // searches all documents with completed in false
    },
    {
        $set: {
            completed: true // change them to true
        }
    }).then((result) => console.log(result.modifiedCount)) // property that shows the number of documents modified
           .catch((error) => console.log(error));

    db.collection("users").deleteMany({ // deleting many documents
        age: 27
    }).then((result) => console.log(result))
        .catch((error) => console.log(error));
});
