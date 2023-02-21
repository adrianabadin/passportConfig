import mongoose, {  Model, Query, Schema } from "mongoose";
import { IgoogleUser, IlocalSchema, IDAO } from "../types";

class MongoDAO implements IDAO{
    constructor(
        protected db: Schema<IlocalSchema> | Schema<IgoogleUser>,
        protected schemaType: "goaSchema" |"localSchema",
        protected basicSchema= new Schema<IlocalSchema>({
            username: {
              type: String,
              required: true,
              unique: true
            },
            password: {
              type: String,
              required: true
            }
          }),
          protected gooogleOauthSchema= new Schema<IgoogleUser>({
            username: {
              type: String,
              required: true,
              unique: true
            },
            name: String,
            lastName: String,
            avatar: String
          }),
          protected isLocal = (schemaType==='localSchema'),
          //Funciones que deben ser iguales
          public model:Model<any>  = isLocal ? mongoose.model('localCollection',db.add(basicSchema)) :mongoose.model('goaCollection',gooogleOauthSchema),
          public findById=async (id:string,cb:any):Promise<any> =>{
            this.model.findById(id,cb)
          },
          public findByUserName=async (username:string):Promise<any> =>{
            return await this.model.findOne({username}) 
          },
          public createUser=async (user:any):Promise<any>=>{
            return await this.model.create(user) 
          }

          ){
          }
}
module.exports = MongoDAO