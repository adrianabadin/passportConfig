"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerObject = void 0;
const winston_1 = __importStar(require("winston"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logPath = "passportLogs";
if (!fs_1.default.existsSync(logPath))
    fs_1.default.mkdirSync(logPath);
exports.loggerObject = {
    info: winston_1.default.createLogger({
        level: "info",
        format: winston_1.format.combine(winston_1.format.label({ label: "Logged by passport-fast-config" }), winston_1.format.timestamp(), winston_1.format.prettyPrint(), winston_1.format.colorize()),
        transports: [new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: path_1.default.join(logPath, "info.log") })]
    }),
    warning: winston_1.default.createLogger({
        level: "warning",
        format: winston_1.format.combine(winston_1.format.label({ label: "Logged by passport-fast-config" }), winston_1.format.timestamp(), winston_1.format.prettyPrint(), winston_1.format.colorize()),
        transports: [new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: path_1.default.join(logPath, "warning.log") })]
    }),
    debug: winston_1.default.createLogger({
        level: "debug",
        format: winston_1.format.combine(winston_1.format.label({ label: "Logged by passport-fast-config" }), winston_1.format.timestamp(), winston_1.format.prettyPrint(), winston_1.format.ms(), winston_1.format.colorize()),
        transports: [new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: path_1.default.join(logPath, "debug.log") })]
    }),
    error: winston_1.default.createLogger({
        level: "error",
        format: winston_1.format.combine(winston_1.format.label({ label: "Logged by passport-fast-config" }), winston_1.format.timestamp(), winston_1.format.prettyPrint(), winston_1.format.colorize()),
        transports: [new winston_1.default.transports.Console(),
            new winston_1.default.transports.File({ filename: path_1.default.join(logPath, "error.log") })]
    })
};
