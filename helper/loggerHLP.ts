import winston,{format} from "winston";
import fs from "fs";
import path from 'path'
const logPath ="passportLogs"
if (!fs.existsSync(logPath)) fs.mkdirSync(logPath)

export const  loggerObject ={
    info: winston.createLogger({
        level:"info",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint(),format.colorize()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path.join(logPath,"info.log")})]
    }),
    warning: winston.createLogger({
        level:"warning",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint(),format.colorize()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path.join(logPath,"warning.log")})]
    }),
    debug: winston.createLogger({
        level:"debug",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint(),format.ms(),format.colorize()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path.join(logPath,"debug.log")})]
    }),
    error: winston.createLogger({
        level:"error",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint(),format.colorize()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path.join(logPath,"error.log")})]
    })

}
