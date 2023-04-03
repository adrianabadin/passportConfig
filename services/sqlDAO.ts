import { Knex } from "knex";
import { IDAO, ISqlSchema, ISqlTypes, IdbConnectionObject, ErrorMessage, SchemaType } from '../types';
import {loggerObject} from "../helper/loggerHLP"

/*
Constructor options:
Needs 2 params 
1) Object {
    db: the knex funcion passed after connection established
2) String A string that contains "localSchema" or "goaSchema" 
serves to establish wich model is generating
}
*/
class SqlDAO implements IDAO {
    protected db:Knex
    protected dbSchema:ISqlSchema
    constructor(
        {db,dbSchema}:IdbConnectionObject,
        
        protected schemaType: SchemaType,
        protected createUsersTable=async ():Promise<void> =>{
            loggerObject.debug.debug({level:"debug",message:"createUsersTable" })

            if (schemaType==="localSchema") {
                let isTableUsers 
                try{          
                    isTableUsers=  await  db.schema.hasTable('users')            
                }
                catch(e)
                {
                    loggerObject.error.error({level:"error",message:`${e}`})
                }
            if (!isTableUsers){            
                loggerObject.debug.debug({level:"debug",message:"Creating table" })
                try{
                await db.schema.createTable('users',(table:Knex.TableBuilder)=>{
               table.increments('_id').primary()
               table.string('username').unique()
               table.string('password')
               table.boolean('isVerified')
                Object.keys(dbSchema).forEach((key:string)=>{
                    const keyValue = dbSchema[key].toLowerCase() as ISqlTypes
                    table.primary
                    if (key!=='username' && key!=='password'&& key!=='isVerified' && key!=='_id'){ 
                        if (typeof table[keyValue]=="function") table[keyValue](key)}
                })
            })
        }catch(error){loggerObject.error.error({message:`${error}`,level:"error"});}
        }
    }else if (this.schemaType==="goaSchema"){
        const isTableUsers=await  this.db.schema.hasTable('goa')
        if (!isTableUsers){   
            loggerObject.debug.debug({level:"info",message:"Creating goa Table"})         
            try{
            await (this.db).schema.createTable('goa',(table:Knex.TableBuilder)=>{
               table.increments('_id').primary()
               table.string('username').unique()
               table.string('password')
               table.string('name')
               table.string('lastname')
               table.string('avatar')
               loggerObject.debug.debug({level:"info",message:"GOA table created"})         
            })
        }catch(error){loggerObject.error.error({level:"error",message:`${error}`})}
        }
    }
        },
        protected isTable =async (table:"goa"|"users"):Promise<boolean>=>{
            try{
            loggerObject.debug.debug({level:"info",message:"isTable",table})         
            return await (await db).schema.hasTable(table)
        }
        catch(error){
            loggerObject.error.error({level:"error",message:`${error}`})
            return false
    }
        },
    protected verifyTableStructure =async (table: "goa"|"users"):Promise<void>=>{
        try{
            loggerObject.debug.info({level:"debug",message:"verifyTableStructure"})
        if (await isTable(table)){
        if (table==="users"){
            try{
            const id=await db.schema.hasColumn(table,"_id")
            if  (!await db.schema.hasColumn(table, "_id")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
        loggerObject.debug.debug({level:"debug",message:"ID added"})
        }
            }
            catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing _id field"})}
            try{ 
                if  (!await db.schema.hasColumn(table, "username")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
            })
            loggerObject.debug.debug({level:"debug",message:"username added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing username field"})}
        try{ 
            if  (!await db.schema.hasColumn(table, "password")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
                console.log("pass")

            })
            loggerObject.debug.debug({level:"debug",message:"password added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing password field"})}
        try{     
        if  (!await db.schema.hasColumn(table, "isVerified")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.boolean("isVerified")
                console.log("veri")
            })
            loggerObject.debug.debug({level:"debug",message:"isVerified added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing isVerified field"})}
        }else if (table==="goa"){
            try{ 
            if  (!await db.schema.hasColumn(table, "_id")){await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.increments("_id")
            })
            loggerObject.debug.debug({level:"debug",message:"ID added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing _id field"})}
        try { 
            if  (!await db.schema.hasColumn(table, "username")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("username").unique()
            })
            loggerObject.debug.debug({level:"debug",message:"username added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing username field"})}
        try{ 
            if  (!await db.schema.hasColumn(table, "password")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("password")
            })
            loggerObject.debug.debug({level:"debug",message:"password added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing password field"})}
        try{ 
            if  (!await db.schema.hasColumn(table, "name")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("name")
            })
            loggerObject.debug.debug({level:"debug",message:"name added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing name field"})}
        try{ 
            if  (!await db.schema.hasColumn(table, "lastname")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("lastname")
            })
            loggerObject.debug.debug({level:"debug",message:"lastname added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing lastname field"})}
        try {     
        if  (!await db.schema.hasColumn(table, "avatar")) {await this.db.schema.alterTable(table,(tableBuilder:Knex.TableBuilder)=>{
                tableBuilder.string("avatar")
            })
            loggerObject.debug.debug({level:"debug",message:"avatar added"})
        }
        }catch(e){loggerObject.error.error({level:"error",message:`${e}`,title:"Error by verifing avatar field"})}
        }
    }else {
        loggerObject.info.info({level:"info",message:"Table doesnt exists creating table"})
        try{ 
            await createUsersTable()
       }catch(e){loggerObject.error.error({level:"error",message:`${e}`})}
        }
    }catch(error){loggerObject.error.error({level:"error",title:"Error verifing table structure",message:`${error}`})}
    },
    
    public model = db((schemaType==="localSchema")?"users":"goa"),
    public findById=async (id:string):Promise<any> =>{
        
        try {
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
    
       return await db((schemaType==="localSchema")?"users":"goa").where("_id",`${id}`).select("*").then((response:any)=>{
            loggerObject.debug.debug({level:"debug",message:"findById",data:response,DAOName:"SqlDAO"})    

        }).catch((error:any)=>loggerObject.error.error({level:"error",message:"Error retriving data",function:"findByID SQL",error}))
    }catch(e){loggerObject.error.error({level:"error",message:`${e}`})}

    },
    public findByUserName=async (username:string):Promise<any> =>{
       try{
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
        const data =await db((schemaType==="localSchema") ?"users":"goa").where("username",username).select("*")
        loggerObject.debug.debug({level:"debug",message:"findByUserName",data:data[0],DAOName:"SqlDAO"})
        return (data.length >0) ?data[0] : false
    }  catch(error){loggerObject.error.error({level:"error",message:"Error accesing Database"})}
        
      },
      public createUser=async (user:any):Promise<any>=>{
        try {

        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")    
        const data = await db.insert(user).into((schemaType==="localSchema") ?"users":"goa").then(
           async ()=> await db((schemaType==="localSchema") ?"users":"goa").where("username",user.username).select("*") 
        ).catch(error=>loggerObject.error.error({level: "error",message:(error.errno===19)? "UserName already exists": `${error}`}))
        loggerObject.debug.debug({level:"debug",message:"createUser",data,DAOName:"SqlDAO"})
        return (Array.isArray(data)) ? data[0] :data}
        catch(error:any){loggerObject.error.error({level: "error",message:(error.errno===19)? "UserName already exists": `${error}`})}
      },
      public returnFields=async():Promise<string[] | ErrorMessage>=>{
        try{
            
        await verifyTableStructure((schemaType==="localSchema") ?"users":"goa")               
        const data=Object.keys(await db((schemaType==="localSchema") ?"users":"goa").columnInfo())
        loggerObject.debug.debug({level:"debug",message:"returnFields",data,DAOName:"SqlDAO"})
        return data
    }catch(error){
        loggerObject.error.error({level: "error",message:`${error}`})
        return {message:"Hubo un error",error:`${error}`}
        }
      }
    ){
        if (db===undefined || dbSchema===undefined) {
            loggerObject.error.error({message:"Fatal Error",error:"Invalid schemaObject db:Knex expected abd dbSchema:{fields:Knex.Schematype} expected"})
            throw new Error("Invalid schemaObject db:Knex expected abd dbSchema:{fields:Knex.Schematype} expected")}
        this.db=db
        this.dbSchema=dbSchema
    }
}

module.exports= SqlDAO