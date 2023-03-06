import mongoose,{Schema} from "mongoose";
mongoose.connect(process.env.MONGODB).then(()=>console.log("Connected to MongoDB"))
const data=new Schema({name:String})
Object.keys()