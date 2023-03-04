import { loggerObject } from '../helper/loggerHLP';
import { IDAO, ErrorMessage } from '../types';

const passport = require('passport');
const local=require( 'passport-local')
const LocalStrategy = local.Strategy
function registerStrategy(DAO:IDAO,userAlrreadyExistsMessage:string,createHash:any,crypt:boolean,hasVerificationFlag:boolean){
    passport.use(
      'register',
      new LocalStrategy(
        { passReqToCallback: true },
        async (req:Request, username:string, password:string, done:any) => {
          try {
            loggerObject.debug.debug({level:"debug",message:"Register Local Strategy"})
            const user = await DAO.findByUserName(username) //await users.findOne({ username })
            if (user) return done(null, false, 
              { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` })
            let newUser = await loginObjectCreator(DAO.returnFields(),req)
            newUser = {...newUser, username, password: crypt ? createHash(password):password,isVerified:!hasVerificationFlag }
            
            try {
              const result = await DAO.createUser(newUser) //users.create(newUser)
             
              return done(null, result)//.findOne(id)
            } catch (err) {
              loggerObject.error.error({level:"Error",message:"Database error creating user",err})
              done(err,null,{message:"Imposible to register new user"})
            }
          } catch (err) {
            loggerObject.error.error({level:"Error",message:"Database error creating user",err})
            done(err,null,{message:"Imposible to register new user"})
          }
        })
    )
  
  }
function loginStrategy(DAO:IDAO,userNotFoundMessage:string,incorrectPasswordMessage:string,isValid:any,notVerifiedMessage:string){
    passport.use(
      'login',
      new LocalStrategy(
        async (username:string, password:string, done:any) => {
          try {
            loggerObject.debug.debug({level:"debug",message:"Login Local Strategy"})
            const user = await DAO.findByUserName(username)//users.findOne({ username })
            loggerObject.debug.debug({level:"debug",message:"Login User Data",data:user})
            if (!user) return done(null, false, { message: userNotFoundMessage || `User ${username} not found` })
            //aca va el if que verifica si el usuario fue confirmado
            if (user.isVerified){ 
            if (!isValid(user, password)) 
            {
              return done(null, false, { message: incorrectPasswordMessage || `Password provided doesnt match the one stored for ${username}` })
            }
            
            return done(null, user,{message: `User ${username} successfully loged`})
          }else return done(null,false,{message:notVerifiedMessage || `User ${username} is not verified`})
          } catch (err) {
            done(err)
          }
        }
      )
    )
  
  }
  async function loginObjectCreator(fields:string[]|ErrorMessage | Promise<string[]|ErrorMessage>,req:Request){
  let objeto:any 
  
  try{
  if (Array.isArray(await fields)===true) {
  const fieldsObject:string[] = await fields as string[]
    fieldsObject.forEach(keyValue=>{
  if (req.body !==null && req.body[keyValue as keyof ReadableStream<any>]!==undefined){ 
    objeto={...objeto,[keyValue]:req.body[keyValue as keyof ReadableStream<any>]}}
  })
  loggerObject.debug.debug({level:"debug",message:`loginObjectCreator`,data:objeto})
  return objeto
}
else {
  loggerObject.error.error({level:"error",method:"loginObjectCreator",message:"Missing Data"})
  return {message:"Something went wrong while retriving fields from model",error:fields}
  }
}catch(e){loggerObject.error.error({level:"error",message:`${e}`})}
}
module.exports = {loginStrategy,registerStrategy}