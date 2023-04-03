import mongoose, {  Model, Schema} from "mongoose";
import { IgoogleUser, IlocalSchema, IDAO, ErrorMessage, ImongoDB, IfindByIdError, MongooseCreateError, DbType, SchemaType } from '../types';
import {loggerObject} from '../helper/loggerHLP'
import { SchemaDefinition } from 'mongoose';

export class MongoDAO implements IDAO{
  public model!:Model<any>  
  public findById!:(id:string)=>Promise<any>
  public findByUserName!: (username:string)=>Promise<any>
  public createUser!:(user:any)=>Promise<any>
  public returnFields!: ()=>string[]|ErrorMessage
  static localInstance: any
  static goaInstance:any
  public createInstance :()=>any
  constructor(
        protected db: Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB,
        protected schemaType: SchemaType,
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
            avatar: String,
            age:Number,
            birthdays:Date,
            genders:String,
            organizations:[],
            adress:String,
            at:String,
            rt:String
          }),
          protected isLocal = (schemaType==='localSchema'),
          protected isSchema =(data:Schema<IlocalSchema> | Schema<IgoogleUser>|ImongoDB):boolean=>{
            if (data instanceof Schema)  return true
            else return false
            },
            protected isModel=(data:any):boolean=>{
              if ("schema" in data && "findOne" in data && "findById" in data) return true // && "findOne" in data && "save" in data ) return true 

              return false
            },
            protected isDbConnected=():boolean=>{
              return mongoose.connection.readyState ===2
            },
            protected isDbConnectionSchema= (db:any):unknown =>{
             if (!isSchema(db)) { 
              if ("db" in db && "dbSchema" in db) {
                if(typeof db["db"] ==="string"){
                  let response
                       try{
                        const schema=new Schema(db.dbSchema)
                        response =false
                       }catch(e){response=e}
                return response
                      }

              } 
             }
             return false

            },
           protected ClassBuilder=async ():Promise<void>=>{
            let dataSchema:Schema<IlocalSchema|IgoogleUser> 
            let dbConnectionObject:ImongoDB

            if (isSchema(db)) 
            {
              dataSchema = db as Schema<IlocalSchema|IgoogleUser> 
              this.model=isLocal ? mongoose.model('localCollection',dataSchema.add(basicSchema)) :mongoose.model('goaCollection',dataSchema.add(gooogleOauthSchema))
            } else if (!isDbConnectionSchema(db)){
              dbConnectionObject=db as ImongoDB
              let schema = new Schema(dbConnectionObject.dbSchema)
              
              this.model=isLocal ? mongoose.model('localCollection',schema.add(basicSchema)):mongoose.model("goaCollection",schema.add(gooogleOauthSchema))
            }
            this.findById=async (id:string):Promise<any> =>{
                
               try{
                   const response = await this.model.findById(id)
                   loggerObject.debug.debug({level:"debug",message:"findById",response})
                  return response
                  }catch(e:unknown | IfindByIdError)
                    {const error:IfindByIdError =e as IfindByIdError
                      loggerObject.error.error({level:"error",title:error.name==="CastError" 
                      ? "Wrong ID Structure"
                      :error.name ==="DocumentNotFoundError"
                        ?"Document not Founded"
                        :error.name,message:error.message,error:error.reason})}
          }
          this.findByUserName=async (username:string):Promise<any> =>{
            try {
                const response = await this.model.findOne({username})
                loggerObject.debug.debug({level:"debug",message:"findByUserName",response})  
                return response
            }catch(e:unknown | IfindByIdError)
            {const error:IfindByIdError =e as IfindByIdError
              loggerObject.error.error({level:"error",title:error.name==="CastError" 
              ? "Wrong ID Structure"
              :error.name ==="DocumentNotFoundError"
                ?"Document not Founded"
                :error.name,message:error.message,error:error.reason})}
            }
            this.createUser=async (user:any):Promise<any>=>{
                loggerObject.debug.debug({level:"debug",message:"createUser"})
                try {
                  const response =await this.model.create(user)
                  loggerObject.debug.debug({level:"debug",message:"createUser",response})
                  return response
                }
                catch(e){
                  const error:MongooseCreateError =e as MongooseCreateError
                  loggerObject.error.error({level:"error",
                  title: error.name ==="ValidationError" 
                        ? "Object parsed dont Validate mongoose schema"
                        :error.name ==="CastError"
                          ? "Error converting types"
                          : error.name ==="MongoError"
                            ? "Mongo Error"
                            : error.name
                        ,message:error.message,error:error.errmsg?error.errmsg:error})
                } 
              }
              this.returnFields= ():string[]|ErrorMessage=> {
                  loggerObject.debug.debug({level:"debug",message:"returnFields",model: this.model})
                  // console.log(this.model,isModel(this.model))
                  if (isModel(this.model)) {
                    const response = Object.keys(this.model.schema.obj)
                    loggerObject.debug.debug({level:"debug",message:"returnFields",response})  
                    return response
                  }else {
                    loggerObject.error.error({level: "error",message:"This.model is not an instance of mongoose.models so it is imposible to retrive fields",error:"This.model is not defined"})
                    return {message:"This.model is not an instance of mongoose.models so it is imposible to retrive fields",error:"This.model is not defined"}  
                  }                 
                }
                
          ////FIN DE CLASSBUILDER  
        }


          
          ){        
              this.createInstance=async ():Promise<any>=>{
                if(schemaType==="localSchema"){
                  if (MongoDAO.localInstance ===undefined){
                  MongoDAO.localInstance = new MongoDAO(db,schemaType)
                  await MongoDAO.localInstance.ClassBuilder()
                  }
                loggerObject.debug.debug({level:"debug",model:MongoDAO.localInstance.model,schemaType})  
                return MongoDAO.localInstance
                }else 
                {
                  if (schemaType ==="goaSchema"){
                    if (MongoDAO.goaInstance===undefined)
                    {
                      MongoDAO.goaInstance = new MongoDAO(db,schemaType)
                      await MongoDAO.goaInstance.ClassBuilder()
                    }
                  loggerObject.debug.debug({level:"debug",model:MongoDAO.goaInstance.model,schemaType})  
                  return MongoDAO.goaInstance
                }
              }             
              }
            const data:ImongoDB =this.db as ImongoDB;
  
            if (this.isSchema(db as ImongoDB)){
              if (this.isDbConnected()) {this.createInstance()
              
              }
              else throw new Error("Db must be conected before if you are using a Schema as param")
            }
            else {
              if (!isDbConnectionSchema(data.dbSchema)){

                mongoose.set("strictQuery",false)
                mongoose.connect(data.db)
                  .then(()=>{
                    if (schemaType==="goaSchema"){
                      if (MongoDAO.goaInstance !==undefined)
                      {
                        return MongoDAO.goaInstance}
                    }else if(schemaType==="localSchema"){
                      if (MongoDAO.localInstance !==undefined) return MongoDAO.localInstance
                    }
                    loggerObject.info.info({level:"info",message:"Connecting to MongoDB"})
                    this.createInstance()
          
                  })
                  .catch(error=>{
                    loggerObject.error.error({level:"error",message:"Error Connecting to Mongo DB",error})
                })
              }else throw new Error("The params provided should be a mongoose schema or a configuration object containig the following structure {db:'Conection String',dbSchema:{a valid schema definition}}")
            }           
          
                    
           
        }

}




