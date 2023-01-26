"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.passportConfigBuilder = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const LocalStrategy = passport_local_1.default.Strategy;
function passportConfigBuilder(schemaObject, url) {
    let crypt = true;
    let googleAuthModel;
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
    googleAuthModel = mongoose_1.default.model('usersGoogleAuthModel', googleAuthSchema);
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
    const finalSchema = Object.assign(Object.assign({}, schemaObject), basicSchema);
    function setCrypt(value) {
        crypt = value;
        return this;
    }
    const createHash = (password) => bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
    const isValid = (user, password) => bcrypt_1.default.compareSync(password, user.password);
    const users = mongoose_1.default.model('users', new mongoose_1.Schema(finalSchema));
    function initializePassport() {
        passport_1.default.use('register', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users.findOne({ username });
                if (user)
                    return done(null, false); // error, data
                let newUser = { username, password };
                if (crypt)
                    newUser = { username, password: createHash(password) };
                Object.keys(schemaObject).forEach(key => {
                    newUser = Object.assign(Object.assign({}, newUser), { [key]: req.body[key] });
                });
                try {
                    const result = yield users.create(newUser);
                    return done(null, result);
                }
                catch (err) {
                    done(err);
                }
            }
            catch (err) {
                done(err);
            }
        })));
        passport_1.default.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport_1.default.deserializeUser((id, done) => {
            users.findById(id, done);
        });
        passport_1.default.use('login', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users.findOne({ username });
                if (!user)
                    return done(null, false, { type: 'error', message: `User ${username} doesnt exist` });
                if (!isValid(user, password))
                    return done(null, false, { type: 'error', message: `Wrong Password` });
                return done(null, user);
            }
            catch (err) {
                done(err);
            }
        })));
        passport_1.default.serializeUser((username, done) => {
            console.log(username);
            done(null, username);
        });
        passport_1.default.deserializeUser((id, done) => __awaiter(this, void 0, void 0, function* () {
            yield users.findOne({ id }, done);
        }));
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
                return cb(null, false, { type: 'error', message: `User ${email.emails[0].value} does not exist` });
            }
            catch (err) {
                return cb(err);
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
                    return cb(err);
                }
            }
            catch (err) {
                return cb(err);
            }
        });
        passport_1.default.use(new passport_google_oauth20_1.Strategy(authObject, (loginOnly) ? justLogin : loginAndregister));
        passport_1.default.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport_1.default.deserializeUser((id, done) => {
            googleAuthModel.findById(id, done);
        });
        return this;
    }
    return { initializePassport, setCrypt, GoogleoAuth };
}
exports.passportConfigBuilder = passportConfigBuilder;
exports.default = passportConfigBuilder;
