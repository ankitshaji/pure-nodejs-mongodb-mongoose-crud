//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module

// *******************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// *******************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
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

// *******************************************
// MODEL SETUP
// *******************************************
//blueprint of a single document in movies collection -
//mongooseObject.schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating movieSchemaInstanceObject - with new keyword and schemaClassObject constructor method
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});
//creating movieClassObject ie(Model) - represents a collection (movies)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const Movie = mongoose.model("Movie", movieSchema);

// *******************************************
//MongoDB CRUD Operations using mongoose-ODM (modelClassObject)-
// *******************************************

// *******************************************
//CREATE - creating a single new document for the collection
// *******************************************
//movieClassObject(objectArgument-passed to constructor method)
//objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
//create modelInstanceObject - with new keyword and movieClassObject constructor method
// const amadeus = new Movie({
//   title: "Amadeus",
//   year: 1986,
//   score: 9.2,
//   rating: "R",
// });
// amadeus.score = 9.9; //update modelObject.property value
// console.dir(amadeus); //modelObject
//inserting the modelInstanceObject(amadeus) ie document into the collection(movies)
//creates the collection if not already existing
//amadeus.save(); //returns promiseObject pending to resolve(data) or reject(data)
//same as - db.movies.insertOne({title:"Amelia"})- argument-single jsObject/json/document,method-converts jsObject/json/doscument to BSON + auto create id

// *******************************************
//CREATE - creating mutiple new documents for the collection - dont usually use
// *******************************************
//creates the collection if not already existing
//movieClassObject.method(array of jsObjects) - modelClassObject.method() - returns promiseObject pending to resolve(data) or reject(data) //do not need to modelObject.save()
// Movie.insertMany([
//   { title: "Amelia", year: 2001, score: 8.3, rating: "R" },
//   { title: "Alien", year: 1979, score: 8.1, rating: "R" },
//   { title: "The Iron Giant", year: 1999, score: 7.5, rating: "PG" },
//   { title: "Stand By Me", year: 1986, score: 8.6, rating: "R" },
//   { title: "Moonrise Kingdom", year: 2012, score: 7.3, rating: "PG-13" },
// ]).then((data) => {
//   console.log(
//     "promiseObject resolved - Inserted documents to movies collection"
//   );
//   console.log(data);
// });
//same as - db.movies.insertMany([{title:"Amelia"},{title:"Alien"}])- argument-array of jsObjects/jsons/documents,method-converts jsObjects/jsons/doscuments to BSON + auto create id

// *******************************************
//READ - querying a collection for a document/documents
// *******************************************
//movieClassObject.method(queryObject) ie modelClassObject.method()

//Movie.find(queryObject) //returns thenableObject pending to resolve(data) or reject(err) //data is an array of jsObjects
//Movie.find({}).then((data)=>{console.log(data)}) //data is array of all jsObjects
//Movie.find({rating:"PG-13"}).then((data)=>{console.log(data)}) //data is array of jsObject matching queryObject
//Movie.find({year:{$gte:2015}}).then((data)=>{console.log(data)}) //data is array of jsObjects matching queryObjectWithQueryOperator
//same as - db.movies.find({title:"Amelia"})- argument-queryObject,method-returns iterable cursor(ie reference to array of jsObjects/jsons/documents)
//queryObject can contain queryOperator

//Movie.findOne(queryObject) //returns thenableObject pending to resolve(data) or reject(err) //data is an jsObject
//Movie.findOne({year:{$lte:1990}}).then((data)=>{console.log(data)}) //data is single first matching jsObject
//same as - db.movies.findOne({title:"Amelia"})- argument-queryObject,method-returns single first matching jsObject/json/document
//queryObject can contain queryOperator

//Movie.find({_id:"62f6d544bc6bbae5da202f6b"}).then((data)=>{console.log(data)})
//Movie.findOne({_id:"62f6d544bc6bbae5da202f6b"}).then((data)=>{console.log(data)})
//Movie.findById() //returns thenableObject pending to resolve(data) or reject(err) //data is an jsObject
//Movie.findById("62f6d544bc6bbae5da202f6b").then(data=>console.log(data)) //argument-idString,data is single first matching jsObject

