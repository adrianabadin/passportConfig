import { Schema } from 'mongoose';
import { DbType, IdbConnectionObject, IgoogleUser, IlocalSchema, ImongoDB, SchemaType } from '../types';
//const MongoDAO=require('./mongoDAO')
import {MongoDAO} from './mongoDAO'
import mongoose from 'mongoose';
import knex from 'knex';
import { loggerObject } from '../helper/loggerHLP';
const SqlDAO = require('./sqlDAO')
export async function DAOSelector(
   db:Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB |IdbConnectionObject,
   schemaType:SchemaType,
   dbType:DbType)
{
const isMongo = ()=>
{
return dbType==="MONGO"
}
const isSQL = ()=>
{
return dbType==="SQL"
}
const isMongoConnectObject = ()=>{
   if ("db" in db){
      if ("dbSchema" in db){
         return true
      }else  return false
   }else return false
}
const isSqlConnectObject =()=>{
   if ("db"in db){
      if (db.db instanceof knex){
         if ("dbSchema"in db){
            return true 
         }else throw new Error("dbSchema should be present on db param")
      }throw new Error("db Key should be a knex instance connected to a SQL DB")
   } else throw new Error("The key db should be present on the db param")
}
if (isMongo()){
 try {
   if (db instanceof(mongoose.Schema) || isMongoConnectObject() ){   
const objectInstance = new MongoDAO(db as Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB,schemaType)
return await objectInstance.createInstance()
  
}else throw new Error("Db param should be a mongoose schema or a configuration object containing the keys db and dbSchema {db:string dbSchema {Schema definition}}")
}catch(error) {loggerObject.error.error({level:"error",error,message:"Imposible to create instance"})}
} 
if (isSQL()){
try{
if (isSqlConnectObject()){
   const objectInstance = new SqlDAO(db,schemaType)
   return objectInstance
}
}catch(error){loggerObject.error.error({level:"error",error,message:"Imposible to create instance"})}
}
}

// class DAOSelector implements IDAOSelector {
//    public database:any
//    static instance:any
//    constructor(
//       db:Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB |IdbConnectionObject,
//       schemaType: "goaSchema" |"localSchema",
//       dbType: "MONGO"|"SQL",
//    protected isLocal = (schemaType==="localSchema"),
//    protected isMongo = (dbType==="MONGO"),
//    protected isSQL = (dbType==="SQL"),
//    protected loadDAO = async()=>{
//       const DAO= new MongoDAO(db as Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB ,schemaType)
//       this.database=await DAO.createInstance()
//    }
//    ){
//       if (isMongo) this.database= loadDAO()
//       else if (isSQL) this.database = new SqlDAO(db,schemaType)
//   }
//  }

//const DAOSelectorObject =new DAOSelector({db:URL,dbSchema:{phone:{type:Number}}},"localSchema","MONGO")
//console.log(DAOSelectorObject)
export default DAOSelector



