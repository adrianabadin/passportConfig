import { Models, SchemaDefinition } from "mongoose";
import { Knex } from "knex";
// type AuthObjectType ={
//     clientID:string,
//   clientSecret: string,
//   callbackURL:string
// }
interface IpassportConfigBuilderReturn {
    buildLocalConfig:()=>IpassportConfigBuilderReturn, 
    setCrypt:(value:boolean)=>IpassportConfigBuilderReturn,
    GoogleoAuth: (authObject:AuthenticateOptionsGoogle,loginOnly:boolean)=>IpassportConfigBuilderReturn,
    setUserNotFoundMessage:(userNotFoundMessageParam:string)=>IpassportConfigBuilderReturn,
    setIncorrectPassword:(incorrectPasswordParam:string)=>IpassportConfigBuilderReturn,
    setUserAlrreadyExistsMessage:(userExistsParam:string)=>IpassportConfigBuilderReturn,
    localModel:Models,
    goaModel:Models,
    hasVerification:(this:IpassportConfigBuilderReturn)=>IpassportConfigBuilderReturn
    setNotVerifiedMessage:(this:IpassportConfigBuilderReturn,message:string)=>IpassportConfigBuilderReturn
}
interface TableBuilderTypes {
    increments: () => ColumnBuilder;
    string: (columnName?: string, length?: number) => ColumnBuilder;
    boolean: (columnName?: string) => ColumnBuilder;
    integer: (columnName?: string) => ColumnBuilder;
    timestamps: (columnName?: string) => ColumnBuilder;
    text: (columnName?: string) => ColumnBuilder;
    float: (columnName?: string) => ColumnBuilder;
    date: (columnName?: string) => ColumnBuilder;
    datetime: (columnName?: string) => ColumnBuilder;

}

export type IdbConnectionObject={
    db:Knex
    dbSchema:ISqlSchema




    // Agrega aquí el nombre y tipo de todas las demás funciones de TableBuilder que desees utilizar.
  }

export type ISqlTypes = keyof  TableBuilderTypes//"string"|"increments"|"primary"|"integer"|"boolean"|"date"|"datetime"|"timestamps"
export interface ISqlSchema {
    [key:string]: ISqlTypes
}
export interface IgoogleUser {
    username:string,
    name?:string,
    lastName?:string,
    avatar?:string
}
export interface IlocalSchema{
    username:string,
    password:string,
    [key:string]:string|number|boolean

}
export interface IDAO {
model:Model<any>,
findById: (id:string,cb:any)=>Promise<any>,
findByUserName:(userName:string)=>Promise<any>,
createUser:(user:any)=>Promise<any>
returnFields:() => string[]|ErrorMessage|Promise<string[]|ErrorMessage>
Instance?:any
createInstance?:()=>any
}
export type ErrorMessage ={
    message:string
    error:string
}
export interface IDAOSelector {
MONGO: IDAO
}

export interface ImongoDB {
    db:string,
    dbSchema:SchemaDefinition
}
export interface IgoaBasicObject {
    username:string
    gUserId: string
    name: string
    lastname: string
    avatar: string
}
export interface IfindByIdError {
    name:string,
    message:string,
    stringValue:string,
    kind:string,
    value:string,
    path:string,
    reason:any
}
interface MongooseValidationError {
    message: string;
    name: string;
    kind: string;
    path: string;
    value: any;
    properties?: {
      message: string;
      type: string;
      path: string;
      value: any;
    };
    reason?: any;
  }
 
  
export interface MongooseCreateError extends Error {
    name: string;
    message: string;
    errors?: { [key: string]: MongooseValidationError };
    code?: number | string;
    index?: number | string;
    errmsg?: string;
  }
export type DbType="MONGO"|"SQL"
export type SchemaType="goaSchema" |"localSchema"

// trabajar luego con los callbacks 
// interface IDone {
//     done:(err?:Error,response?:any,flash:any)=>void
// }