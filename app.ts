import { Models,Schema as SchemaType} from "mongoose"
import { AuthenticateOptionsGoogle } from "passport-google-oauth20"
import { googleUser, IpassportConfigBuilderReturn, IlocalSchema } from "./types"
const passport =require( 'passport')
const local=require( 'passport-local')
const bcrypt=require( 'bcrypt')
const mongoose=require( 'mongoose')
const Schema=mongoose.Schema
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const LocalStrategy = local.Strategy

function passportConfigBuilder (schemaObject:SchemaType<IlocalSchema>): IpassportConfigBuilderReturn {
//////////////////
//variables
/////////////////
  let userNotFoundMessage:string 
  let incorrectPasswordMessage:string
  let userAlrreadyExistsMessage:string
  let crypt = true
  let googleAuthModel:any
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
    passport.use(
      'register',
      new LocalStrategy(
        { passReqToCallback: true },
        async (req:Request, username:string, password:string, done:any) => {
          try {
            const user = await users.findOne({ username })
            if (user) return done(null, false, 
              { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` }) // error, data
            let newUser = { username, password }
            if (crypt) newUser = { username, password: createHash(password) }
            Object.keys(schemaObject).forEach((key:string) => {
              
              if (req.body !== undefined && req.body !==null)  {
                const value:any =req.body[key as keyof ReadableStream<any>]
                newUser = { ...newUser, [key]: value}}
            })
            try {
              const result = await users.create(newUser)
              return done(null, result)
            } catch (err) {
              done(err,null,{message:"Imposible to register new user"})
            }
          } catch (err) {
            done(err,null,{message:"Imposible to register new user"})
          }
        })
    )
    passport.serializeUser((user:Models, done:any) => {
      done(null, user._id)
    })
    passport.deserializeUser((id:string, done:any) => {
      users.findById(id, done)
    })
    passport.use(
      'login',
      new LocalStrategy(
        async (username:string, password:string, done:any) => {
          try {
            const user = await users.findOne({ username })
            if (!user) return done(null, false, { message: userNotFoundMessage || `User ${username} not found` })
            if (!isValid(user, password)) return done(null, false, { message: incorrectPasswordMessage || `Password provided doesnt match the one stored for ${username}` })
            return done(null, user,{message: `User ${username} successfully loged`})
          } catch (err) {
            done(err)
          }
        }
      )
    )

    return this
  }
  function GoogleoAuth (this:IpassportConfigBuilderReturn, authObject:AuthenticateOptionsGoogle, loginOnly = false):IpassportConfigBuilderReturn {
    const justLogin = async (_accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
      try {
        googleAuthModel = users
        const resultado = await googleAuthModel.findOne({ username: email.emails[0].value })
        if (resultado) {
          return cb(null, resultado)
        }
        return cb(null, false, { message: userNotFoundMessage || `User ${email.emails[0].value} not found` })
      } catch (err) { return cb(err,null,{message:"Error login user"}) }
    }
    const loginAndregister = async (_accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
      try {
        const resultado = await googleAuthModel.findOne({ username: email.emails[0].value })
        if (resultado) {
          return cb(null, resultado)
        }
        try {
          const usercreated = await googleAuthModel.create({ username: email.emails[0].value, password: email.id, name: email.name.givenName, lastname: email.name.familyName, avatar: email.photos[0].value })
          return cb(null, usercreated)
        } catch (err) { return cb(err,null,{message:"Error creating user"}) }
      } catch (err) { return cb(err,null,{message:"Error login with oAuth"}) }
    }
    passport.use(new GoogleStrategy(authObject,
      (loginOnly) ? justLogin : loginAndregister))
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
