import {Router} from "express";
import { registerUserController, authenticateUserController, getUserByIdController, getUserByEmailController } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { authorizeRoles } from "../middlewares/auth.roles.js";
import { logOutUser } from "../services/user.service.js";

const userRouter = Router()

// Define routes 
userRouter.route("/register").post(registerUserController)
userRouter.route("/login").post(authenticateUserController)
userRouter.route("/:id").get(verifyJWT,authorizeRoles("admin","user"),getUserByIdController)
userRouter.route("/").get(verifyJWT,authorizeRoles("admin"),getUserByEmailController)
userRouter.route("/logout").post(verifyJWT,authorizeRoles("admin","user"), logOutUser)

export default userRouter


