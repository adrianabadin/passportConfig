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
exports.DAOSelector = void 0;
//const MongoDAO=require('./mongoDAO')
const mongoDAO_1 = require("./mongoDAO");
const mongoose_1 = __importDefault(require("mongoose"));
const knex_1 = __importDefault(require("knex"));
const loggerHLP_1 = require("../helper/loggerHLP");
const SqlDAO = require('./sqlDAO');
function DAOSelector(db, schemaType, dbType) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMongo = () => {
            return dbType === "MONGO";
        };
        const isSQL = () => {
            return dbType === "SQL";
        };
        const isMongoConnectObject = () => {
            if ("db" in db) {
                if ("dbSchema" in db) {
                    return true;
                }
                else
                    return false;
            }
            else
                return false;
        };
        const isSqlConnectObject = () => {
            if ("db" in db) {
                if (db.db instanceof knex_1.default) {
                    if ("dbSchema" in db) {
                        return true;
                    }
                    else
                        throw new Error("dbSchema should be present on db param");
                }
                throw new Error("db Key should be a knex instance connected to a SQL DB");
            }
            else
                throw new Error("The key db should be present on the db param");
        };
        if (isMongo()) {
            try {
                if (db instanceof (mongoose_1.default.Schema) || isMongoConnectObject()) {
                    const objectInstance = new mongoDAO_1.MongoDAO(db, schemaType);
                    return yield objectInstance.createInstance();
                }
                else
                    throw new Error("Db param should be a mongoose schema or a configuration object containing the keys db and dbSchema {db:string dbSchema {Schema definition}}");
            }
            catch (error) {
                loggerHLP_1.loggerObject.error.error({ level: "error", error, message: "Imposible to create instance" });
            }
        }
        if (isSQL()) {
            try {
                if (isSqlConnectObject()) {
                    const objectInstance = new SqlDAO(db, schemaType);
                    return objectInstance;
                }
            }
            catch (error) {
                loggerHLP_1.loggerObject.error.error({ level: "error", error, message: "Imposible to create instance" });
            }
        }
    });
}
exports.DAOSelector = DAOSelector;
// class DAOSelector implements IDAOSelector {
//    public database:any
//    static instance:any
//    constructor(
//       db:Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB |IdbConnectionObject,
//       schemaType: "goaSchema" |"localSchema",
//       dbType: "MONGO"|"SQL",
//    protected isLocal = (schemaType==="localSchema"),
//    protected isMongo = (dbType==="MONGO"),
//    protected isSQL = (dbType==="SQL"),
//    protected loadDAO = async()=>{
//       const DAO= new MongoDAO(db as Schema<IlocalSchema> | Schema<IgoogleUser> | ImongoDB ,schemaType)
//       this.database=await DAO.createInstance()
//    }
//    ){
//       if (isMongo) this.database= loadDAO()
//       else if (isSQL) this.database = new SqlDAO(db,schemaType)
//   }
//  }
//const DAOSelectorObject =new DAOSelector({db:URL,dbSchema:{phone:{type:Number}}},"localSchema","MONGO")
//console.log(DAOSelectorObject)
exports.default = DAOSelector;
