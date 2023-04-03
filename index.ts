import { Models,Schema } from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import {  IpassportConfigBuilderReturn, IlocalSchema, DbType, ImongoDB, IdbConnectionObject } from './types';
import DAOSelector from './services/selectorDAO';
import { loggerObject } from './helper/loggerHLP';
const passport =require( 'passport')
const bcrypt=require( 'bcrypt')
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const {registerStrategy,loginStrategy} = require('./strategies/local')
const oAuthModes=require('./strategies/oAuth2')
////////////////
//SCHEMAS
//SCOPES DE GOOGLEOAUTH 

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
      loggerObject.debug.debug({level: "debug",model1:DAOlocal.model,model2:DAOgoa.model})
        let data =await DAOlocal.findById(id) //users.findById(id, done)
      if (data) done(null,data)
      else data=await DAOgoa.findById(id,done) //users.findById(id, done)
      
      done(null,data)
      })
 
    loginStrategy(DAOlocal,userNotFoundMessage,incorrectPasswordMessage,isValid,notVerifiedMessage)
    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
  
    const {justLogin,loginAndRegister}=oAuthModes(DAOgoa,DAOlocal,userNotFoundMessage) 
    passport.use(new GoogleStrategy(authObject,(loginOnly) ? justLogin : loginAndRegister))
    passport.serializeUser(async (user:Models, done:any) => {
      done(null,await user._id)
    })
    passport.deserializeUser(async (id:string, done:any) => {
      loggerObject.debug.debug({level: "debug",model1:DAOlocal.model,model2:DAOgoa.model})
        let data =await DAOlocal.findById(id) //users.findById(id, done)
      if (data) done(null,data)
      else {data=await DAOgoa.findById(id,) //users.findById(id, done)
      done(null,data)}
      })
    return this
  }
  return { buildLocalConfig, setCrypt, GoogleoAuth,setUserNotFoundMessage,setIncorrectPassword,setUserAlrreadyExistsMessage,hasVerification,setNotVerifiedMessage,localModel:DAOlocal.model,goaModel:DAOgoa.model }
}

export default passportConfigBuilder
