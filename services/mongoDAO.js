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
exports.MongoDAO = void 0;
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
        avatar: String,
        age: Number,
        birthdays: Date,
        genders: String,
        organizations: [],
        adress: String,
        at: String,
        rt: String
    }), isLocal = (schemaType === 'localSchema'), isSchema = (data) => {
        if (data instanceof mongoose_1.Schema)
            return true;
        else
            return false;
    }, isModel = (data) => {
        if ("schema" in data && "findOne" in data && "findById" in data)
            return true; // && "findOne" in data && "save" in data ) return true 
        return false;
    }, isDbConnected = () => {
        return mongoose_1.default.connection.readyState === 2;
    }, isDbConnectionSchema = (db) => {
        if (!isSchema(db)) {
            if ("db" in db && "dbSchema" in db) {
                if (typeof db["db"] === "string") {
                    let response;
                    try {
                        const schema = new mongoose_1.Schema(db.dbSchema);
                        response = false;
                    }
                    catch (e) {
                        response = e;
                    }
                    return response;
                }
            }
        }
        return false;
    }, ClassBuilder = () => __awaiter(this, void 0, void 0, function* () {
        let dataSchema;
        let dbConnectionObject;
        if (isSchema(db)) {
            dataSchema = db;
            this.model = isLocal ? mongoose_1.default.model('localCollection', dataSchema.add(basicSchema)) : mongoose_1.default.model('goaCollection', dataSchema.add(gooogleOauthSchema));
        }
        else if (!isDbConnectionSchema(db)) {
            dbConnectionObject = db;
            let schema = new mongoose_1.Schema(dbConnectionObject.dbSchema);
            this.model = isLocal ? mongoose_1.default.model('localCollection', schema.add(basicSchema)) : mongoose_1.default.model("goaCollection", schema.add(gooogleOauthSchema));
        }
        this.findById = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findById", response });
                return response;
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error", title: error.name === "CastError"
                        ? "Wrong ID Structure"
                        : error.name === "DocumentNotFoundError"
                            ? "Document not Founded"
                            : error.name, message: error.message, error: error.reason });
            }
        });
        this.findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findOne({ username });
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findByUserName", response });
                return response;
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error", title: error.name === "CastError"
                        ? "Wrong ID Structure"
                        : error.name === "DocumentNotFoundError"
                            ? "Document not Founded"
                            : error.name, message: error.message, error: error.reason });
            }
        });
        this.createUser = (user) => __awaiter(this, void 0, void 0, function* () {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser" });
            try {
                const response = yield this.model.create(user);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser", response });
                return response;
            }
            catch (e) {
                const error = e;
                loggerHLP_1.loggerObject.error.error({ level: "error",
                    title: error.name === "ValidationError"
                        ? "Object parsed dont Validate mongoose schema"
                        : error.name === "CastError"
                            ? "Error converting types"
                            : error.name === "MongoError"
                                ? "Mongo Error"
                                : error.name,
                    message: error.message, error: error.errmsg ? error.errmsg : error });
            }
        });
        this.returnFields = () => {
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields", model: this.model });
            // console.log(this.model,isModel(this.model))
            if (isModel(this.model)) {
                const response = Object.keys(this.model.schema.obj);
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields", response });
                return response;
            }
            else {
                loggerHLP_1.loggerObject.error.error({ level: "error", message: "This.model is not an instance of mongoose.models so it is imposible to retrive fields", error: "This.model is not defined" });
                return { message: "This.model is not an instance of mongoose.models so it is imposible to retrive fields", error: "This.model is not defined" };
            }
        };
        ////FIN DE CLASSBUILDER  
    })) {
        this.db = db;
        this.schemaType = schemaType;
        this.basicSchema = basicSchema;
        this.gooogleOauthSchema = gooogleOauthSchema;
        this.isLocal = isLocal;
        this.isSchema = isSchema;
        this.isModel = isModel;
        this.isDbConnected = isDbConnected;
        this.isDbConnectionSchema = isDbConnectionSchema;
        this.ClassBuilder = ClassBuilder;
        this.createInstance = () => __awaiter(this, void 0, void 0, function* () {
            if (schemaType === "localSchema") {
                if (MongoDAO.localInstance === undefined) {
                    MongoDAO.localInstance = new MongoDAO(db, schemaType);
                    yield MongoDAO.localInstance.ClassBuilder();
                }
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", model: MongoDAO.localInstance.model, schemaType });
                return MongoDAO.localInstance;
            }
            else {
                if (schemaType === "goaSchema") {
                    if (MongoDAO.goaInstance === undefined) {
                        MongoDAO.goaInstance = new MongoDAO(db, schemaType);
                        yield MongoDAO.goaInstance.ClassBuilder();
                    }
                    loggerHLP_1.loggerObject.debug.debug({ level: "debug", model: MongoDAO.goaInstance.model, schemaType });
                    return MongoDAO.goaInstance;
                }
            }
        });
        const data = this.db;
        if (this.isSchema(db)) {
            if (this.isDbConnected()) {
                this.createInstance();
            }
            else
                throw new Error("Db must be conected before if you are using a Schema as param");
        }
        else {
            if (!isDbConnectionSchema(data.dbSchema)) {
                mongoose_1.default.set("strictQuery", false);
                mongoose_1.default.connect(data.db)
                    .then(() => {
                    if (schemaType === "goaSchema") {
                        if (MongoDAO.goaInstance !== undefined) {
                            return MongoDAO.goaInstance;
                        }
                    }
                    else if (schemaType === "localSchema") {
                        if (MongoDAO.localInstance !== undefined)
                            return MongoDAO.localInstance;
                    }
                    loggerHLP_1.loggerObject.info.info({ level: "info", message: "Connecting to MongoDB" });
                    this.createInstance();
                })
                    .catch(error => {
                    loggerHLP_1.loggerObject.error.error({ level: "error", message: "Error Connecting to Mongo DB", error });
                });
            }
            else
                throw new Error("The params provided should be a mongoose schema or a configuration object containig the following structure {db:'Conection String',dbSchema:{a valid schema definition}}");
        }
    }
}
exports.MongoDAO = MongoDAO;
