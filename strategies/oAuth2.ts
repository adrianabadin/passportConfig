import { Model, Models } from "mongoose"

function oAuthModes(googleAuthModel:any,
    users:Models,
    userNotFoundMessage:string){ 
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
return {justLogin,loginAndregister}
}
module.exports={oAuthModes}