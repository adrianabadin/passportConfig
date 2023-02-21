"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function oAuthModes(DAOgoa, DAOlocal, userNotFoundMessage) {
    const justLogin = (_accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
        try {
            //googleAuthModel = users
            const resultado = yield DAOlocal.model.findOne({ username: email.emails[0].value }); // googleAuthModel.findOne({ username: email.emails[0].value })
            if (resultado) {
                return cb(null, resultado);
            }
            return cb(null, false, { message: userNotFoundMessage || `User ${email.emails[0].value} not found` });
        }
        catch (err) {
            return cb(err, null, { message: "Error login user" });
        }
    });
    //VERIFICAR LAS FUNCIONES DE LOGINREGISTER Y LUEGO VOLVER A VER APP.TS
    const loginAndregister = (_accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
        try {
            const resultado = yield DAOgoa.findByUserName(email.emails[0].value);
            if (resultado) {
                return cb(null, resultado);
            }
            try {
                const usercreated = yield DAOgoa.createUser({ username: email.emails[0].value, password: email.id, name: email.name.givenName, lastname: email.name.familyName, avatar: email.photos[0].value });
                return cb(null, usercreated);
            }
            catch (err) {
                return cb(err, null, { message: "Error creating user" });
            }
        }
        catch (err) {
            return cb(err, null, { message: "Error login with oAuth" });
        }
    });
    return { justLogin, loginAndregister };
}
/*function oAuthModes(googleAuthModel:any,
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
} */
module.exports = oAuthModes;
