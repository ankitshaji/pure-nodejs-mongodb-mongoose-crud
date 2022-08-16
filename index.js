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
// MODEL SETUP 1
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

// *******************************************
//adding custom methods on productSchemaInstanceObject //thus adding custom methods to model - (case1)modelInstanceObject and (case2)productClassObject(ie modelClassObject)
// *******************************************
//grouping model logic - adding custom methods to each specifc model
//usually a classObject has prototypeObject with methods available to all instanceObject through references to that prototypeObject in __proto__ property

//case 1 - adding custom methods to modelInstanceObject(ie document) / dataObject
//custome methods help easily update values in multiple modelInstanceObject(ie document) / dataObject
//productSchemaInstanceObject.property.customeMethodName
productSchema.methods.greet = function () {
  console.log("Hello");
  console.log(`- ${this.name}`); //this keyword (execution scope) left of dot modelInstanceObject / dataObject
};

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale; //this keyword (execution scope) left of dot modelInstanceObject / dataObject
  //dataObject.save()
  return this.save(); //returns promiseObject
};

//addCategory method takes argument
productSchema.methods.addCategory = function (newCat) {
  //categories is an array
  this.categories.push(newCat); //this keyword (execution scope) left of dot modelInstanceObject or dataObject
  //dataObject.save()
  return this.save(); //returns promiseObject
};

//case 2 - adding custom methods to productClassObject (ie modelClassObject)
//buit with existing model methods - fancier way to create/find/update/delete
//this keyword refers to modelClassObject //left of dot (execution scope)
//productSchemaInstanceObject.property.customeMethodName
productSchema.statics.fireSale = function () {
  //productClassObject.method(queryObject,updateObject) ie modelClassObject.method()
  return this.updateMany({}, { onSale: true, price: 0 }); //returns thenableObject
};

//creating productClassObject ie(Model) - represents a collection (products)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const Product = mongoose.model("Product", productSchema);
//makes custom methods available

// *******************************************
// MODEL SETUP 2
// *******************************************
//blueprint of a single document in persons collection -
//mongooseObject.schemaMethod = schemaClassObject(objectArgument passed to constructor method)
//objectArgument-{key:nodejs value type} for collection {keys:value}
//creating personSchemaInstanceObject - with new keyword and schemaClassObject constructor method
const personSchema = new mongoose.Schema({
  first: String,
  last: String,
});

// *******************************************
//adding virtual properties on personSchemaInstanceObject //thus adding virtual properties to model - (case1)modelInstanceObject/dataObject
// *******************************************
//grouping model logic - adding virtual properties to each specifc model
//usually a classObject sets properties for each instanceObject when creating it

//case 1 - adding virtual properties to modelInstanceObject(ie document) / dataObject
//virtuals help to add property to a model ,property dosnt exist in collection
//property is derived from collections real properties
//getter method - modelInstanceObject.property
//personSchemaInstanceObject.method(argument - "creatingPropertyName").method(argument - callback to execute for PropertyName)
personSchema.virtual("fullName").get(function () {
  return `${this.first} ${this.last}`;
});
//setter method - modelInstance.property = "Tammy Xiao" (ie v is string argument passed in)
//personSchemaInstanceObject.method(argument -"creatingPropertyName").method(argument -  callback to execute for PropertyName)
personSchema.virtual("fullName").set(function (v) {
  this.first = v.substr(0, v.indexOf(" ")); //stringObject.method(0,string.method())
  this.last = v.substr(v.indexOf(" ") + 1);
});

//creating personClassObject ie(Model) - represents a collection (people)
//mongooseObject.method("collectionNameSingular",collectionSchemaInstanceObject)
const Person = mongoose.model("Person", personSchema);
//makes virtual properties available

// *******************************************
//CREATE - creating a single new document for the collection
// *******************************************
//modelClass
//personClassObject(objectArgument-passed to constructor method)
//objectArgument- jsObject{key:value} ie the new document that abides to collectionSchemaInstanceObject
//objectArgument has validations/contraints set by collectionSchemaInstanceObject
//create modelInstanceObject(ie document) - with new keyword and productClassObject constructor method
const tammy = new Person({
  first: "Tammy",
  last: "Chow",
});
console.log(tammy.fullName);
// tammy.save() //create + save to collection //auto pluralisation of Person to people collection

// *******************************************
//READ - querying a collection for a document/documents
// *******************************************
//using - commond methods - modelInstanceObject / dataObject
//variable stored anonymous async(skips) arrow function expression returns promiseObject(pending,undefined) to promiseObject(fullfilled,undefied(unless returned)) and (rejected,errorObject) on throw error
const findProduct = async () => {
  //productClassObject.method(queryObject) ie modelClassObject.method()
  //returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
  const foundProduct = await Product.findOne({ name: "Mountain Bike" }); //foundProduct = dataObject
  console.log(foundProduct);
  //returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
  await foundProduct.toggleOnSale(); //customeMethod avaiable on dataObject //this keyword (execution scope) left of dot dataObject
  //returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
  await foundProduct.addCategory("Outdoors");
  console.log(foundProduct);
};
//findProduct(); //execute variable function expression

//using - custom methods - productClassObject(ie modelClassObject)
//this keyword refers to modelClassObject //left of dot (execution scope)
//returns thenableObject - pending to resolved(messageObject),rejected(errorObject)
Product.fireSale().then((messageObject) => {
  console.log(messageObject);
});

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
//create modelInstanceObject(ie document) - with new keyword and productClassObject constructor method
const bike = new Product({
  name: "Cycling Jersy",
  price: "60",
  categories: ["Cycling", "Safety", "35"],
  size: "M",
  additionalProp: "value",
});
//modelInstanceObject.customeMethod()
//modelInstance.save() returns promiseObject - pending to resolved(dataObject),rejected(errorObject)
//creates (products)collection in (shopdb)db and adds (bike)document into the (products)collection
// bike
//   .save()
//   .then((data) => {
//     console.log("promise resolved(dataObject)");
//     console.log(data); //jsObject of created document
//   })
//   .catch((err) => {
//     //breaking validation/contraints causes promiseObjec to be rejected(errObject)
//     console.log("promise rejected(errObject)");
//     console.log(err); //check message only err.errors.name.properties.message
//   });

// *******************************************
//UPDATE - querying a collection for a document/documents then updating it + can add new key:value pair
// *******************************************
//modelClass
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
