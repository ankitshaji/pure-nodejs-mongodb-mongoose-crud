//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose module

// *******************************************
// CONNECT - nodeJS runtime app connects to default mogod server port + creates db
// *******************************************
//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
mongoose
  .connect("mongodb://localhost:27017/shopdb", {
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
//Dont need to nest code inside callback - Operation Buffering
//mongoose lets us use models immediately,without wainting
//for mongoose to eastablish a connection to MongoDB

// *******************************************
// MODEL SETUP
// *******************************************
//blueprint of a single document in products collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating productSchemaInstanceObject - with new keyword and schemaClassObject constructor method

//setting validtaions/constraints in objectArgument - longhand way
//name is required, passed value will be attempted to be turned to required type else error
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, require: true },
});
//creating productClassObject ie(Model) - represents a collection (products)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const Product = mongoose.model("Product", productSchema);

// *******************************************
//CREATE - creating a single new document for the collection
// *******************************************
//modelClass
//productClassObject(objectArgument-passed to constructor method)
//objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
//objectArgument has validations/contraints set by collectionSchemaInstanceObject
//validations/contraints - cannot ommit name property, price gets converted to type number, addtional key:values get neglected(no error)
//create modelInstanceObject - with new keyword and productClassObject constructor method
const bike = new Product({
  name: "Road Bike",
  price: "599",
  addtion: "value",
});
//modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
//creates (products)collection in (shopdb)db and adds (bike)document into the (products)collection
bike
  .save()
  .then((data) => {
    console.log("promise resolved(dataObject)");
    console.log(data); //jsObject of created document
  })
  .catch((err) => {
    //breaking validation/contraints causes promiseObjec to be rejected(errObject)
    console.log("promise rejected(errObject)");
    console.log(err.errors.name.properties.message);
  });
