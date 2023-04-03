import { Models, SchemaDefinition } from "mongoose";
import { Knex } from "knex";
import { Number,Union,List } from 'ts-toolbelt';
//export type isBisiesto<Y extends List.Flatten<Number.Range<1900,2200>,0>[0]>= Y extends (infer ) ;

// export type dateType<Y extends number,M extends List.Flatten<Number.Range<1,12>,0>[0],D extends number> = M extends 1|3|5|7|8|10|12  
//   ? List.Flatten<Number.Range<0,31>,0>[0] 
//   : M extends 4|6|9|11 
//     ? List.Flatten<Number.Range<0,30>,0>[0] 
//     : M extends 2
//     ? (Y % 4 extends 0 ? List.Flatten<Number.Range<1, 29>, 0>[0] : List.Flatten<Number.Range<1, 28>, 0>[0])
//     : never;
      

export type monthWith30Days = List.Flatten<Number.Range<0,31>,0>[0]


interface IpassportConfigBuilderReturn {
    buildLocalConfig:()=>IpassportConfigBuilderReturn, 
    setCrypt:(value:boolean)=>IpassportConfigBuilderReturn,
    GoogleoAuth: (authObject:AuthenticateOptionsGoogle,loginOnly?:boolean)=>IpassportConfigBuilderReturn,
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
    avatar?:string,
    age?:string,
    birthdays?:string,
    organizations?:[],
    genders?:string,
    adress?:string,
    at?:string,
    rt?:string,
}
export interface IlocalSchema{
    username:string,
    password:string,
    [key:string]:string|number|boolean

}
export interface IDAO {
model:Model<any>,
findById: (id:string)=>Promise<any>,
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
export type authorizationTypes= "birthdays" | "phoneNumbers"| "addresses"|"genders"|"organizations"|""
export interface IAuthorizationScopes {

    "https://www.googleapis.com/auth/user.emails.read"?:"emails"
    "https://www.googleapis.com/auth/user.birthday.read"?:"birthdays",
    "https://www.googleapis.com/auth/user.phonenumbers.read"?:"phoneNumbers",
    "https://www.googleapis.com/auth/user.addresses.read"?:"addresses",
    "https://www.googleapis.com/auth/user.gender.read"?:"genders",
    "https://www.googleapis.com/auth/user.organization.read":"organizations",
    
}
export interface IRequest extends Express.Request {
    authInfo?:{
        scopes?:string
    }
}

type dateDayMonthType={date:{month:any,day:any}};
type fullDateType ={date:{month:any,day:any,year:any}};
type birthdaysType=Array<dateDayMonthType,fullDateType>;
type peopleGendersType= [
 
 {    metadata: {
      primary: boolean,
      source: { type: string, id: string }
    },
    value: 'male' |"female",
    formattedValue: 'Male'|"Female"
}]
  type peopleBirthdaysType=[
    {
      metadata: {
        primary: boole,
        source: { type: 'PROFILE'|"ACCOUNT", id: string }
      },
      date: {year?:number, month: number, day: number }
    },
    {
      metadata: { source: { type: "PROFILE"|'ACCOUNT', id: string } },
      date: { year?: number, month: number, day: number }
    }
  ]
  //type compositeDateType<Y extends number,M extends number, D extends number> = Y extends (Y / 4) extends number ?  :
  type daysOfMonth= 1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31
  type monthsOfYear=1|2|3|4|5|6|7|8|9|10|11|12
  type peopleOrganizationsType=[        {
    metadata: { source: { type: 'PROFILE'|"ACCOUNT", id: string } },
    type: string,
    formattedType: string,
    startDate: { year: number, month:monthsOfYear, day: daysOfMonth },
    endDate: { year: number, month:monthsOfYear, day: daysOfMonth },
    current: boolean,
    name: string,
    title: string
  }]
export type basicUserType ={    
name: string,
lastname: string,
age: number,

alias: string,
avatar: string,
username: string,
password: string,
isVerified: boolean
}
export type profileType={
    id: string,
    displayName: string,
    name: { familyName: string, givenName: string },
    emails: [ { value: string, verified:boolean } ],
    photos: [
      {
        value: string
      }
    ],
    provider: string,
   _json: {
      sub: string,
      name: string,
      given_name: string,
      family_name: string,
      picture: string,
      email: string,
      email_verified: boolean,
      locale: 'es' | 'en',
    }
  }
export type PeopleFieldsType = "genders"|"birthdays"|"organizations"|"resourceName"|"etag"
export type PeopleDataType<T extends PeopleFieldsType> = 
T extends "genders" 
    ?  peopleGendersType
    : T extends "birthdays"
        ? peopleBirthdaysType
        : T extends "organizations" 
            ? peopleOrganizationsType 
            : string   

        


