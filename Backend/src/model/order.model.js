import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
// Order Schema
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    },
}); 


// Main order schema
const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema], // Array of items in the order
    totalAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', 
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Bank Transfer'],
        required: true
    },
    trackingNumber: {
        type: String,
        default: uuidv4
    }
}, { timestamps: true }); 


const Order = mongoose.model('Order', orderSchema);

 export { 
    Order
 };
