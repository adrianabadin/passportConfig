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
const loggerHLP_1 = require("../helper/loggerHLP");
/*
Constructor options:
Needs 2 params
1) Object {
    db: the knex funcion passed after connection established
2) String A string that contains "localSchema" or "goaSchema"
serves to establish wich model is generating
}
*/
class SqlDAO {
    constructor({ db, dbSchema }, schemaType, createUsersTable = () => __awaiter(this, void 0, void 0, function* () {
        loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUsersTable" });
        if (schemaType === "localSchema") {
            let isTableUsers;
            try {
                isTableUsers = yield db.schema.hasTable('users');
            }
            catch (e) {
                loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}` });
            }
            if (!isTableUsers) {
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "Creating table" });
                try {
                    yield db.schema.createTable('users', (table) => {
                        table.increments('_id').primary();
                        table.string('username').unique();
                        table.string('password');
                        table.boolean('isVerified');
                        Object.keys(dbSchema).forEach((key) => {
                            const keyValue = dbSchema[key].toLowerCase();
                            table.primary;
                            if (key !== 'username' && key !== 'password' && key !== 'isVerified' && key !== '_id') {
                                if (typeof table[keyValue] == "function")
                                    table[keyValue](key);
                            }
                        });
                    });
                }
                catch (error) {
                    loggerHLP_1.loggerObject.error.error({ message: `${error}`, level: "error" });
                }
            }
        }
        else if (this.schemaType === "goaSchema") {
            const isTableUsers = yield this.db.schema.hasTable('goa');
            if (!isTableUsers) {
                loggerHLP_1.loggerObject.debug.debug({ level: "info", message: "Creating goa Table" });
                try {
                    yield (this.db).schema.createTable('goa', (table) => {
                        table.increments('_id').primary();
                        table.string('username').unique();
                        table.string('password');
                        table.string('name');
                        table.string('lastname');
                        table.string('avatar');
                        loggerHLP_1.loggerObject.debug.debug({ level: "info", message: "GOA table created" });
                    });
                }
                catch (error) {
                    loggerHLP_1.loggerObject.error.error({ level: "error", message: `${error}` });
                }
            }
        }
    }), isTable = (table) => __awaiter(this, void 0, void 0, function* () {
        try {
            loggerHLP_1.loggerObject.debug.debug({ level: "info", message: "isTable", table });
            return yield (yield db).schema.hasTable(table);
        }
        catch (error) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: `${error}` });
            return false;
        }
    }), verifyTableStructure = (table) => __awaiter(this, void 0, void 0, function* () {
        try {
            loggerHLP_1.loggerObject.debug.info({ level: "debug", message: "verifyTableStructure" });
            if (yield isTable(table)) {
                if (table === "users") {
                    try {
                        const id = yield db.schema.hasColumn(table, "_id");
                        if (!(yield db.schema.hasColumn(table, "_id"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.increments("_id");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "ID added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing _id field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "username"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("username").unique();
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "username added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing username field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "password"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("password");
                                console.log("pass");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "password added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing password field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "isVerified"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.boolean("isVerified");
                                console.log("veri");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "isVerified added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing isVerified field" });
                    }
                }
                else if (table === "goa") {
                    try {
                        if (!(yield db.schema.hasColumn(table, "_id"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.increments("_id");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "ID added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing _id field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "username"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("username").unique();
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "username added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing username field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "password"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("password");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "password added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing password field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "name"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("name");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "name added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing name field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "lastname"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("lastname");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "lastname added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing lastname field" });
                    }
                    try {
                        if (!(yield db.schema.hasColumn(table, "avatar"))) {
                            yield this.db.schema.alterTable(table, (tableBuilder) => {
                                tableBuilder.string("avatar");
                            });
                            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "avatar added" });
                        }
                    }
                    catch (e) {
                        loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}`, title: "Error by verifing avatar field" });
                    }
                }
            }
            else {
                loggerHLP_1.loggerObject.info.info({ level: "info", message: "Table doesnt exists creating table" });
                try {
                    yield createUsersTable();
                }
                catch (e) {
                    loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}` });
                }
            }
        }
        catch (error) {
            loggerHLP_1.loggerObject.error.error({ level: "error", title: "Error verifing table structure", message: `${error}` });
        }
    }), model = db((schemaType === "localSchema") ? "users" : "goa"), findById = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
            return yield db((schemaType === "localSchema") ? "users" : "goa").where("_id", `${id}`).select("*").then((response) => {
                loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findById", data: response, DAOName: "SqlDAO" });
            }).catch((error) => loggerHLP_1.loggerObject.error.error({ level: "error", message: "Error retriving data", function: "findByID SQL", error }));
        }
        catch (e) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: `${e}` });
        }
    }), findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
            const data = yield db((schemaType === "localSchema") ? "users" : "goa").where("username", username).select("*");
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "findByUserName", data: data[0], DAOName: "SqlDAO" });
            return (data.length > 0) ? data[0] : false;
        }
        catch (error) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: "Error accesing Database" });
        }
    }), createUser = (user) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
            const data = yield db.insert(user).into((schemaType === "localSchema") ? "users" : "goa").then(() => __awaiter(this, void 0, void 0, function* () { return yield db((schemaType === "localSchema") ? "users" : "goa").where("username", user.username).select("*"); })).catch(error => loggerHLP_1.loggerObject.error.error({ level: "error", message: (error.errno === 19) ? "UserName already exists" : `${error}` }));
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "createUser", data, DAOName: "SqlDAO" });
            return (Array.isArray(data)) ? data[0] : data;
        }
        catch (error) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: (error.errno === 19) ? "UserName already exists" : `${error}` });
        }
    }), returnFields = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
            const data = Object.keys(yield db((schemaType === "localSchema") ? "users" : "goa").columnInfo());
            loggerHLP_1.loggerObject.debug.debug({ level: "debug", message: "returnFields", data, DAOName: "SqlDAO" });
            return data;
        }
        catch (error) {
            loggerHLP_1.loggerObject.error.error({ level: "error", message: `${error}` });
            return { message: "Hubo un error", error: `${error}` };
        }
    })) {
        this.schemaType = schemaType;
        this.createUsersTable = createUsersTable;
        this.isTable = isTable;
        this.verifyTableStructure = verifyTableStructure;
        this.model = model;
        this.findById = findById;
        this.findByUserName = findByUserName;
        this.createUser = createUser;
        this.returnFields = returnFields;
        if (db === undefined || dbSchema === undefined) {
            loggerHLP_1.loggerObject.error.error({ message: "Fatal Error", error: "Invalid schemaObject db:Knex expected abd dbSchema:{fields:Knex.Schematype} expected" });
            throw new Error("Invalid schemaObject db:Knex expected abd dbSchema:{fields:Knex.Schematype} expected");
        }
        this.db = db;
        this.dbSchema = dbSchema;
    }
}
module.exports = SqlDAO;
