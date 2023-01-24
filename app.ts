import passport from 'passport'
import local from 'passport-local'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
const LocalStrategy = local.Strategy
export function passportConfigBuilder (schemaObject:any) {
  let crypt = true
  let googleAuthModel: any
  const googleAuthSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: String,
    lastName: String,
    avatar: String
  })
  googleAuthModel = mongoose.model('usersGoogleAuthModel', googleAuthSchema)
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
  const finalSchema = { ...schemaObject, ...basicSchema }
  function setCrypt (value:boolean) {
    crypt = value
    return this
  }
  const createHash = (password:string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const isValid = (user:any, password:string) => bcrypt.compareSync(password, user.password)

  const users = mongoose.model('users', new Schema(finalSchema))
  function initializePassport () {
    passport.use(
      'register',
      new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
          try {
            const user = await users.findOne({ username })
            if (user) return done(null, false) // error, data
            let newUser = { username, password }
            if (crypt) newUser = { username, password: createHash(password) }
            Object.keys(schemaObject).forEach(key => {
              newUser = { ...newUser, [key]: req.body[key] }
            })
            try {
              const result = await users.create(newUser)
              return done(null, result)
            } catch (err) {
              done(err)
            }
          } catch (err) {
            done(err)
          }
        })
    )

    passport.serializeUser((user:any, done) => {
      done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
      users.findById(id, done)
    })

    passport.use(
      'login',
      new LocalStrategy(
        async (username, password, done) => {
          try {
            const user = await users.findOne({ username })
            if (!user) return done(null, false,{type: 'error', message:`User ${username} doesnt exist` } as any)
            if (!isValid(user, password)) return done(null, false,{type: 'error', message:`Wrong Password`  } as any)
            return done(null, user)
          } catch (err) {
            done(err)
          }
        }
      )
    )
    return this
  }
  function GoogleoAuth (authObject:any, loginOnly = false) {
    const justLogin = async (_accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
      try {
        googleAuthModel = users
        const resultado = await googleAuthModel.findOne({ username: email.emails[0].value })
        if (resultado) {
          return cb(null, resultado)
        }
        return cb(null, false,{type: 'error', message:`User ${email.emails[0].value} does not exist`})
      } catch (err) { return cb(err) }
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
        } catch (err) { return cb(err) }
      } catch (err) { return cb(err) }
    }
    passport.use(new GoogleStrategy(authObject,
      (loginOnly) ? justLogin : loginAndregister))
    passport.serializeUser((user:any, done) => {
      done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
      googleAuthModel.findById(id, done)
    })
    return this
  }
  return { initializePassport, setCrypt, GoogleoAuth }
}
export default passportConfigBuilder
