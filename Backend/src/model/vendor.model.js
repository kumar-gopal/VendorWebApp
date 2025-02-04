import mongoose from "mongoose";


const vendorSchema = new mongoose.Schema({
    companyName :{
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
    },
    vendorId :{
        type : String,
        select:false
    },
    password : {
        type:String,
    },
    role:{
        type : String,
        enum : ["vendor"],
        default : "vendor"
    },
    phone: {
        type: String,
        required: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'] 
    },
    address: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address",
        required : true
    },
    website: {
        type: String,
        trim: true 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' 
    }],
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Inactive'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    paymentInfo: {
        bankAccountNumber: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        ifscCode: {
            type: String,
            required: true
        }
    }
}, { timestamps: true }); 

// Index to optimize search by name or email
vendorSchema.index({ name: 1, email: 1 });

// Create the Vendor model
const Vendor = mongoose.model('Vendor', vendorSchema);

export {Vendor};
