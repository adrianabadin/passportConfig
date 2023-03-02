"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOSelector = void 0;
const MongoDAO = require('./mongoDAO');
const sqlDAO_1 = require("./sqlDAO");
class DAOSelector {
    constructor(schemaObject, schemaType, MONGO = new MongoDAO(schemaObject, schemaType), SQL = new sqlDAO_1.SqlDAO(schemaObject, schemaType)) {
        this.MONGO = MONGO;
        this.SQL = SQL;
    }
}
exports.DAOSelector = DAOSelector;
