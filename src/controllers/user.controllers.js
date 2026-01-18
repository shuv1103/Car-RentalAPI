import { registerUser, authenticateUser, logOutUser} from "../services/user.service.js";
import { getUserById, getUserByEmail } from "../repositories/user.repo.js" 

// Controller for handling user registration
const registerUserController =  async (req,res,next) => {
    registerUser(req,res,next); 
}

// Controller for handling user login
const authenticateUserController = async (req, res,next) => {
    // Call the authenticateUser function directly
    authenticateUser(req, res,next);
}

// Controller for handling user logout
const logoutUserController = async (req, res,next) => {
    logOutUser(req,res,next);
}
// Controller to get user by ID
const getUserByIdController = async (req, res,next) => {
    // Call the repository function to fetch user by ID
    getUserById(req,res,next);
}

// Controller to get user by email
const getUserByEmailController = async (req, res,next) => {  
    // Call the repository function to fetch user by email
    getUserByEmail(req,res,next);
}

export { registerUserController, authenticateUserController, logoutUserController, getUserByIdController, getUserByEmailController };
