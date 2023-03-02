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
class SqlDAO {
    constructor(db, dbSchema, schemaType, createUsersTable = () => __awaiter(this, void 0, void 0, function* () {
        if (schemaType === "localSchema") {
            const isTableUsers = yield db.schema.hasTable('users');
            console.log("users", isTableUsers);
            if (!isTableUsers) {
                yield db.schema.createTable('users', (table) => {
                    table.increments('_id').primary();
                    table.string('username').unique();
                    table.string('password');
                    table.boolean('isVerified');
                    Object.keys(dbSchema).forEach((key) => {
                        console.log(key);
                        const keyValue = dbSchema[key];
                        table.primary;
                        if (key !== 'username' && key !== 'password' && key !== 'isVerified' && key !== '_id') {
                            if (typeof table[keyValue] == "function")
                                table[keyValue](key);
                        }
                    });
                });
            }
        }
        else if (this.schemaType === "goaSchema") {
            const isTableUsers = yield this.db.schema.hasTable('goa');
            if (!isTableUsers) {
                yield (this.db).schema.createTable('goa', (table) => {
                    table.increments('_id').primary();
                    table.string('username').unique();
                    table.string('password');
                    table.string('name');
                    table.string('lastname');
                    table.string('avatar');
                });
            }
        }
    }), isTable = (table) => __awaiter(this, void 0, void 0, function* () {
        console.log(yield (yield db).schema.hasTable(table));
        return yield (yield db).schema.hasTable(table);
    }), verifyTableStructure = (table) => __awaiter(this, void 0, void 0, function* () {
        if (yield isTable(table)) { // this.isTable(table)) {
            if (table === "users") {
                const id = yield db.schema.hasColumn(table, "_id");
                console.log("id :", id);
                if (!(yield db.schema.hasColumn(table, "_id")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.increments("_id");
                    });
                if (!(yield db.schema.hasColumn(table, "username")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("username").unique();
                        console.log("username");
                    });
                if (!(yield db.schema.hasColumn(table, "password")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("password");
                        console.log("pass");
                    });
                if (!(yield db.schema.hasColumn(table, "isVerified")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.boolean("isVerified");
                        console.log("veri");
                    });
            }
            else if (table === "goa") {
                if (!(yield db.schema.hasColumn(table, "_id")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.increments("_id");
                    });
                if (!(yield db.schema.hasColumn(table, "username")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("username").unique();
                    });
                if (!(yield db.schema.hasColumn(table, "password")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("password");
                    });
                if (!(yield db.schema.hasColumn(table, "name")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("name");
                    });
                if (!(yield db.schema.hasColumn(table, "lastname")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("lastname");
                    });
                if (!(yield db.schema.hasColumn(table, "avatar")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("avatar");
                    });
            }
        }
        else {
            console.log("create table");
            yield createUsersTable();
        }
    }), model = db((schemaType === "localSchema") ? "users" : "goa"), findById = (id, cb) => __awaiter(this, void 0, void 0, function* () {
        yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
        yield db((schemaType === "localSchema") ? "users" : "goa").where("_id", `${id}`).select("*").then((response) => {
            cb(null, response);
        }).catch((error) => cb(error));
    }), findByUserName = (username) => __awaiter(this, void 0, void 0, function* () {
        return yield db((schemaType === "localSchema") ? "users" : "goa").where("username", username).select("*");
    }), createUser = (user) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield verifyTableStructure((schemaType === "localSchema") ? "users" : "goa");
            return yield db.insert(user).into((schemaType === "localSchema") ? "users" : "goa");
        }
        catch (error) {
            console.log((error.errno === 19) ? "UserName already exists" : error);
        }
    }), returnFields = () => __awaiter(this, void 0, void 0, function* () {
        try {
            return Object.keys(yield db((schemaType === "localSchema") ? "users" : "goa").columnInfo());
        }
        catch (error) {
            console.log(error);
            return ["Hubo un error"];
        }
    })) {
        this.db = db;
        this.dbSchema = dbSchema;
        this.schemaType = schemaType;
        this.createUsersTable = createUsersTable;
        this.isTable = isTable;
        this.verifyTableStructure = verifyTableStructure;
        this.model = model;
        this.findById = findById;
        this.findByUserName = findByUserName;
        this.createUser = createUser;
        this.returnFields = returnFields;
    }
}
exports.SqlDAO = SqlDAO;
