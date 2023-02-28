
var knex = require('knex')({
  client: 'sqlite3',
  connection: { filename: './mydb.sqlite' }
})
const OtroDao=require('./services/SqlDAO2').SqlDAO
const DAOclass=require('./services/sqlDAO').SqlDAO
console.log(DAOclass)
async function createTable1(){
return  await knex.schema.createTable('adrian',(table)=>{
 // table.increments("id")
  // table.string("username")
 table.string("password")
})
}
// createTable1()
// class SqlDAO //implements IDAO
// {
//     constructor(db,schemaType){
//       this.db=db
//       this.schemaType=schemaType
    
//     }
//     isLocal =() => (this.schemaType==="localSchema")
//     hasField=async (field) =>{
//        const fields =await this.db.columnInfo()
//        return field in fields
//     } 
//     tableName=async ()=>{
//       const arraySQL= this.db.toString().split("(`")
//    return arraySQL[arraySQL.length-1].slice(0,arraySQL[arraySQL.length-1].length-2) 
//    }

//   }     

//createTable1()const DAO=new DAOclass(knex("adrian","localSchema"))
//createTable1()
//const DAO=new DAOclass(tabla1,knex,"localSchema")

//DAO.createUser({username:'adrian',password:"texto",_id:1}).then(e=>console.log(e))
// tabla1.insert({username:'adrian',password:"texto",_id:1}).then(e=>console.log(e))
const OtroMas=new OtroDao(knex,{mail:"string"},"goaSchema")
//OtroMas.createUsersTable().then(e=>console.log(e)).catch(()=>console.log("error"))  
OtroMas.verifyTableStructure("goa")
// knex.schema.alterTable("goa",table=>{
//   table.dropColumn("password")
// }).then(()=>console.log("borrado"))
//const DAO =new SqlDAO(tabla1,"localSchema")
// DAO.hasField("username").then(e=>console.log(e))
// DAO.tableName().then(e=>console.log(e))
// console.log(DAO.isLocal(),"Es Local")
//tabla1.columnInfo().then((cosa)=>console.log(cosa))