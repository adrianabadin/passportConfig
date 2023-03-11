import mongoose, {  Model, Mongoose, Query, Schema } from "mongoose";
import { IgoogleUser, IlocalSchema, IDAO, ErrorMessage, IdbConnectionObject } from '../types';
import {loggerObject} from '../helper/loggerHLP'
const isSchema =(data:Schema<IlocalSchema> | Schema<IgoogleUser>|ImongoDB):boolean=>{
  if (data instanceof Schema)  return true
  else return false
  }
  const isDbConnected=():boolean=>{
    return mongoose.connection.readyState ===2
  }
  const  buildClass=async():Promise<void>=>{
  
  }
class MongoDAO implements IDAO{
  public model:Model<any>  
  public findById:(id:string,cb:any)=>Promise<any>
  public findByUserName: (username:string)=>Promise<any>
  public createUser:(user:any)=>Promise<any>
  public returnFields: ()=>string[]|ErrorMessage
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
          protected isSchema =(data:Schema<IlocalSchema> | Schema<IgoogleUser>|ImongoDB):boolean=>{
            if (data instanceof Schema)  return true
            else return false
            },
            protected isDbConnected=():boolean=>{
              return mongoose.connection.readyState ===2
            },
            protected isDbConnectionSchema= (db:any):boolean =>{
              if ("db" in db && "dbSchema" in db) {
                if(typeof db["db"] ==="string"){
                  let response
                       try{
                        const schema=new Schema(db.dbSchema)
                        response =true
                       }catch(e){response=false}
                return response
                      }

              } 
              return false
            }
                    



          //Funciones que deben ser iguales
        
        //  public model:Model<any>  = isLocal ? mongoose.model('localCollection',db.add(basicSchema)) :mongoose.model('goaCollection',gooogleOauthSchema),
          //public findById=async (id:string,cb:any):Promise<any> =>{
          //   loggerObject.debug.debug({level:"debug",message:"findById"})
          //   try{
          //   this.model.findById(id,cb)
          // }catch(e){loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})}
          // },
          // public findByUserName=async (username:string):Promise<any> =>{
          //   loggerObject.debug.debug({level:"debug",message:"findByUserName"})
 
          //   try {
          //     return await this.model.findOne({username})
          // }catch(e)
          // {
          //   loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
          // } 
          // },
          // public createUser=async (user:any):Promise<any>=>{
          //   loggerObject.debug.debug({level:"debug",message:"createUser"})
          //   try {
          //     return await this.model.create(user)
          //   }
          //   catch(e){
          //     loggerObject.error.error({level:"error",title:"Error accesing database",message:`${e}`})
          //   } 
          // },
          // public returnFields= ():string[]|ErrorMessage=> {
          //   loggerObject.debug.debug({level:"debug",message:"returnFields"})
          //   try {
          //     return Object.keys(this.model.schema.obj)
          //   } 
          //   catch(e){loggerObject.error.error({level: "error",message:`${e}`})
          //   return {message:"Something went wrong while retriving schema fields",error:`${e}`}
          // }
          // }
          
          ){
            if (isSchema(db)){
              if (isDbConnected()) {

              }else throw new Error("Mongo DB needs to be connected before you can use this class")
            }
          }
          
}
module.exports = MongoDAO