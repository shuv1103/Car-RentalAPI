import {Router} from "express";
import { registerUserController, authenticateUserController, getUserByIdController, getUserByEmailController } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { logOutUser } from "../services/user.service.js";

const userRouter = Router()

// Define routes 
userRouter.route("/register").post(registerUserController)
userRouter.route("/login").post(authenticateUserController)
userRouter.route("/userDetailsById").get(verifyJWT,getUserByIdController)
userRouter.route("/userDetailsByEmail").get(verifyJWT,getUserByEmailController)
userRouter.route("/logout").post(verifyJWT, logOutUser)

export default userRouter

// import { Router } from "express";
// import { registerUser, authenticateUser } from "../services/user.service.js";
// import { getUserByEmail, getUserById } from "../repositories/user.repo.js";

// const userRouter = Router()

// // Define routes
// userRouter.route("/register").post(registerUser)
// userRouter.route("/auth").post(authenticateUser)
// userRouter.route("/user-details-id").get(getUserById)
// userRouter.route("/user-details-email").get(getUserByEmail)

// export default userRouter; 
