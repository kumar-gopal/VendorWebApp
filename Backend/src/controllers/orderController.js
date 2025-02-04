import { Order } from "../model/order.model.js"; 
import { Address } from "../model/address.model.js";
import { Vendor } from "../model/vendor.model.js";
import { logger } from "../utils/logger.js";


// Create an order
export const createOrder = async (req, res) => {
    logger.info(`Creation order Api Hit`);
    // const {error,value} = validateOrderData(req.body);
    // if(error){
    //     logger.warn(`Input Validation Failed ${error.details[0]?.message}`);
    //     return res.return({
    //         message : `Input Validation Failed`,
    //         success : false,
    //         error : error.details[0]?.message
    //     });
    // }
    // const {items, shippingAddress, paymentMethod} = value;
    const {items, shippingAddress, paymentMethod} = req.body;
    
    for(const item of items){
        console.log(item);
    }
    logger.info(`shippingAddress -> , ${shippingAddress} and ${paymentMethod} and  req.user.id -> ${ req.vendor.id}`);
    try {
        // Validate user and address existence
        const userExists = await Vendor.findById(req.vendor.id);
        const addressExists = await Address.findById(shippingAddress);
        logger.warn(`userExists ${userExists} and addressExists ${addressExists}`)

        if (!userExists || !addressExists) {
            return res.status(404).json({ 
                message: "Customer or Shipping Address not found", 
                success: false 
            });
        }

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            if (!item.productId || !item.quantity || !item.price) {
                throw new Error("Invalid item structure.");
            }
            return total + (item.quantity * item.price);
        }, 0);

        // Create the order
        const newOrder = new Order({
            customer : req.vendor.id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
        });

        const savedOrder = await newOrder.save();
        logger.info(`Order created successfully`);
        res.status(201).json({
            message: "Order created successfully",
            success: true,
            data: savedOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating order",
            success: false,
            error: error.message
        });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("customer", "username email")
            .populate("items.productId", "name price")
            .populate("shippingAddress", "street city state postalCode");

        res.status(200).json({
            message: "Orders fetched successfully",
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching orders",
            success: false,
            error: error.message
        });
    }
};

// Get a specific order
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate("customer", "username email")
            .populate("items.productId", "name price")
            .populate("shippingAddress", "street city state postalCode");

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order fetched successfully",
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching order",
            success: false,
            error: error.message
        });
    }
};

// Update an order
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order updated successfully",
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating order",
            success: false,
            error: error.message
        });
    }
};

export const updateOrderStatus = async(req,res)=>{
    res.status(200).json({
        message : "Status is updated"
    })
}
// Delete an order
export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Order deleted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting order",
            success: false,
            error: error.message
        });
    }
};
