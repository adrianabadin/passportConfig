"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDAO = require('./mongoDAO');
const SqlDAO = require('./sqlDAO');
console.log(SqlDAO);
class DAOSelector {
    constructor(MONGO = MongoDAO, SQL = SqlDAO) {
        this.MONGO = MONGO;
        this.SQL = SQL;
    }
}
const DAOSelectorObject = new DAOSelector();
exports.default = DAOSelectorObject;
