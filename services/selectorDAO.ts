import { IDAO, IDAOSelector, IlocalSchema, IgoogleUser,IdbConnectionObject } from '../types';
import {Schema} from 'mongoose';
const MongoDAO=require('./mongoDAO')
const SqlDAO = require('./sqlDAO')
console.log(SqlDAO)
export class DAOSelector implements IDAOSelector {
   constructor(
   schemaObject:Schema<IlocalSchema> |Schema<IgoogleUser>|IdbConnectionObject,
   schemaType:"goaSchema" |"localSchema",
   public MONGO:IDAO =  MongoDAO,//(schemaObject,schemaType,),
   public SQL:any =new SqlDAO(schemaObject as IdbConnectionObject,schemaType)
   ){}
    
}

