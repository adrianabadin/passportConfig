import { Model, Models } from "mongoose"
import { IDAO } from '../types';
import { loggerObject } from '../helper/loggerHLP';

function oAuthModes(DAOgoa:IDAO,
    DAOlocal:IDAO,
    userNotFoundMessage:string){ 
    const justLogin = async (_accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
    try {
      //googleAuthModel = users
      const resultado = await DAOlocal.model.findOne({username: email.emails[0].value})// googleAuthModel.findOne({ username: email.emails[0].value })
      loggerObject.debug.debug({level:"debug",method:"justLogin GoogleoAuth",data:resultado})
      if (resultado) {
        return cb(null, resultado)
      }
      return cb(null, false, { message: userNotFoundMessage || `User ${email.emails[0].value} not found` })
    } catch (err) { 
      loggerObject.error.error({level:"error",method:"justLogin GoogleoAuth",message:err})
      return cb(err,null,{message:"Error login user"}) }
  }
  //VERIFICAR LAS FUNCIONES DE LOGINREGISTER Y LUEGO VOLVER A VER APP.TS
  const loginAndregister = async (_accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
    try {
      const resultado = await DAOgoa.findByUserName(email.emails[0].value )
      loggerObject.debug.debug({level:"debug",method:"Login and Register GoogleoAuth",data:resultado})
      if (resultado) {
        return cb(null, resultado)
      }
      try {
        const usercreated = await DAOgoa.createUser({ username: email.emails[0].value, password: email.id, name: email.name.givenName, lastname: email.name.familyName, avatar: email.photos[0].value })
        return cb(null, usercreated)
      } catch (err) { 
        loggerObject.error.error({level:"error",method:"Login and Register GoogleoAuth",message:err})        
        return cb(err,null,{message:"Error creating user"}) }
    } catch (err) { 
      loggerObject.error.error({level:"error",method:"Login and Register GoogleoAuth",message:err})
      return cb(err,null,{message:"Error login with oAuth"}) }
  }
return {justLogin,loginAndregister}
}

module.exports=oAuthModes