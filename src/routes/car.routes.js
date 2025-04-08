import { Router } from "express"
import {getAvailableCarsController,addCarController,updateCarController,deleteCarController,checkCarAvailabilityController,rentCarController,getCarByIdController} from "../controllers/car.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const carRouter = Router();

// Define routes
carRouter.route("/").post(verifyJWT,addCarController) // (ADMIN-SIDE) post request to add car to DB
carRouter.route("/:id/rent").post(verifyJWT,rentCarController) // (USER-SIDE) post request to rent car
carRouter.route("/available").get(verifyJWT,checkCarAvailabilityController) // (USER-SIDE)
carRouter.route("/").get(verifyJWT,getAvailableCarsController) // (USER-SIDE)
carRouter.route("/:id").patch(verifyJWT,updateCarController) // (ADMIN-SIDE)
carRouter.route("/:id").delete(verifyJWT,deleteCarController) // (ADMIN-SIDE)
carRouter.route("/:id").get(verifyJWT,getCarByIdController) // (USER/ADMIN both)

export default carRouter


// import { Router } from "express"
// import { checkCarAvailability, rentCar } from "../services/rental.service.js"
// import { addCar, getAvailableCars, getCarById } from "../repositories/car.repo.js"

// const carRouter = Router()

// carRouter.route("/check-available").get(checkCarAvailability)
// carRouter.route("/rent").post(rentCar)
// carRouter.route("/add-car").post(addCar)
// carRouter.route("/get-car-by-id").get(getCarById)
// carRouter.route("/available-cars").get(getAvailableCars)

// export default carRouter;
