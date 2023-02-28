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
        if (this.schemaType === "localSchema") {
            const isTableUsers = yield this.db.schema.hasTable('users');
            if (!isTableUsers) {
                yield (this.db).schema.createTable('users', (table) => {
                    table.increments('_id').primary();
                    table.string('username');
                    table.string('password');
                    table.boolean('isVerified');
                    Object.keys(this.dbSchema).forEach((key) => {
                        console.log(key);
                        const keyValue = this.dbSchema[key];
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
                    table.string('username');
                    table.string('password');
                    table.string('name');
                    table.string('lastname');
                    table.string('avatar');
                });
            }
        }
    }), isTable = (table) => __awaiter(this, void 0, void 0, function* () {
        return yield (this.db).schema.hasTable(table);
    }), verifyTableStructure = (table) => __awaiter(this, void 0, void 0, function* () {
        if (yield this.isTable(table)) {
            if (table === "users") {
                const id = yield this.db.schema.hasColumn(table, "_id");
                console.log("id :", id);
                if (!(yield this.db.schema.hasColumn(table, "_id")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.increments("_id");
                    });
                if (!(yield this.db.schema.hasColumn(table, "username")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("username").unique();
                    });
                if (!(yield this.db.schema.hasColumn(table, "password")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("password");
                    });
                if (!(yield this.db.schema.hasColumn(table, "isVerified")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.boolean("isVerified");
                    });
            }
            else if (table === "goa") {
                if (!(yield this.db.schema.hasColumn(table, "_id")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.increments("_id");
                    });
                if (!(yield this.db.schema.hasColumn(table, "username")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("username").unique();
                    });
                if (!(yield this.db.schema.hasColumn(table, "password")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("password");
                    });
                if (!(yield this.db.schema.hasColumn(table, "name")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("name");
                    });
                if (!(yield this.db.schema.hasColumn(table, "lastname")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("lastname");
                    });
                if (!(yield this.db.schema.hasColumn(table, "avatar")))
                    yield this.db.schema.alterTable(table, (tableBuilder) => {
                        tableBuilder.string("avatar");
                    });
            }
        }
        else
            createUsersTable();
    })) {
        this.db = db;
        this.dbSchema = dbSchema;
        this.schemaType = schemaType;
        this.createUsersTable = createUsersTable;
        this.isTable = isTable;
        this.verifyTableStructure = verifyTableStructure;
    }
}
exports.SqlDAO = SqlDAO;
