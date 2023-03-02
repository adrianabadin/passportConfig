
var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './mydb.sqlite' }
})
const logger=require('./helper/loggerHLP').loggerObject
logger.debug.debug({level:"info", message:"adrian"})
const OtroDao=require('./services/SqlDAO').SqlDAO
//const DAOclass=require('./services/sqlDAO').SqlDAO
//console.log(DAOclass)

const OtroMas=new OtroDao({db:knex,dbSchema:{mail:"string"}},"localSchema")
//OtroMas.verifyTableStructure("users").then(() => {console.log("Terminado")})
  //OtroMas.createUser({username:"aabadin@gmail.com2",password:"111",isVerified:true,mail:"aabadin@gmail.com"	}).then(()=>console.log("fin"))
//OtroMas.findById(2,(e,res)=>console.log(res,e))
OtroMas.findByUserName("aabadin@gmail.com").then((res)=>console.log(res))
OtroMas.returnFields().then((res)=>console.log(res))
// console.log(OtroMas.db("users"),"USERS")
  // knex.schema.alterTable("goa",table=>{
//   table.dropColumn("password")
// }).then(()=>console.log("borrado"))
//const DAO =new SqlDAO(tabla1,"localSchema")
// DAO.hasField("username").then(e=>console.log(e))
// DAO.tableName().then(e=>console.log(e))
// console.log(DAO.isLocal(),"Es Local")
//tabla1.columnInfo().then((cosa)=>console.log(cosa))