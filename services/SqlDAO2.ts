import { Knex } from "knex";
import { ISqlSchema, ISqlTypes } from '../types';

export class SqlDAO {
    constructor(
        protected db:Knex,
        protected dbSchema:ISqlSchema,
        protected schemaType: "localSchema"|"goaSchema",
        protected isLocal=async ():Promise<Knex.QueryBuilder>=>{
            
            if (this.schemaType==="localSchema"){
                await verifyTableStructure("users")
                return await this.db("users")
            } else {
                await verifyTableStructure("goa")
                return await this.db("goa")
            }

        },
        public model:Promise<Knex.QueryBuilder> = isLocal(),
        protected createUsersTable=async ():Promise<void> =>{
            if (this.schemaType==="localSchema") {
            const isTableUsers=await  this.db.schema.hasTable('users')
            if (!isTableUsers){            
            await (this.db).schema.createTable('users',(table:Knex.TableBuilder)=>{
               table.increments('_id').primary()
               table.string('username')
               table.string('password')
               table.boolean('isVerified')
                Object.keys(this.dbSchema).forEach((key:string)=>{
                    console.log(key)
                    const keyValue = this.dbSchema[key] as ISqlTypes
                    table.primary
                    if (key!=='username' && key!=='password'&& key!=='isVerified' && key!=='_id'){ 
                        if (typeof table[keyValue]=="function") table[keyValue](key)}
                })
            })
        
        }
    }else if (this.schemaType==="goaSchema"){
        const isTableUsers=await  this.db.schema.hasTable('goa')
        if (!isTableUsers){            
            await (this.db).schema.createTable('goa',(table:Knex.TableBuilder)=>{
               table.increments('_id').primary()
               table.string('username')
               table.string('password')
               table.string('name')
               table.string('lastname')
               table.string('avatar')
            })
        
        }
    }
        },
        protected isTable =async (table:"goa"|"users"):Promise<boolean>=>{
            return await (this.db).schema.hasTable(table)
        },
    protected verifyTableStructure =async (table: "goa"|"users"):Promise<void>=>{
        if (await this.isTable(table)) {
        if (table==="users"){
            const id=await this.db.schema.hasColumn(table,"_id")
            console.log("id :",id)
            if  (!await this.db.schema.hasColumn(table, "_id"))await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
            if  (!await this.db.schema.hasColumn(table, "username")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
            })
            if  (!await this.db.schema.hasColumn(table, "password")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
            })
            if  (!await this.db.schema.hasColumn(table, "isVerified")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.boolean("isVerified")
            })
        }else if (table==="goa"){
            if  (!await this.db.schema.hasColumn(table, "_id"))await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
            if  (!await this.db.schema.hasColumn(table, "username")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
            })
            if  (!await this.db.schema.hasColumn(table, "password")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
            })
            if  (!await this.db.schema.hasColumn(table, "name")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("name")
            })
            if  (!await this.db.schema.hasColumn(table, "lastname")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("lastname")
            })
            if  (!await this.db.schema.hasColumn(table, "avatar")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("avatar")
            })
        }
    }else createUsersTable()
    },
    public findById=async (id:string,cb:any):Promise<any> =>{
       const queryBuilder:Knex.QueryBuilder=await this.model
                
       await queryBuilder.where({_id:id}).select("*").then((response:any)=>{
            cb(null,response)
        }).catch((error:any)=>cb(error))
    },
    public findByUserName=async (username:string):Promise<any> =>{
        const queryBuilder:Knex.QueryBuilder=await this.model
        return await queryBuilder.where({username}).select("*").then((result:any)=>{
            return result
        }).catch((error:any)=>error)
      },
      public createUser=async (user:any):Promise<any>=>{
        const queryBuilder:Knex.QueryBuilder=await this.model

           return await queryBuilder.insert(user) //(await this.model).insert(user)
      },
      public returnFields=async():Promise<string[]>=>{
        try{
        const queryBuilder:Knex.QueryBuilder=await this.model
        return Object.keys(await queryBuilder.columnInfo())}catch(error){console.log(error)
        return ["Hubo un error"]
        }
      }
    ){}
}