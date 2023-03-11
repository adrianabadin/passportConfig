const  MongoDao=require("./services/mongoDAO.js").MongoDAO
const URL = "mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority"
console.log("alo")

const DAO =  (new MongoDao({db:URL,dbSchema:{phone:{type:Number}}},"localSchema"))
//console.log(new (await MongoDao.createInstance())({db:URL,dbSchema:{phone:{type:Number}}},"localSchema"))
// console.log("algo",await DAO.Instance,"cosas")
console.log(DAO.createInstance().then(async e=>console.log( e.returnFields())))