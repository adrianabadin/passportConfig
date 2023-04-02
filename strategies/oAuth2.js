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
    const loginAndRegister = (accessToken, refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
        try {
            const resultado = yield DAOgoa.findByUserName(email.emails[0].value);
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", method: "Login and Register GoogleoAuth", data: resultado });
            if (resultado) {
                return cb(null, resultado);
            }
            else
                try {
                    const requestedFields = yield getScopeFields(accessToken);
                    const extendedData = yield axios_1.default.get(`https://people.googleapis.com/v1/people/${email.id}?personFields=${requestedFields}&access_token=${accessToken}`);
                    let newUser = yield createNewUser(extendedData, email);
                    loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "New user created by Gooogle oAuth2", data: newUser });
                    const usercreated = yield DAOgoa.createUser(Object.assign(Object.assign({}, newUser), { at: accessToken, rt: refreshToken }));
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
function createNewUser(extendedData, profile) {
    return __awaiter(this, void 0, void 0, function* () {
        let userData = {
            username: profile._json.email,
            name: profile._json.given_name,
            lastname: profile._json.family_name,
            avatar: profile._json.picture
        };
        if (extendedData.status = 200) {
            const switchObject = {
                genders: (field) => {
                    for (let i = 0; i < field.length; i++) {
                        if ("value" in field[i])
                            return field[i].value;
                    }
                },
                birthdays: (field) => {
                    for (let i = 0; i < field.length; i++) {
                        if (field[i].date !== undefined)
                            if (field[i].date["year"] !== undefined)
                                return new Date(field[i].date.year, field[i].date.month - 1, field[i].date.day);
                    }
                },
                organizations: (field) => field
            };
            Object.keys(extendedData.data).forEach((field) => {
                const fieldData = field;
                if (switchObject[fieldData] !== undefined) {
                    const getData = switchObject[fieldData](extendedData.data[field]);
                    if (getData !== undefined) {
                        userData = Object.assign(Object.assign({}, userData), { [fieldData]: getData });
                        if (fieldData === "birthdays")
                            userData = Object.assign(Object.assign({}, userData), { age: calcularEdad(getData) });
                    }
                }
            });
        }
        return userData;
    });
}
function calcularEdad(fechaNacimiento) {
    var hoy = new Date();
    var fechaNac = new Date(fechaNacimiento);
    var edad = hoy.getFullYear() - fechaNac.getFullYear();
    var mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}
function getScopeFields(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationObject = {
            "https://www.googleapis.com/auth/user.addresses.read": "addresses",
            "https://www.googleapis.com/auth/user.birthday.read": "birthdays",
            "https://www.googleapis.com/auth/user.emails.read": "emails",
            "https://www.googleapis.com/auth/user.gender.read": "genders",
            "https://www.googleapis.com/auth/user.organization.read": "organizations",
            "https://www.googleapis.com/auth/user.phonenumbers.read": "phoneNumbers"
        };
        let urlFields = "";
        const tokenInfo = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
        if ("data" in tokenInfo)
            if ("scope" in tokenInfo.data) {
                console.log("scopes exists");
                tokenInfo.data.scope.split(" ").forEach((scope) => {
                    if (authorizationObject[scope] !== undefined)
                        urlFields += authorizationObject[scope] + ",";
                });
                urlFields = urlFields.substring(0, urlFields.length);
            }
        return urlFields;
    });
}
module.exports = oAuthModes;
