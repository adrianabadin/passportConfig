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
const mongoose_1 = require("mongoose");
const passport = require('passport');
const local = require('passport-local');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = local.Strategy;
function passportConfigBuilder(schemaObject) {
    //////////////////
    //variables
    /////////////////
    let userNotFoundMessage;
    let incorrectPasswordMessage;
    let userAlrreadyExistsMessage;
    let crypt = true;
    let googleAuthModel;
    ////////////////
    //SCHEMAS
    const googleAuthSchema = new mongoose_1.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        lastName: String,
        avatar: String
    });
    const basicSchema = {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    };
    schemaObject.add(basicSchema);
    /////////////////
    //MODELS
    const users = mongoose.model('users', new Schema(schemaObject));
    googleAuthModel = mongoose.model('usersGoogleAuthModel', googleAuthSchema);
    ///////////////
    //FUNCTIONS
    //////////////
    ////// HELPERS////////
    const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const isValid = (user, password) => bcrypt.compareSync(password, user.password);
    /////////SETERS////////
    function setUserNotFoundMessage(userNotFoundParam) {
        userNotFoundMessage = userNotFoundParam;
        return this;
    }
    function setIncorrectPassword(incorrectPasswordParam) {
        incorrectPasswordMessage = incorrectPasswordParam;
        return this;
    }
    function setUserAlrreadyExistsMessage(userExistsParam) {
        userAlrreadyExistsMessage = userExistsParam;
        return this;
    }
    function setCrypt(value) {
        crypt = value;
        return this;
    }
    /////////BUILDERS///////////////////
    function buildLocalConfig() {
        passport.use('register', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users.findOne({ username });
                if (user)
                    return done(null, false, { message: userAlrreadyExistsMessage || `Username ${username} alrready exists` }); // error, data
                let newUser = { username, password };
                if (crypt)
                    newUser = { username, password: createHash(password) };
                Object.keys(schemaObject).forEach((key) => {
                    if (req.body !== undefined && req.body !== null) {
                        const value = req.body[key];
                        newUser = Object.assign(Object.assign({}, newUser), { [key]: value });
                    }
                });
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
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => {
            users.findById(id, done);
        });
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
        return this;
    }
    function GoogleoAuth(authObject, loginOnly = false) {
        const justLogin = (_accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
            try {
                googleAuthModel = users;
                const resultado = yield googleAuthModel.findOne({ username: email.emails[0].value });
                if (resultado) {
                    return cb(null, resultado);
                }
                return cb(null, false, { message: userNotFoundMessage || `User ${email.emails[0].value} not found` });
            }
            catch (err) {
                return cb(err, null, { message: "Error login user" });
            }
        });
        const loginAndregister = (_accessToken, _refreshToken, _profile, email, cb) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resultado = yield googleAuthModel.findOne({ username: email.emails[0].value });
                if (resultado) {
                    return cb(null, resultado);
                }
                try {
                    const usercreated = yield googleAuthModel.create({ username: email.emails[0].value, password: email.id, name: email.name.givenName, lastname: email.name.familyName, avatar: email.photos[0].value });
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
        passport.use(new GoogleStrategy(authObject, (loginOnly) ? justLogin : loginAndregister));
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => {
            googleAuthModel.findById(id, done);
        });
        return this;
    }
    return { buildLocalConfig, setCrypt, GoogleoAuth, setUserNotFoundMessage, setIncorrectPassword, setUserAlrreadyExistsMessage, users, googleAuthModel };
}
module.exports = passportConfigBuilder;
