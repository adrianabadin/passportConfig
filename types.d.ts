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
// trabajar luego con los callbacks 
// interface IDone {
//     done:(err?:Error,response?:any,flash:any)=>void
// }