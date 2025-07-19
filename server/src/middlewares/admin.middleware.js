import { ApiError } from "../utils/ApiError.js";

const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
        return next(); // allow access
    }
    else { 
        throw new ApiError(400, "Admin access denied")
    }
  } 
  catch (error) {
    throw new ApiError(500, "Something went wrong while accessing admin controls")
  }

};

export default isAdmin;
