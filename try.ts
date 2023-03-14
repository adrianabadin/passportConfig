import passportConfigBuilder from './index'
import { ImongoDB } from './types'
const URL = "mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority"
async function data1(){
     const dbObject:ImongoDB ={db:URL,dbSchema:{phone:{type:Number}}}
     const data = await passportConfigBuilder(dbObject,"MONGO")
     console.log(data)
}
data1()