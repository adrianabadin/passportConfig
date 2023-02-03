const passport = require('passport');
const local=require( 'passport-local')
const LocalStrategy = local.Strategy

function registerStrategy(users:any,userAlrreadyExistsMessage:string,createHash:any,schemaObject:any,crypt:boolean){
    passport.use(
      'register',
      new LocalStrategy(
        { passReqToCallback: true },
        async (req:Request, username:string, password:string, done:any) => {
          try {
            const user = await users.findOne({ username })
            if (user) return done(null, false, 
              { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` }) // error, data
            let newUser = loginObjectCreator(users,req)
            if (crypt) newUser = { username, password: createHash(password) }
            newUser.username=username
            newUser.password= crypt ? createHash(password) :password
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
  
  }
  function loginStrategy(users:any,userNotFoundMessage:string,incorrectPasswordMessage:string,isValid:any){
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
  
  }
  function loginObjectCreator(users:any,req:Request){
  let objeto:any 
  Object.keys(users.obj).forEach(keyValue=>{
  if (req.body !==null && req.body[keyValue as keyof ReadableStream<any>]!==undefined){ 
    objeto={...objeto,[keyValue]:req.body[keyValue as keyof ReadableStream<any>]}}
  })
  return objeto
  }
  module.exports ={loginStrategy,registerStrategy}