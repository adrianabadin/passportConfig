import { IAuthorizationScopes, IDAO, PeopleDataType, PeopleFieldsType, basicUserType, profileType } from '../types';
import { loggerObject } from '../helper/loggerHLP';
import axios, { AxiosResponse } from "axios"

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

  const loginAndRegister = async (accessToken:any, refreshToken:any, _profile:any, email:profileType, cb:any) => {
    try {
      const resultado = await DAOgoa.findByUserName(email.emails[0].value )
      loggerObject.debug.debug({level:"debug",method:"Login and Register GoogleoAuth",data:resultado})
     
      if (resultado) {
        return cb(null, resultado)
      } else try {
        const requestedFields = await getScopeFields(accessToken)
        const extendedData:AxiosResponse = await axios.get(`https://people.googleapis.com/v1/people/${email.id}?personFields=${requestedFields}&access_token=${accessToken}`)
        let newUser =await createNewUser(extendedData,email)      
        loggerObject.debug.debug({level:"debug",message:"New user created by Gooogle oAuth2",data:newUser})
        const usercreated = await DAOgoa.createUser({...newUser,at:accessToken,rt:refreshToken})
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
async function createNewUser(extendedData:AxiosResponse,profile:profileType){
  let userData:Partial<basicUserType & PeopleDataType<PeopleFieldsType>>= {
    username:profile._json.email,
    name:profile._json.given_name,
    lastname:profile._json.family_name,
    avatar:profile._json.picture}

  if (extendedData.status=200){
  const switchObject={
  genders:(field:PeopleDataType<"genders">)=> {
    for (let i=0;i<field.length;i++){
      if ("value" in field[i]) return field[i].value
    }
  },
  birthdays:(field:PeopleDataType<"birthdays">)=> {
    for (let i=0;i<field.length;i++){
      if (field[i].date !==undefined)
         if (field[i].date["year"]!==undefined) 
          return new Date(field[i].date.year as number,field[i].date.month-1,field[i].date.day)
        
    }
  },
  organizations:(field:PeopleDataType<"organizations">)=>field
}
Object.keys(extendedData.data).forEach((field:any)=>
{
  const fieldData :PeopleFieldsType = field as  "genders"|"birthdays"|"organizations";
  if (switchObject[fieldData]!==undefined)
  {
    const getData =switchObject[fieldData](extendedData.data[field])
    if (getData!==undefined) {userData={...userData,[fieldData]:getData}
     if(fieldData==="birthdays") userData={...userData,age:calcularEdad(getData as Date)} }
  }
})

}

return userData  
}
function calcularEdad(fechaNacimiento:Date):number {
  var hoy = new Date();
  var fechaNac = new Date(fechaNacimiento);
  var edad = hoy.getFullYear() - fechaNac.getFullYear();
  var mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
}
async function getScopeFields(token:string):Promise<string>{
  const authorizationObject:IAuthorizationScopes ={
    "https://www.googleapis.com/auth/user.addresses.read":"addresses",
    "https://www.googleapis.com/auth/user.birthday.read":"birthdays",
    "https://www.googleapis.com/auth/user.emails.read":"emails",
    "https://www.googleapis.com/auth/user.gender.read":"genders",
    "https://www.googleapis.com/auth/user.organization.read":"organizations",
    "https://www.googleapis.com/auth/user.phonenumbers.read":"phoneNumbers"    
  }
  let urlFields:string =""
  const tokenInfo =await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`)
  if("data"in tokenInfo) 
    if ("scope" in tokenInfo.data) {
      console.log("scopes exists")
      tokenInfo.data.scope.split(" ").forEach((scope:string)=>{
        if (authorizationObject[scope as keyof IAuthorizationScopes]!== undefined) urlFields += authorizationObject[scope as keyof IAuthorizationScopes]+","
      })
    urlFields=urlFields.substring(0,urlFields.length)
    }
return urlFields
}
module.exports=oAuthModes