import mongoose, {  Model, Query, Schema } from "mongoose";
import { IgoogleUser, IlocalSchema, IDAO, ErrorMessage } from '../types';
import {loggerObject} from '../helper/loggerHLP'
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
            },
            isVerified:{type: Boolean, default: true}
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
            try{
            const data = await this.model.findById(id)
            loggerObject.debug.debug({level:"debug",message:"findById:",data,DAOName:"MongoDAO"})
            cb(null,data)
              //this.model.findById(id,cb)
          }catch(e){loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`,method:"findById"})}
          },
          public findByUserName=async (username:string):Promise<any> =>{
             
            try {
              const data =await this.model.findOne({username})
              loggerObject.debug.debug({level:"debug",message:"findByUserName",data,DAOName:"MongoDAO"})
              return data
          }catch(e)
          {
            loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`,method:"findByUserName"})
          } 
          },
          public createUser=async (user:any):Promise<any>=>{
            
            try {
              const data =await this.model.create(user)
              loggerObject.debug.debug({level:"debug",message:"createUser",data,DAOName:"MongoDAO"})  
              return data
            }
            catch(e){
              loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`,method:"createUser",})
            } 
          },
          public returnFields= ():string[]|ErrorMessage=> {
            loggerObject.debug.debug({level:"debug",message:"returnFields"})
            try {
              const data=Object.keys(this.model.schema.obj)
              loggerObject.debug.debug({level:"debug",message:"returnFields",data,DAOName:"MongoDAO"})
              return data
            } 
            catch(e){loggerObject.error.error({level: "error",message:`${e}`,method:"returnFields"})
            return {message:"Something went wrong while retriving schema fields",error:`${e}`}
          }
          }
          
          ){
          }
          
}
module.exports = MongoDAO