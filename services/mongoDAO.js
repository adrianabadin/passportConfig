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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const loggerHLP_1 = require("../helper/loggerHLP");
class MongoDAO {
    constructor(db, schemaType, basicSchema = new mongoose_1.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isVerified: { type: Boolean, default: true }
    }), gooogleOauthSchema = new mongoose_1.Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        lastName: String,
        avatar: String
    }), isLocal = (schemaType === 'localSchema'), 
    //Funciones que deben ser iguales
    model = isLocal ? mongoose_1.default.model('localCollection', db.add(basicSchema)) : mongoose_1.default.model('goaCollection', gooogleOauthSchema), findById = (id, cb) => __awaiter(this, void 0, void 0, function* () {
        loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findById" });
        try {
            this.model.findById(id, cb);
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", title: "Error accesing database", message: `${e}` });
        }
    }), findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
        loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findByUserName" });
        try {
            return yield this.model.findOne({ username });
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", title: "Error accesing database", message: `${e}` });
        }
    }), createUser = (user) => __awaiter(this, void 0, void 0, function* () {
        loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser" });
        try {
            return yield this.model.create(user);
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", title: "Error accesing database", message: `${e}` });
        }
    }), returnFields = () => {
        loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields" });
        try {
            return Object.keys(this.model.schema.obj);
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}` });
            return { message: "Something went wrong while retriving schema fields", error: `${e}` };
        }
    }) {
        this.db = db;
        this.schemaType = schemaType;
        this.basicSchema = basicSchema;
        this.gooogleOauthSchema = gooogleOauthSchema;
        this.isLocal = isLocal;
        this.model = model;
        this.findById = findById;
        this.findByUserName = findByUserName;
        this.createUser = createUser;
        this.returnFields = returnFields;
    }
}
module.exports = MongoDAO;
