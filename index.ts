import { Models,Schema } from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import {  IpassportConfigBuilderReturn, IlocalSchema, DbType, ImongoDB, IdbConnectionObject,  authorizationTypes } from './types';
import DAOSelector from './services/selectorDAO';
import { loggerObject } from './helper/loggerHLP';
const passport =require( 'passport')
const bcrypt=require( 'bcrypt')
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const {registerStrategy,loginStrategy} = require('./strategies/local')
const oAuthModes=require('./strategies/oAuth2')
////////////////
//SCHEMAS

async function passportConfigBuilder (schemaObject:Schema<IlocalSchema>|ImongoDB |IdbConnectionObject,dbType:DbType ): Promise<IpassportConfigBuilderReturn> {
//////////////////
//variables
/////////////////
  const DAOlocal=await DAOSelector(schemaObject,"localSchema",dbType) // DaoMongo(schemaObject,"localSchema")
  const DAOgoa=await DAOSelector(schemaObject,"goaSchema",dbType)//DaoMongo(schemaObject,"goaSchema")
  let userNotFoundMessage:string =""
  let incorrectPasswordMessage:string
  let userAlrreadyExistsMessage:string
  let crypt = true
  let hasVerificationFlag:boolean=false
  let notVerifiedMessage:string


  ///////////////
  //FUNCTIONS
  //////////////
  
  ////// HELPERS////////
  const createHash = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const isValid = (user:any, password:string) => bcrypt.compareSync(password, user.password as string)  
  
  /////////SETERS////////
  function setUserNotFoundMessage(this:IpassportConfigBuilderReturn, userNotFoundParam:string){
    userNotFoundMessage=userNotFoundParam
    return this
  }
  function setIncorrectPassword(this:IpassportConfigBuilderReturn, incorrectPasswordParam:string){

    incorrectPasswordMessage=incorrectPasswordParam
    return this
  }
  function setUserAlrreadyExistsMessage(this:IpassportConfigBuilderReturn, userExistsParam:string){
    userAlrreadyExistsMessage =userExistsParam
    return this
  }
  function setCrypt (this:IpassportConfigBuilderReturn ,value:boolean):IpassportConfigBuilderReturn {
    crypt = value
    return this 
  }
  function hasVerification (this:IpassportConfigBuilderReturn):IpassportConfigBuilderReturn{
    hasVerificationFlag=true
    return this
  }
  function setNotVerifiedMessage(this:IpassportConfigBuilderReturn,message:string):IpassportConfigBuilderReturn{
    notVerifiedMessage=message
    return this
  }
  /////////BUILDERS///////////////////
  function buildLocalConfig (this:IpassportConfigBuilderReturn):IpassportConfigBuilderReturn {
    registerStrategy(DAOlocal,userAlrreadyExistsMessage,createHash,crypt,hasVerificationFlag)
    passport.serializeUser(async (user:Models, done:any) => {
      loggerObject.debug.debug({level:"debug",message:"serializeUser",data:await user["_id"]})
      done(null,await user._id)
    })
    passport.deserializeUser(async (id:string, done:any) => {
     await DAOlocal.findById(id,done) //users.findById(id, done)
    })
    loginStrategy(DAOlocal,userNotFoundMessage,incorrectPasswordMessage,isValid,notVerifiedMessage)
    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
   
    let needBirthDay:boolean = false
    let needPhone:boolean = false
    const ask4BirthDay = ():void=>{
      needBirthDay=true
    }
    const askPhone =():void=>{
      needPhone=true
    }
    const {justLogin,loginAndregister}=oAuthModes(DAOgoa,DAOlocal,userNotFoundMessage) 
    passport.use(new GoogleStrategy({...authObject,
      passReqToCallback:true,
      scope:[
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/user.birthday.read",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
      "https://www.googleapis.com/auth/user.addresses.read",
      "https://www.googleapis.com/auth/user.gender.read",
      "https://www.googleapis.com/auth/user.organization.read"
    ]},
      (loginOnly) ? justLogin : loginAndregister))
    passport.serializeUser(async (user:Models, done:any) => {
      done(null,await user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
     if (loginOnly){DAOlocal.findById(id,done)}
     else {DAOgoa.findById(id,done)}
    })
    return this
  }
  return { buildLocalConfig, setCrypt, GoogleoAuth,setUserNotFoundMessage,setIncorrectPassword,setUserAlrreadyExistsMessage,hasVerification,setNotVerifiedMessage,localModel:DAOlocal.model,goaModel:DAOgoa.model }
}

export default passportConfigBuilder
