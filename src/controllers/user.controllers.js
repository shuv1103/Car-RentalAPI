import { registerUser, authenticateUser, logOutUser} from "../services/user.service.js";
import { getUserById, getUserByEmail } from "../repositories/user.repo.js" 

// Controller for handling user registration
const registerUserController =  async (req,res) => {
    registerUser(req,res); 
}

// Controller for handling user login
const authenticateUserController = async (req, res) => {
    // Call the authenticateUser function directly
    authenticateUser(req, res);
}

// Controller for handling user logout
const logoutUserController = async (req, res) => {
    logOutUser(req,res);
}
// Controller to get user by ID
const getUserByIdController = async (req, res) => {
    // Call the repository function to fetch user by ID
    getUserById(req,res);
}

// Controller to get user by email
const getUserByEmailController = async (req, res) => {  
    // Call the repository function to fetch user by email
    getUserByEmail(req,res);
}

export { registerUserController, authenticateUserController, logoutUserController, getUserByIdController, getUserByEmailController };
