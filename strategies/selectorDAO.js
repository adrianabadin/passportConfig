"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOSelector = void 0;
const MongoDAO = require('./mongoDAO');
class DAOSelector {
    constructor(schemaObject, schemaType, MONGO = new MongoDAO(schemaObject, schemaType)) {
        this.MONGO = MONGO;
    }
}
exports.DAOSelector = DAOSelector;
