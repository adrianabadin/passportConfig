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
    users:Models,
    googleAuthModel:Models
}
interface googleUser {
    username:string,
    name?:string,
    lastName?:string,
    avatar?:string
}
interface IlocalSchema{
    username:string,
    password:string,
    [key:string]:string|number|boolean

}
// trabajar luego con los callbacks 
// interface IDone {
//     done:(err?:Error,response?:any,flash:any)=>void
// }