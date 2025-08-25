import User from "../models/User.js";
import AppError from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken} from "../utils/generateToken.js";
import { isValid } from "../utils/validation.js";


export const registerUser = asyncHandler(async (req, res,next) => {
 
    const { name, email, password } = req.body;

    if(!isValid(name, email, password)){
    return  next(new AppError("Please provide all required fields", 400));
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
       return next(new AppError("User already exists", 400));
   
    }

 
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data:{
        _id: user._id,
        name: user.name,
        email: user.email,
        }
      });
    } else {
          return next(new AppError("Invalid user data", 400));
    
    }

})

export const loginUser =asyncHandler( async (req, res,next) => {
  try {
    const { email, password } = req.body;
if (!isValid(email,password)) {
   return next(new AppError("Please provide email and password", 400));

  }

    const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
       return next(new AppError("Invalid credentials", 400));

  }
   
  sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export const getUserProfile = async (req, res, next) => {
  try {
   
    res.status(200).json({
      success: true,
      user:req.user,
    });
  } catch (error) {
    next(error);
  }
};