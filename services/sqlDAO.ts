import { Tables } from 'knex/types/tables';
import { IDAO } from '../types';
import  { Knex } from 'knex';
import Schema from 'mongoose';
import { Schema as SchemaType } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class SqlDAO //implements IDAO
{
    constructor(
         protected db:Knex.QueryBuilder, //:Knex<Tables>,
         protected OMR:Knex,
         protected schemaType: "localSchema"|"goaSchema",
         protected isLocal =():boolean => (schemaType==="localSchema"),
         protected hasField=async (field:string):Promise<boolean> =>{
            const fields =await this.db.columnInfo()
            return field in fields
         } ,
        protected tableName=async ()=>{
            const arraySQL= this.db.toString().split("(`")
            return arraySQL[arraySQL.length-1].slice(0,arraySQL[arraySQL.length-1].length-2) 
        },
        protected modelConstructor=async ():Promise<boolean>=>{
 console.log("es local:",isLocal())
            if (isLocal()){
                if (!(await hasField("username"))){
                    await this.OMR.schema.alterTable(await tableName(),(table:any)=>{
                        table.unique("username")
                        table.string("username")
                    })
                }
                if (!(await hasField("password"))){
                    await this.OMR.schema.alterTable(await tableName(),(table:any)=>{
                        table.string("password")
                    })
                }
                if (!(await hasField("_id"))){
                    await this.OMR.schema.alterTable(await tableName(),(table:any)=>{
                        
                        table.string("_id")
                    })
                }
                if (!(await hasField("isValidated"))){
                   await this.OMR.schema.alterTable(await tableName(),(table:any)=>{
                        table.boolean("isValidated")
                        
                    })
                }
                return true
            }
return false
            
        }, 
        public model = db,
                public findById=async (id:string,cb:any):Promise<any> =>{
            (await this.model).where({_id:id}).select("*").then((response:any)=>{
                cb(null,response)
            }).catch((error:any)=>cb(error))
          },
          public findByUserName=async (username:string):Promise<any> =>{
            return await (await this.model).where({username}).select("*").then((result:any)=>{
                return result
            }).catch((error:any)=>error)
          },
          public createUser=async (user:any):Promise<any>=>{
           //const model= await this.modelConstructor()
            console.log("texto",await modelConstructor())
           return await this.db.insert({...user,_id:uuidv4()})
          }
    ){}
}