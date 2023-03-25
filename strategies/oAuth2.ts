import { Model, Models } from "mongoose"
import { IAuthorizationScopes, IDAO, IRequest, authorizationTypes } from '../types';
import { loggerObject } from '../helper/loggerHLP';
import axios from "axios"
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
  const loginAndregister = async (req:IRequest,accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any) => {
    const authorizationObject:IAuthorizationScopes ={
      "https://www.googleapis.com/auth/user.birthday.read":"birthdays",
      "https://www.googleapis.com/auth/user.phonenumbers.read":"phoneNumbers",
      "https://www.googleapis.com/auth/user.addresses.read":"addresses",
      "https://www.googleapis.com/auth/user.gender.read":"genders",
      "https://www.googleapis.com/auth/user.organization.read":"organizations",
      "openid":"",
      "https://www.googleapis.com/auth/userinfo.profile":"",
      "https://www.googleapis.com/auth/userinfo.email":""


    }
    let urlFields:string =""
    const tokenInfo =await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`)
    if("data"in tokenInfo) 
      if ("scope" in tokenInfo.data) {
        console.log("scopes exists")
        tokenInfo.data.scope.split(" ").forEach((scope:string)=>{
          if (authorizationObject[scope as keyof IAuthorizationScopes]!=="") urlFields += authorizationObject[scope as keyof IAuthorizationScopes]+","
        })
      urlFields=urlFields.substring(0,urlFields.length)
      }
    console.log(urlFields)
    const extendedData = await axios.get(`https://people.googleapis.com/v1/people/${email.id}?personFields=${urlFields}&access_token=${accessToken}`)
    console.log(extendedData.data,Object.keys(extendedData.data))
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