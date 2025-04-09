import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...roles) => {
    return (req,res,next) => {
        if(!req.user || !roles.includes(req.user.role))
        {
            throw new ApiError(403, "You are unauthorized to access this resource");
        }
        next();
    }
}
