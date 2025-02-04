import mongoose from "mongoose";
import  {logger}  from "../utils/logger.js";


 const dbConnect = async()=>{
    try {
        const connectionMethod = await mongoose.connect(process.env.MONGODB_URL);
        logger.info(`DATABASE IS SUCCESSFULLY CONNECTED`)
    } catch (error) {
        logger.warn(`DATABASE CONNECTION FAILED`);
        logger.error(error.message);
    }
}
export {dbConnect}