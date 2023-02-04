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
const passport = require('passport');
const local = require('passport-local');
const LocalStrategy = local.Strategy;
function registerStrategy(users, userAlrreadyExistsMessage, createHash, schemaObject, crypt) {
    passport.use('register', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield users.findOne({ username });
            if (user)
                return done(null, false, { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` });
            let newUser = loginObjectCreator(users, req);
            newUser = Object.assign(Object.assign({}, newUser), { username, password: crypt ? createHash(password) : password });
            try {
                const result = yield users.create(newUser);
                return done(null, result);
            }
            catch (err) {
                done(err, null, { message: "Imposible to register new user" });
            }
        }
        catch (err) {
            done(err, null, { message: "Imposible to register new user" });
        }
    })));
}
function loginStrategy(users, userNotFoundMessage, incorrectPasswordMessage, isValid) {
    passport.use('login', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield users.findOne({ username });
            if (!user)
                return done(null, false, { message: userNotFoundMessage || `User ${username} not found` });
            if (!isValid(user, password))
                return done(null, false, { message: incorrectPasswordMessage || `Password provided doesnt match the one stored for ${username}` });
            return done(null, user, { message: `User ${username} successfully loged` });
        }
        catch (err) {
            done(err);
        }
    })));
}
function loginObjectCreator(users, req) {
    let objeto;
    Object.keys(users.schema.obj).forEach(keyValue => {
        if (req.body !== null && req.body[keyValue] !== undefined) {
            objeto = Object.assign(Object.assign({}, objeto), { [keyValue]: req.body[keyValue] });
        }
    });
    return objeto;
}
module.exports = { loginStrategy, registerStrategy };
