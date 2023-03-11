import mongoose,{Schema} from "mongoose";
const URL = "mongodb+srv://dcsweb:MopG23GHLEu3GwB0@dcsweb.snm3hyr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(process.env.MONGODB).then(()=>console.log("Connected to MongoDB"))
const data=new Schema({name:String})
Object.keys()