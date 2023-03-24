import { Model, Models } from "mongoose"
import { IDAO, IgoaBasicObject } from '../types';
import { loggerObject } from '../helper/loggerHLP';
import axios from "axios";
import {google} from "googleapis"
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
  const loginAndRegister = async (req:Request,accessToken:any, _refreshToken:any, _profile:any, email:any, cb:any,authOptions:any) => {
    const basicObject:IgoaBasicObject ={
      username:email.emails[0].value,
      gUserId: email.id,
      name: email.name.givenName,
      lastname: email.name.familyName,
      avatar: email.photos[0].value
    }
    try {
      const resultado = await DAOgoa.findByUserName(email.emails[0].value )
      loggerObject.debug.debug({level:"debug",method:"Login and Register GoogleoAuth",data:resultado})
      const oauthClient = new google.auth.OAuth2()
      if (resultado) {
        return cb(null, resultado)
      }
      try {
        const fields=await DAOgoa.returnFields()
        let newUser:any
        if (Array.isArray(fields)) fields.forEach(field =>{
          if (field in basicObject) {
            newUser={...newUser,[field as string]:basicObject[field as keyof IgoaBasicObject]}
          }
          else if (req.body !== null) {
            newUser={...newUser,[field as string]: req.body[field as keyof ReadableStream<any>]}
          }
        })
        const peopleObject = await axios.get(`https://people.googleapis.com/v1/people/${resultado.id}?personFields=birthdays,genders&access_token=${accessToken}`)
        console.log(peopleObject)
        // aca va la logica que le pide al usuario los datoos a traves de la api people de google
        const usercreated = await DAOgoa.createUser(newUser)
        return cb(null, usercreated)
      } catch (err) { 
        loggerObject.error.error({level:"error",method:"Login and Register GoogleoAuth",message:err})        
        return cb(err,null,{message:"Error creating user"}) }
    } catch (err) { 
      loggerObject.error.error({level:"error",method:"Login and Register GoogleoAuth",message:err})
      return cb(err,null,{message:"Error login with oAuth"}) }
  }
return {justLogin,loginAndRegister}
}

module.exports=oAuthModes