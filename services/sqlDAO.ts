import { Knex } from "knex";
import { ISqlSchema, ISqlTypes } from '../types';

export class SqlDAO {
    constructor(
        protected db:Knex,
        protected dbSchema:ISqlSchema,
        protected schemaType: "localSchema"|"goaSchema",
        protected createUsersTable=async ():Promise<void> =>{
            if (schemaType==="localSchema") {
            const isTableUsers=await  db.schema.hasTable('users')
            console.log("users",isTableUsers)
            if (!isTableUsers){            
            await db.schema.createTable('users',(table:Knex.TableBuilder)=>{
               table.increments('_id').primary()
               table.string('username').unique()
               table.string('password')
               table.boolean('isVerified')
                Object.keys(dbSchema).forEach((key:string)=>{
                    console.log(key)
                    const keyValue = dbSchema[key] as ISqlTypes
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
               table.string('username').unique()
               table.string('password')
               table.string('name')
               table.string('lastname')
               table.string('avatar')
            })
        
        }
    }
        },
        protected isTable =async (table:"goa"|"users"):Promise<boolean>=>{
           console.log(await (await db).schema.hasTable(table))
            return await (await db).schema.hasTable(table)
        },
    protected verifyTableStructure =async (table: "goa"|"users"):Promise<void>=>{
        if (await isTable(table)){// this.isTable(table)) {
        if (table==="users"){
            const id=await db.schema.hasColumn(table,"_id")
            console.log("id :",id)
            if  (!await db.schema.hasColumn(table, "_id"))await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
            
            if  (!await db.schema.hasColumn(table, "username")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
                console.log("username")
            })
            if  (!await db.schema.hasColumn(table, "password")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
                console.log("pass")

            })
            if  (!await db.schema.hasColumn(table, "isVerified")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.boolean("isVerified")
                console.log("veri")
            })
        }else if (table==="goa"){
            if  (!await db.schema.hasColumn(table, "_id"))await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
            if  (!await db.schema.hasColumn(table, "username")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
            })
            if  (!await db.schema.hasColumn(table, "password")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
            })
            if  (!await db.schema.hasColumn(table, "name")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("name")
            })
            if  (!await db.schema.hasColumn(table, "lastname")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("lastname")
            })
            if  (!await db.schema.hasColumn(table, "avatar")) await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("avatar")
            })
        }
    }else {
        console.log("create table")
       await createUsersTable()}
    },
    
    public model = db((schemaType==="localSchema")?"users":"goa"),
    public findById=async (id:string,cb:any):Promise<any> =>{
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
        await db((schemaType==="localSchema")?"users":"goa").where("_id",`${id}`).select("*").then((response:any)=>{
            cb(null,response)
        }).catch((error:any)=>cb(error))
    },
    public findByUserName=async (username:string):Promise<any> =>{
       try{ 
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
        return await db((schemaType==="localSchema") ?"users":"goa").where("username",username).select("*")}catch(error){console.log(error)}
        
      },
      public createUser=async (user:any):Promise<any>=>{
        try {
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")    
        return await db.insert(user).into((schemaType==="localSchema") ?"users":"goa")}
        catch(error:any){console.log((error.errno===19)? "UserName already exists": error)}
      },
      public returnFields=async():Promise<string[]>=>{
        try{
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
        return Object.keys(await db((schemaType==="localSchema") ?"users":"goa").columnInfo())}catch(error){console.log(error)
        return ["Hubo un error"]
        }
      }
    ){}
}