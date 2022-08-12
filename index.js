//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module

//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
//nodeJS runtime app connects to default mogod server port + creates db
mongoose
  .connect("mongodb://localhost:27017/moviesdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //promisObject resolved
    console.log("Connection Open");
  })
  .catch((err) => {
    //promisObject rejected
    console.log("Error has occured");
    console.log(err);
  });
//OR
//could use asyn function -(returns promiseObject-(fullfilled,undefied(unless returned)) and (rejected,errorValue) on throw error
//await the promiseObject-pending to resolved() in try block and catch error if it throws error or is rejected
//also instead of catch with try, we can .catch() on async function exectution to catch rejected or throw error promiseObject

//blueprint of a single document in movies collection -
//mongooseObject.schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating object instance - with new keyword and schemaClassObject constructor method
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

//creating movieClassObject ie(Model) - represents a collection (movies)
//mongooseObject.method("collectionNameSingular",collectionSchema)
const Movie = mongoose.model("Movie", movieSchema);

//creating a new document for the collection
//movieClassObject(objectArgument-passed to constructor method)
//objectArgument- the new document ie {key:value}
//create object instance - with new keyword and movieClassObject constructor method
const amadeus = new Movie({
  title: "Amadeus",
  year: 1986,
  score: 9.2,
  rating: "R",
});
amadeus.score = 9.9; //update modelObject.property value
console.dir(amadeus); //modelObject

//inserting the modelObject(amadeus) ie document into the collection(movies)
//creates the collection if not already existing
amadeus.save(); //returns promiseObject - pending to resolved or rejected

//Other info -
//node - opens repl
//.load index.js - run file in repl
