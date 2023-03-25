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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggerHLP_1 = require("../helper/loggerHLP");
const axios_1 = __importDefault(require("axios"));
function oAuthModes(DAOgoa, DAOlocal, userNotFoundMessage) {
    const justLogin = (_accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
        try {
            //googleAuthModel = users
            const resultado = yield DAOlocal.model.findOne({ username: email.emails[0].value }); // googleAuthModel.findOne({ username: email.emails[0].value })
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", method: "justLogin GoogleoAuth", data: resultado });
            if (resultado) {
                return cb(null, resultado);
            }
            return cb(null, false, { message: userNotFoundMessage || `User ${email.emails[0].value} not found` });
        }
        catch (err) {
            loggerHLP_1.loggerObject.error.error({ level: "error", method: "justLogin GoogleoAuth", message: err });
            return cb(err, null, { message: "Error login user" });
        }
    });
    //VERIFICAR LAS FUNCIONES DE LOGINREGISTER Y LUEGO VOLVER A VER APP.TS
    const loginAndregister = (req, accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
        const authorizationObject = {
            "https://www.googleapis.com/auth/user.birthday.read": "birthdays",
            "https://www.googleapis.com/auth/user.phonenumbers.read	": "phoneNumbers",
            "https://www.googleapis.com/auth/user.addresses.read": "addresses",
            "https://www.googleapis.com/auth/user.gender.read": "genders",
            "https://www.googleapis.com/auth/user.organization.read": "organizations",
            "openid": "",
            "https://www.googleapis.com/auth/userinfo.profile": "",
            "https://www.googleapis.com/auth/userinfo.email": ""
        };
        let urlFields = "";
        const tokenInfo = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
        if ("data" in tokenInfo)
            if ("scope" in tokenInfo.data) {
                console.log("scopes exists");
                tokenInfo.data.scope.split(" ").forEach((scope) => {
                    if (authorizationObject[scope] !== "")
                        urlFields += authorizationObject[scope] + ",";
                });
                urlFields = urlFields.substring(0, urlFields.length);
            }
        console.log(urlFields);
        const extendedData = yield axios_1.default.get(`https://people.googleapis.com/v1/people/${email.id}?personFields=${urlFields}&access_token=${accessToken}`);
        console.log(extendedData.data, Object.keys(extendedData.data));

        try {
            const resultado = yield DAOgoa.findByUserName(email.emails[0].value);
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", method: "Login and Register GoogleoAuth", data: resultado });
            if (resultado) {
                return cb(null, resultado);
            }
            try {
                const fields = yield DAOgoa.returnFields();
                let newUser;
                if (Array.isArray(fields))
                    fields.forEach(field => {
                        if (field in basicObject) {
                            newUser = Object.assign(Object.assign({}, newUser), { [field]: basicObject[field] });
                        }
                        else if (req.body !== null) {
                            newUser = Object.assign(Object.assign({}, newUser), { [field]: req.body[field] });
                        }
                    });
                const peopleObject = yield axios_1.default.get(`https://people.googleapis.com/v1/people/${resultado.id}?personFields=birthdays,genders&access_token=${accessToken}`);
                console.log(peopleObject);
                // aca va la logica que le pide al usuario los datoos a traves de la api people de google
                const usercreated = yield DAOgoa.createUser(newUser);
                return cb(null, usercreated);
            }
            catch (err) {
                loggerHLP_1.loggerObject.error.error({ level: "error", method: "Login and Register GoogleoAuth", message: err });
                return cb(err, null, { message: "Error creating user" });
            }
        }
        catch (err) {
            loggerHLP_1.loggerObject.error.error({ level: "error", method: "Login and Register GoogleoAuth", message: err });
            return cb(err, null, { message: "Error login with oAuth" });
        }
    });
    return { justLogin, loginAndRegister };
}
module.exports = oAuthModes;
