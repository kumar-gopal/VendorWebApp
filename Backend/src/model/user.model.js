import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    username : {
        type:String,
        required:true,
        unique:true,
    },
    email : {
        type:String,
        required:true,
        unique:true,
        lowercase : true,
        trim : true,match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address'] 
    },
    password : {
        type:String,
        required:true,
    },
    role:{
        type : String,
        enum : ["user","admin"],
        default : "user"
    }
    
});

userSchema.index({ username: 1 });
const User = mongoose.model("User",userSchema);
export  {User};