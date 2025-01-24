import { Router } from "express"
import {getAvailableCarsController,addCarController,updateCarController,deleteCarController,checkCarAvailabilityController,rentCarController,getCarByIdController} from "../controllers/car.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const carRouter = Router()

// Define routes
carRouter.route("/").post(verifyJWT,addCarController) // post request to add car to DB
carRouter.route("/:id/rent").post(verifyJWT,rentCarController) // post request to rent car
carRouter.route("/available").get(verifyJWT,checkCarAvailabilityController)
carRouter.route("/").get(verifyJWT,getAvailableCarsController)
carRouter.route("/:id").patch(verifyJWT,updateCarController)
carRouter.route("/:id").delete(verifyJWT,deleteCarController)
carRouter.route("/:id").get(verifyJWT,getCarByIdController)

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
