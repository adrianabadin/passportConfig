import { Models,Schema as SchemaType} from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import { googleUser, IpassportConfigBuilderReturn, IlocalSchema } from "./types"
const passport =require( 'passport')
const bcrypt=require( 'bcrypt')
const mongoose=require( 'mongoose')
const Schema=mongoose.Schema
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const {registerStrategy,loginStrategy} = require('./strategies/local')
const oAuthModes=require('./strategies/oAuth2')
////////////////
//SCHEMAS
const googleAuthSchema = new SchemaType<googleUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  lastName: String,
  avatar: String
})
const basicSchema = {
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}
function passportConfigBuilder (schemaObject:SchemaType<IlocalSchema>): IpassportConfigBuilderReturn {
//////////////////
//variables
/////////////////
  let userNotFoundMessage:string =""
  let incorrectPasswordMessage:string
  let userAlrreadyExistsMessage:string
  let crypt = true
  let googleAuthModel:any

  schemaObject.add(basicSchema)
/////////////////
//MODELS
  const users = mongoose.model('users', new Schema(schemaObject))
  googleAuthModel = mongoose.model('usersGoogleAuthModel', googleAuthSchema)

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
  /////////BUILDERS///////////////////
  function buildLocalConfig (this:IpassportConfigBuilderReturn):IpassportConfigBuilderReturn {
    registerStrategy(users,userAlrreadyExistsMessage,createHash,schemaObject,crypt)
    passport.serializeUser((user:Models, done:any) => {
      done(null, user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
      users.findById(id, done)
    })
    loginStrategy(users,userNotFoundMessage,incorrectPasswordMessage,isValid)
    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
    const {justLogin,loginAndRegister}=oAuthModes(googleAuthModel,users,userNotFoundMessage)
    passport.use(new GoogleStrategy(authObject,
      (loginOnly) ? justLogin : loginAndRegister))
    passport.serializeUser((user:Models, done:any) => {
      done(null, user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
      googleAuthModel.findById(id, done)
    })
    return this
  }
  return { buildLocalConfig, setCrypt, GoogleoAuth,setUserNotFoundMessage,setIncorrectPassword,setUserAlrreadyExistsMessage,users,googleAuthModel }
}


module.exports = passportConfigBuilder
