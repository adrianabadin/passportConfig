import winston,{format} from "winston";
import fs from "fs"
const path="./passportLogs/"
if (!fs.existsSync(path)) fs.mkdirSync(path)

export const  loggerObject ={
    info: winston.createLogger({
        level:"info",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path+"info.log"})]
    }),
    warning: winston.createLogger({
        level:"warning",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path+"warning.log"})]
    }),
    debug: winston.createLogger({
        level:"debug",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint(),format.ms()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path+"debug.log"})]
    }),
    error: winston.createLogger({
        level:"error",
        format:format.combine(format.label({label:"Logged by passport-fast-config"}),format.timestamp(),format.prettyPrint()),
        transports:[new winston.transports.Console(),
                    new winston.transports.File({filename:path+"error.log"})]
    })

}
