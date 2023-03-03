import { IDAO, IDAOSelector, IlocalSchema, IgoogleUser, SqlDestructuring } from '../types';
import {Schema} from 'mongoose';
const MongoDAO=require('./mongoDAO')
const SqlDAO = require('./sqlDAO')
console.log(SqlDAO)
export class DAOSelector implements IDAOSelector {
   constructor(
   schemaObject:Schema<IlocalSchema> |Schema<IgoogleUser>|SqlDestructuring,
   schemaType:"goaSchema" |"localSchema",
   public MONGO:IDAO =  MongoDAO,//(schemaObject,schemaType,),
   public SQL:any =new SqlDAO(schemaObject as SqlDestructuring,schemaType)
   ){}
    
}

