//mongoose ODM - has callback but also supports promises-ie returns promiseObject (pending,undefined) to -resove(value)(fullfulled,value) or reject(errorMessage)(rejected,errorMessage)
const mongoose = require("mongoose"); //mongooseObject //mongoose model

//mongooseObject.method(url/defaultPortNo/databaseToUse,optionsObject-notNeeded) //returns promiseObject pending
//nodeJS runtime app connects to default mogod server port + creates db
mongoose
  .connect("mongodb://localhost:27017/moviesDb", {
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
