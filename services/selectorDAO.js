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
const MongoDAO = require('./mongoDAO');
const SqlDAO = require('./sqlDAO');
console.log(SqlDAO);
class DAOSelector {
    constructor(db, schemaType, dbType, isLocal = (schemaType === "localSchema"), isMongo = (dbType === "MONGO"), isSQL = (dbType === "SQL"), loadDAO = () => __awaiter(this, void 0, void 0, function* () {
        return yield new MongoDAO(db, schemaType).createInstance();
    })) {
        this.isLocal = isLocal;
        this.isMongo = isMongo;
        this.isSQL = isSQL;
        this.loadDAO = loadDAO;
        if (isMongo)
            this.database = loadDAO();
        else if (isSQL)
            this.database = new SqlDAO(db, schemaType);
    }
}
const URL = "mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority";
const DAOSelectorObject = new DAOSelector({ db: URL, dbSchema: { phone: { type: Number } } }, "localSchema", "MONGO");
console.log(DAOSelectorObject);
exports.default = DAOSelector;
