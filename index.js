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
const selectorDAO_1 = require("./services/selectorDAO");
const passport = require('passport');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { registerStrategy, loginStrategy } = require('./strategies/local');
const oAuthModes = require('./strategies/oAuth2');
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
function passportConfigBuilder(schemaObject, dbType = "MONGO") {
    //////////////////
    //variables
    /////////////////
    const DAOlocal = new selectorDAO_1.DAOSelector(schemaObject, "localSchema")[dbType]; // DaoMongo(schemaObject,"localSchema")
    const DAOgoa = new selectorDAO_1.DAOSelector(schemaObject, "goaSchema")[dbType]; //DaoMongo(schemaObject,"goaSchema")
    let userNotFoundMessage = "";
    let incorrectPasswordMessage;
    let userAlrreadyExistsMessage;
    let crypt = true;
    let googleAuthModel;
    let hasVerificationFlag = false;
    let notVerifiedMessage;
    //schemaObject.add(basicSchema)
    /////////////////
    //MODELS
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
    function hasVerification() {
        hasVerificationFlag = true;
        return this;
    }
    function setNotVerifiedMessage(message) {
        notVerifiedMessage = message;
        return this;
    }
    /////////BUILDERS///////////////////
    function buildLocalConfig() {
        registerStrategy(DAOlocal, userAlrreadyExistsMessage, createHash, crypt, hasVerificationFlag);
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
            yield DAOlocal.findById(id, done); //users.findById(id, done)
        }));
        loginStrategy(DAOlocal, userNotFoundMessage, incorrectPasswordMessage, isValid);
        return this;
    }
    function GoogleoAuth(authObject, loginOnly = false) {
        console.log(oAuthModes);
        const { justLogin, loginAndRegister } = oAuthModes(DAOgoa, DAOlocal, userNotFoundMessage); //oAuthModes(DAOgoa.model,DAOlocal.model,userNotFoundMessage)
        passport.use(new GoogleStrategy(authObject, (loginOnly) ? justLogin : loginAndRegister));
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => {
            if (loginOnly) {
                DAOlocal.findById(id, done);
            }
            else {
                DAOgoa.findById(id, done);
            }
            //googleAuthModel.findById(id, done)
        });
        return this;
    }
    return { buildLocalConfig, setCrypt, GoogleoAuth, setUserNotFoundMessage, setIncorrectPassword, setUserAlrreadyExistsMessage, hasVerification, setNotVerifiedMessage, localModel: DAOlocal.model, goaModel: DAOgoa.model };
}
module.exports = passportConfigBuilder;
