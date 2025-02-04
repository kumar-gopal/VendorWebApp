import mongoose, { Schema } from "mongoose";


const refreshTokenSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    token : {
        type :String,
        required : true
    },
    expiresAt : {
        type : Date,
        required : true
    }
});

refreshTokenSchema.index({expiresAt : 1},{expireAfterSeconds:0});
const RefreshToken = mongoose.model("RefreshToken",refreshTokenSchema);
export {RefreshToken};
