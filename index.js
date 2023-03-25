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
const selectorDAO_1 = __importDefault(require("./services/selectorDAO"));
const loggerHLP_1 = require("./helper/loggerHLP");
const passport = require('passport');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { registerStrategy, loginStrategy } = require('./strategies/local');
const oAuthModes = require('./strategies/oAuth2');
////////////////
//SCHEMAS
function passportConfigBuilder(schemaObject, dbType) {
    return __awaiter(this, void 0, void 0, function* () {
        //////////////////
        //variables
        /////////////////
        const DAOlocal = yield (0, selectorDAO_1.default)(schemaObject, "localSchema", dbType); // DaoMongo(schemaObject,"localSchema")
        const DAOgoa = yield (0, selectorDAO_1.default)(schemaObject, "goaSchema", dbType); //DaoMongo(schemaObject,"goaSchema")
        let userNotFoundMessage = "";
        let incorrectPasswordMessage;
        let userAlrreadyExistsMessage;
        let crypt = true;
        let hasVerificationFlag = false;
        let notVerifiedMessage;
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
            passport.serializeUser((user, done) => __awaiter(this, void 0, void 0, function* () {
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "serializeUser", data: yield user["_id"] });
                done(null, yield user._id);
            }));
            passport.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
                yield DAOlocal.findById(id, done); //users.findById(id, done)
            }));
            loginStrategy(DAOlocal, userNotFoundMessage, incorrectPasswordMessage, isValid, notVerifiedMessage);
            return this;
        }
        function GoogleoAuth(authObject, loginOnly = false) {
            const { justLogin, loginAndregister } = oAuthModes(DAOgoa, DAOlocal, userNotFoundMessage);
            passport.use(new GoogleStrategy(Object.assign(Object.assign({}, authObject), { passReqToCallback: true, scope: [
                    "openid",
                    "profile",
                    "email",
                    "https://www.googleapis.com/auth/user.birthday.read",
                    "https://www.googleapis.com/auth/user.phonenumbers.read",
                    "https://www.googleapis.com/auth/user.addresses.read",
                    "https://www.googleapis.com/auth/user.gender.read",
                    "https://www.googleapis.com/auth/user.organization.read"
                ] }), (loginOnly) ? justLogin : loginAndregister));
            passport.serializeUser((user, done) => __awaiter(this, void 0, void 0, function* () {
                done(null, yield user._id);
            }));
            passport.deserializeUser((id, done) => {
                if (loginOnly) {
                    DAOlocal.findById(id, done);
                }
                else {
                    DAOgoa.findById(id, done);
                }
            });
            return this;
        }
        return { buildLocalConfig, setCrypt, GoogleoAuth, setUserNotFoundMessage, setIncorrectPassword, setUserAlrreadyExistsMessage, hasVerification, setNotVerifiedMessage, localModel: DAOlocal.model, goaModel: DAOgoa.model };
    });
}
exports.default = passportConfigBuilder;
