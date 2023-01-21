import passport from 'passport'
import local from 'passport-local'
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'
const LocalStrategy = local.Strategy
export function passportConfigBuilder (schemaObject) {
  let crypt = true
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
  function setCrypt (value) {
    crypt = value
    return this
  }
  const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const isValid = (user, password) => bcrypt.compareSync(password, user.password)

  const users = mongoose.model('users', new Schema(finalSchema))
  const initializePassport = () => {
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

    passport.serializeUser((user, done) => {
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
            if (!user) return done(null, false)
            if (!isValid(user, password)) return done(null, false)
            return done(null, user)
          } catch (err) {
            done(err)
          }
        }
      )
    )
  }
  return { initializePassport, setCrypt }
}
export default passportConfigBuilder
