import mongoose, {  Model, Query, Schema } from "mongoose";
import { IgoogleUser, IlocalSchema, IDAO, ErrorMessage, IdbConnectionObject } from '../types';
import {loggerObject} from '../helper/loggerHLP'
class MongoDAO implements IDAO{
    constructor(
        protected db: Schema<IlocalSchema> | Schema<IgoogleUser> | IdbConnectionObject,
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
          protected createModel=async ()=>{
            if ("db" in this.db && "dbSchema" in this.db) {
              if (typeof this.db.db === "string"){               mongoose.set("strictQuery",false)
              return await mongoose.connect(this.db.db).then(()=>{
                return isLocal ? mongoose.model('localCollection',db.add(basicSchema)) :mongoose.model('goaCollection',gooogleOauthSchema)
              })
            }
          }

          },
          public model:Model<any>  = isLocal ? mongoose.model('localCollection',db.add(basicSchema)) :mongoose.model('goaCollection',gooogleOauthSchema),
          public findById=async (id:string,cb:any):Promise<any> =>{
            loggerObject.debug.debug({level:"debug",message:"findById"})
            try{
            this.model.findById(id,cb)
          }catch(e){loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})}
          },
          public findByUserName=async (username:string):Promise<any> =>{
            loggerObject.debug.debug({level:"debug",message:"findByUserName"})
 
            try {
              return await this.model.findOne({username})
          }catch(e)
          {
            loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
          } 
          },
          public createUser=async (user:any):Promise<any>=>{
            loggerObject.debug.debug({level:"debug",message:"createUser"})
            try {
              return await this.model.create(user)
            }
            catch(e){
              loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
            } 
          },
          public returnFields= ():string[]|ErrorMessage=> {
            loggerObject.debug.debug({level:"debug",message:"returnFields"})
            try {
              return Object.keys(this.model.schema.obj)
            } 
            catch(e){loggerObject.error.error({level: "error",message:`${e}`})
            return {message:"Something went wrong while retriving schema fields",error:`${e}`}
          }
          }
          
          ){
          }
          
}
module.exports = MongoDAO