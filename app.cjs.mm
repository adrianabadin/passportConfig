const passport =require( 'passport')
const local=require( 'passport-local')
const bcrypt=require( 'bcrypt')
const mongoose=require( 'mongoose')
const Schema=mongoose.Schema
const GoogleStrategy=require( 'passport-google-oauth20').Strategy
const LocalStrategy = local.Strategy

function passportConfigBuilder (schemaObject, mongoUrl) {
  mongoose.set('strictQuery', true)
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Mongo Db Connected')).catch(e => console.log(e))
  let crypt = true
  let googleAuthModel
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
  function setCrypt (value) {
    crypt = value
    return this
  }
  const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  const isValid = (user, password) => bcrypt.compareSync(password, user.password)

  const users = mongoose.model('users', new Schema(finalSchema))
  function initializePassport () {
    passport.use(
      'register',
      new LocalStrategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
          try {
            const user = await users.findOne({ username })
            if (user) return done(null, false, { message: `Username ${username} alrready exists` }) // error, data
            let newUser = { username, password }
            if (crypt) newUser = { username, password: createHash(password) }
            Object.keys(schemaObject).forEach(key => {
              newUser = { ...newUser, [key]: req.body[key] }
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
            if (!user) return done(null, false, { message: `User ${username} not found` })
            if (!isValid(user, password)) return done(null, false, { message: `Password provided doesnt match the one stored for ${username}` })
            return done(null, user,{message: `User ${username} successfully loged`})
          } catch (err) {
            done(err)
          }
        }
      )
    )

    return this
  }
  function GoogleoAuth (authObject, loginOnly = false) {
    const justLogin = async (accessToken, refreshToken, profile, email, cb) => {
      try {
        googleAuthModel = users
        const resultado = await googleAuthModel.findOne({ username: email.emails[0].value })
        if (resultado) {
          return cb(null, resultado)
        }
        return cb(null, false, { message: `User ${email.emails[0].value} not found` })
      } catch (err) { return cb(err,null,{message:"Error login user"}) }
    }
    const loginAndregister = async (accessToken, refreshToken, profile, email, cb) => {
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
    passport.serializeUser((user, done) => {
      done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
      googleAuthModel.findById(id, done)
    })
    return this
  }
  return { initializePassport, setCrypt, GoogleoAuth,users,googleAuthModel }
}
module.exports = passportConfigBuilder
