import { IDAO, IDAOSelector, IlocalSchema, IgoogleUser, SqlDestructuring } from '../types';
import {Schema} from 'mongoose';
const MongoDAO=require('./mongoDAO')
import {SqlDAO} from './sqlDAO'
export class DAOSelector implements IDAOSelector {
   constructor(
   schemaObject:Schema<IlocalSchema> |Schema<IgoogleUser>|SqlDestructuring,
   schemaType:"goaSchema" |"localSchema",
   public MONGO:IDAO = new MongoDAO(schemaObject,schemaType,),
   public SQL:any =new SqlDAO(schemaObject as SqlDestructuring,schemaType)
   ){}
    
}

