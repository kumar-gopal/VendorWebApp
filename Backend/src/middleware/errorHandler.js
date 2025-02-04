import {logger} from "../utils/logger.js";


// const errorHandler = (err,req,res,next)=>{
//     logger.error(err.stack);

//     res.status(err.status || 500).json({
//         message : err.message || "Internal server error",
//     });
// }


// class ApiError extends Error{
//     constructor(message,statusCode){
//         super(message);
//         this.statusCode = statusCode;
//         this.name = "ApiError";
//     }
// }
class ApiError extends Error{
    constructor(message, statusCode) {
        super(message); 
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        // this.isOperational = true;

        // Error.captureStackTrace(this, this.constructor);
    }
}


const asyncErrorHandler = (fn) => (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(next);
}


const globalErrorHandler = (err,req,res,next)=>{
    logger.error(err.stack);
        
    if(err instanceof ApiError ){
        return res.status(err.statusCode).json({
            status : 'Error',
            message : err.message
        })
    }
    
    // handle mongoose validation
    else if(err.name === "validationError"){
        return res.status(400).json({
            status : "error",
            message : "validation Error",
        });
    }else{
        return res.status(500).json({
            status : "errir",
            message : "An unexpected error occured"
        });
    }
};

export {
    ApiError,
    asyncErrorHandler,
    globalErrorHandler,
}