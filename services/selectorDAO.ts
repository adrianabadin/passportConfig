import { Schema } from 'mongoose';
import { IDAO, IDAOSelector, IdbConnectionObject, IgoogleUser, IlocalSchema,ImongoDB} from '../types';
//const MongoDAO=require('./mongoDAO')
import {MongoDAO} from './mongoDAO'
const SqlDAO = require('./sqlDAO')
console.log(SqlDAO)
class DAOSelector implements IDAOSelector {
   public database:any
   static instance:any
   constructor(
      db:Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB |IdbConnectionObject,
      schemaType: "goaSchema" |"localSchema",
      dbType: "MONGO"|"SQL",
   protected isLocal = (schemaType==="localSchema"),
   protected isMongo = (dbType==="MONGO"),
   protected isSQL = (dbType==="SQL"),
   protected loadDAO = async()=>{
      const DAO= new MongoDAO(db as Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB ,schemaType)
      this.database=await DAO.createInstance()
   }
   ){
      if (isMongo) this.database= loadDAO()
      else if (isSQL) this.database = new SqlDAO(db,schemaType)
  }
 }
 const URL = "mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority"

const DAOSelectorObject =new DAOSelector({db:URL,dbSchema:{phone:{type:Number}}},"localSchema","MONGO")
console.log(DAOSelectorObject)
export default DAOSelector



