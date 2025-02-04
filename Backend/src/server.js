import "dotenv/config";
import express from "express";
const app = express();

import {dbConnect} from "./config/index.js";
import {logger}  from "./utils/logger.js";
import {globalErrorHandler} from "./middleware/errorHandler.js";
import userRoutes from "./route/userRoute.js";
import vendorRoutes from "./route/vendorRoute.js";
import productRoutes from "./route/productRoute.js";
import addressRoutes from "./route/addressRoute.js";
import orderRoutes from "./route/orderRoute.js";
import stripePaymentRoutes from "./route/stripePaymentRoute.js";





const PORT  = process.env.PORT || 3001;


// middleware
app.use(express.json());
app.use(globalErrorHandler);


app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body :--> , ${req.body}`);
    next();
});


// routes
app.use("/api/auth/users",userRoutes);
app.use("/api/v1/vendors",vendorRoutes);
app.use("/api/v1/products",productRoutes);
app.use("/api/auth/users/addresses",addressRoutes);
app.use("/api/v1/orders",orderRoutes);
app.use("/api/v1/payments",stripePaymentRoutes);


app.listen(PORT,()=>{
    logger.info(`Server is running on port: ${PORT}`);
    dbConnect();
});