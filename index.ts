import { Models,Schema as SchemaType} from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import { IgoogleUser, IpassportConfigBuilderReturn, IlocalSchema, IDAO } from './types';
import { DAOSelector } from './services/selectorDAO';
const passport =require( 'passport')
const bcrypt=require( 'bcrypt')
const mongoose=require( 'mongoose')
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const {registerStrategy,loginStrategy} = require('./strategies/local')
const oAuthModes=require('./strategies/oAuth2')
////////////////
//SCHEMAS
const googleAuthSchema = new SchemaType<IgoogleUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  lastName: String,
  avatar: String
})
function passportConfigBuilder (schemaObject:SchemaType<IlocalSchema>,dbType: "MONGO" ="MONGO"): IpassportConfigBuilderReturn {
//////////////////
//variables
/////////////////
  const DAOlocal=new DAOSelector(schemaObject,"localSchema")[dbType] // DaoMongo(schemaObject,"localSchema")
  const DAOgoa=new DAOSelector(schemaObject,"goaSchema")[dbType]//DaoMongo(schemaObject,"goaSchema")
  let userNotFoundMessage:string =""
  let incorrectPasswordMessage:string
  let userAlrreadyExistsMessage:string
  let crypt = true
  let googleAuthModel:any

  //schemaObject.add(basicSchema)
/////////////////
//MODELS
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
    registerStrategy(DAOlocal,userAlrreadyExistsMessage,createHash,crypt)
    passport.serializeUser((user:Models, done:any) => {
      done(null, user._id)
    })
    passport.deserializeUser(async (id:string, done:any) => {
     await DAOlocal.findById(id,done) //users.findById(id, done)
    })
    loginStrategy(DAOlocal,userNotFoundMessage,incorrectPasswordMessage,isValid)
    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
   console.log(oAuthModes)
    const {justLogin,loginAndRegister}=oAuthModes(DAOgoa,DAOlocal,userNotFoundMessage) //oAuthModes(DAOgoa.model,DAOlocal.model,userNotFoundMessage)
    passport.use(new GoogleStrategy(authObject,
      (loginOnly) ? justLogin : loginAndRegister))
    passport.serializeUser((user:Models, done:any) => {
      done(null, user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
     if (loginOnly){DAOlocal.findById(id,done)}
     else {DAOgoa.findById(id,done)}
      //googleAuthModel.findById(id, done)
    })
    return this
  }
  return { buildLocalConfig, setCrypt, GoogleoAuth,setUserNotFoundMessage,setIncorrectPassword,setUserAlrreadyExistsMessage,localModel:DAOlocal.model,goaModel:DAOgoa.model }
}


module.exports = passportConfigBuilder
