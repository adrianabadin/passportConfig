import { Models } from "mongoose";
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
    goaModel:Models
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
}
export interface IDAOSelector {
MONGO: IDAO
}
// trabajar luego con los callbacks 
// interface IDone {
//     done:(err?:Error,response?:any,flash:any)=>void
// }