import { IDAO, IDAOSelector, IlocalSchema, IgoogleUser } from '../types';
import {Schema} from 'mongoose';
const MongoDAO=require('./mongoDAO')
export class DAOSelector implements IDAOSelector {
   constructor(schemaObject:Schema<IlocalSchema> |Schema<IgoogleUser>,schemaType:"goaSchema" |"localSchema",
   public MONGO:IDAO = new MongoDAO(schemaObject,schemaType,)
   ){}
    
}

