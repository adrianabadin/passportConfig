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
const loggerHLP_1 = require("../helper/loggerHLP");
const passport = require('passport');
const local = require('passport-local');
const LocalStrategy = local.Strategy;
function registerStrategy(DAO, userAlrreadyExistsMessage, createHash, crypt, hasVerificationFlag) {
    passport.use('register', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "Register Local Strategy" });
            const user = yield DAO.findByUserName(username); //await users.findOne({ username })
            if (user)
                return done(null, false, { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` });
            let newUser = yield loginObjectCreator(DAO.returnFields(), req);
            newUser = Object.assign(Object.assign({}, newUser), { username, password: crypt ? createHash(password) : password, isVerified: !hasVerificationFlag });
            try {
                const result = yield DAO.createUser(newUser); //users.create(newUser)
                return done(null, result); //.findOne(id)
            }
            catch (err) {
                loggerHLP_1.loggerObject.error.error({ level: "Error", message: "Database error creating user", err });
                done(err, null, { message: "Imposible to register new user" });
            }
        }
        catch (err) {
            loggerHLP_1.loggerObject.error.error({ level: "Error", message: "Database error creating user", err });
            done(err, null, { message: "Imposible to register new user" });
        }
    })));
}
function loginStrategy(DAO, userNotFoundMessage, incorrectPasswordMessage, isValid, notVerifiedMessage) {
    passport.use('login', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "Login Local Strategy" });
            const user = yield DAO.findByUserName(username); //users.findOne({ username })
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "Login User Data", data: user });
            if (!user)
                return done(null, false, { message: userNotFoundMessage || `User ${username} not found` });
            //aca va el if que verifica si el usuario fue confirmado
            if (user.isVerified) {
                if (!isValid(user, password)) {
                    return done(null, false, { message: incorrectPasswordMessage || `Password provided doesnt match the one stored for ${username}` });
                }
                return done(null, user, { message: `User ${username} successfully loged` });
            }
            else
                return done(null, false, { message: notVerifiedMessage || `User ${username} is not verified` });
        }
        catch (err) {
            done(err);
        }
    })));
}
function loginObjectCreator(fields, req) {
    return __awaiter(this, void 0, void 0, function* () {
        let objeto;
        try {
            if (Array.isArray(yield fields) === true) {
                const fieldsObject = yield fields;
                fieldsObject.forEach(keyValue => {
                    if (req.body !== null && req.body[keyValue] !== undefined) {
                        objeto = Object.assign(Object.assign({}, objeto), { [keyValue]: req.body[keyValue] });
                    }
                });
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: `loginObjectCreator`, data: objeto });
                return objeto;
            }
            else {
                loggerHLP_1.loggerObject.error.error({ level: "error", method: "loginObjectCreator", message: "Missing Data" });
                return { message: "Something went wrong while retriving fields from model", error: fields };
            }
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}` });
        }
    });
}
module.exports = { loginStrategy, registerStrategy };
