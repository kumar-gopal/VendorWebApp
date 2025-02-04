import mongoose,{Schema} from "mongoose";

const addressSchema = new Schema({
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    street:{
        type : String,
        required : true
    },
    city: {
        type : String,
        required : true
    },
    state: {
        type : String,
        required : true
    },
    postalCode: {
        type : String,
        required : true
    }
});

const Address = mongoose.model("Address",addressSchema);
export {Address}