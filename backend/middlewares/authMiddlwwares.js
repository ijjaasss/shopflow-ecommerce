import env from "../config/env.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import AppError from "../utils/appError.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {

    
       let token;


    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
  
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1]; 
    }
  


    if (!token) {
         
      return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
   
   
    req.user = await User.findById(decoded.id).select("-password");
   
   
    next();
 
})

export const isAdmin = (req, res, next) => {
  console.log(req.user);
  
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    next(new AppError("Access denied. Admins only.", 403));
  }
};