//side note -
//callback version - Movie.find(queryObject,function(err,data){})
//promiseObject version - Movie.find(queryObject).exec();

// *******************************************
//UPDATE - querying a collection for a document/documents then updating it + can add new key:value pair
// *******************************************
//movieClassObject.method(queryObject,updateObject) ie modelClassObject.method()

//Movie.update(queryObject,updateObject) //returns thenableObject pending to resolve(message) or reject(err) //message is a jsObjects
//Movie.update({title:"Amadeus"},{year:1984}).then((message)=>{console.log(message)})-argument-queryObject,updateObject,method-updates all matching jsObject/json/document //returns thenableObject //message is jsObject
//same as - db.movies.update({title:"Amelia"},{$set:{year:1984}})- argument-queryObject,updateObjectWithUpdateOperator,method-updates all matching jsObject/json/document returns messageObject
//queryObject can contain queryOperator

//Movie.updateOne(queryObject,updateObject) //returns thenableObject pending to resolve(message) or reject(err) //message is a jsObjects
//Movie.updateOne({title:"Amadeus"},{year:1984}).then((message)=>{console.log(message)})-argument-queryObject,updateObject,method-updates single first matching jsObject/json/document //returns thenableObject //message is jsObject
//same as - db.movies.updateOne({title:"Amelia"},{$set:{year:1984}})- argument-queryObject,updateObjectWithUpdateOperator,method-updates single first matching jsObject/json/document returns messageObject
//queryObject can contain queryOperator

//Movie.updateMany(queryObjectwithQueryOperator,updateObject) ie modelClassObject.method()
//Movie.updateMany({title:{$in:["Amadeus","Stand By Me"]}},{score:10}).then((message)=>{console.log(message)})-argument-queryObjectwithQueryOperator,updateObject,method-updates all jsObject/json/document matching queryObjectwithQueryOperator //returns thenableObject //message is jsObject
//same as - db.movies.updateMany({title:{$in:["Amadeus","Stand By Me"]}},{$set:{score:10}}) - argument-queryObject,updateObjectWithUpdateOperator,method-updates all matching jsObject/json/document-returns messageObject
//queryObject can contain queryOperator

//Movie.findOneAndUpdate(queryObjectwithQueryOperator,updateObject,optionObject).then((data)=>{console.log(data)})
//argument-queryObjectwithQueryOperator,updateObject,method-updates single first matching jsObject/json/document //returns thenableObject //data is non-update single first matching jsObject/json/document unless optionObject{new:true}

// *******************************************
//DELETE - querying a collection for a document/documents then deleting it
// *******************************************
//movieClassObject.method(queryObject) ie modelClassObject.method()

//Movie.remove(queryObject) //returns thenableObject pending to resolve(message) or reject(err) //message is a jsObjects
//Movie.remove({title:"Amadeus"}).then((message)=>{console.log(message)})-argument-queryObject,method-delete all matching jsObjects/jsons/documents //returns thenableObject //message is jsObject
//same as - db.movies.remove({title:"Amelia"})-argument-queryObject,method-deletes all matching jsObject/json/document returns messageObject
//queryObject can contain queryOperator

//Movie.deleteMany({year:{$gte: 1999}}).then((message)=>{console.log(message)})-argument-queryObject,method-deletes all matching jsObjects/jsons/documents //returns thenableObject //message is jsObject
//same as - db.movies.deleteMany({year:{$gte:1999}})-argument-queryObject,method-deletes all matching jsObject/json/document returns messageObject

//Movie.findOneAndDelete({ title: "Alien" }).then((data) => {console.log(data);});-argument-queryObject,method-deletes first matching jsObject/json/document //returns thenableObject //data single first matching jsObject/json/document that was deleted

// *******************************************
//RUNNING INFO -
// *******************************************
//node - opens repl
//.load index.js - run file in repl
