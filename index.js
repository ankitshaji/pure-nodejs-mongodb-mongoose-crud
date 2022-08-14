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
///cannot ommit name property, price gets converted to type number, addtional key:values get neglected(no error)
//default gets set if property not passed in,name maxlength,price min val 0,categories:array of strings(converts numbers)(default array has one string),
//setting validations/contraints for properties inside type:Object - default if ommited
//custome error messages -eg  min:[0,"The price needs to be postive number"],setting (atomicValue)customEnumType with pre fixed values size needs to use eg.(booleanEnumType takes true,false)
//but here enum validator is of type string array with pre fixed values size needs to use
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 20 },
  price: { type: Number, require: true, min: 0 },
  onSale: { type: Boolean, default: false },
  categories: { type: [String], default: ["Cycling"] },
  qty: {
    online: { type: Number, default: 0 },
    inStore: { type: Number, default: 0 },
  },
  size: {
    type: String,
    enum: ["S", "M", "L"],
  },
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
//validations/contraints -
//cannot ommit name property, price gets converted to type number, addtional key:values get neglected(no error)
//default gets set if property not passed in,name maxlength,price min val 0,categories:array of strings(converts numbers)(default array has one string),
//setting validations/contraints for properties inside type:Object - default if ommited,size property value needs to be in pre fixed enum string array values
//create modelInstanceObject - with new keyword and productClassObject constructor method
const bike = new Product({
  name: "Cycling Jersy",
  price: "60",
  categories: ["Cycling", "Safety", "35"],
  size: "M",
  additionalProp: "value",
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
    console.log(err); //check message only err.errors.name.properties.message
  });

// *******************************************
//UPDATE - querying a collection for a document/documents then updating it + can add new key:value pair
// *******************************************
//productClassObject.method(queryObject,updateObject,optionObject) ie modelClassObject.method()
//returns thenableObject + data is updated jsObject
//To run validations/contraints when updating we need to set in optionsObject
// Product.findOneAndUpdate(
//   { name: "Air Pump" },
//   { price: -10.99 },
//   { new: true, runValidators: true }
// )
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
