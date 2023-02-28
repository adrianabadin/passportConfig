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
exports.SqlDAO = void 0;
const uuid_1 = require("uuid");
class SqlDAO //implements IDAO
 {
    constructor(db, //:Knex<Tables>,
    OMR, schemaType, isLocal = () => (schemaType === "localSchema"), hasField = (field) => __awaiter(this, void 0, void 0, function* () {
        const fields = yield this.db.columnInfo();
        return field in fields;
    }), tableName = () => __awaiter(this, void 0, void 0, function* () {
        const arraySQL = this.db.toString().split("(`");
        return arraySQL[arraySQL.length - 1].slice(0, arraySQL[arraySQL.length - 1].length - 2);
    }), modelConstructor = () => __awaiter(this, void 0, void 0, function* () {
        console.log("es local:", isLocal());
        if (isLocal()) {
            if (!(yield hasField("username"))) {
                yield this.OMR.schema.alterTable(yield tableName(), (table) => {
                    table.unique("username");
                    table.string("username");
                });
            }
            if (!(yield hasField("password"))) {
                yield this.OMR.schema.alterTable(yield tableName(), (table) => {
                    table.string("password");
                });
            }
            if (!(yield hasField("_id"))) {
                yield this.OMR.schema.alterTable(yield tableName(), (table) => {
                    table.string("_id");
                });
            }
            if (!(yield hasField("isValidated"))) {
                yield this.OMR.schema.alterTable(yield tableName(), (table) => {
                    table.boolean("isValidated");
                });
            }
            return true;
        }
        return false;
    }), model = db, findById = (id, cb) => __awaiter(this, void 0, void 0, function* () {
        (yield this.model).where({ _id: id }).select("*").then((response) => {
            cb(null, response);
        }).catch((error) => cb(error));
    }), findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
        return yield (yield this.model).where({ username }).select("*").then((result) => {
            return result;
        }).catch((error) => error);
    }), createUser = (user) => __awaiter(this, void 0, void 0, function* () {
        //const model= await this.modelConstructor()
        console.log("texto", yield modelConstructor());
        return yield this.db.insert(Object.assign(Object.assign({}, user), { _id: (0, uuid_1.v4)() }));
    })) {
        this.db = db;
        this.OMR = OMR;
        this.schemaType = schemaType;
        this.isLocal = isLocal;
        this.hasField = hasField;
        this.tableName = tableName;
        this.modelConstructor = modelConstructor;
        this.model = model;
        this.findById = findById;
        this.findByUserName = findByUserName;
        this.createUser = createUser;
    }
}
exports.SqlDAO = SqlDAO;
