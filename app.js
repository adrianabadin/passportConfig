"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passport = require('passport');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
function passportConfigBuilder(schemaObject) {
    //////////////////
    //variables
    /////////////////
    let userNotFoundMessage = "";
    let incorrectPasswordMessage;
    let userAlrreadyExistsMessage;
    let crypt = true;
    let googleAuthModel;
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
        registerStrategy(users, userAlrreadyExistsMessage, createHash, schemaObject, crypt);
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser((id, done) => {
            users.findById(id, done);
        });
        loginStrategy(users, userNotFoundMessage, incorrectPasswordMessage, isValid);
        return this;
    }
    function GoogleoAuth(authObject, loginOnly = false) {
        const { justLogin, loginAndRegister } = oAuthModes(googleAuthModel, users, userNotFoundMessage);
        passport.use(new GoogleStrategy(authObject, (loginOnly) ? justLogin : loginAndRegister));
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
