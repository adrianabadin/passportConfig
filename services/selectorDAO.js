"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOSelector = void 0;
const MongoDAO = require('./mongoDAO');
const SqlDAO = require('./sqlDAO');
console.log(SqlDAO);
class DAOSelector {
    constructor(schemaObject, schemaType, MONGO = MongoDAO, //(schemaObject,schemaType,),
    SQL = new SqlDAO(schemaObject, schemaType)) {
        this.MONGO = MONGO;
        this.SQL = SQL;
    }
}
exports.DAOSelector = DAOSelector;
