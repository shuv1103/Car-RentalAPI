import { checkCarAvailability, rentCar } from "../services/rental.service.js";
import { addCar, getCarById, getAvailableCars, deleteCar,updateCar } from "../repositories/car.repo.js";
  
// Controller for getting a list of available cars
const getAvailableCarsController = async (req, res, next) => {
    getAvailableCars(req,res,next)
}

// Controller for adding a new car
const addCarController = async (req, res, next) => {
    addCar(req,res,next)
}

// Controller for updating car details and availability
const updateCarController = async (req, res, next) => {
    updateCar(req,res,next)
}

// Controller for deleting a car
const deleteCarController = async (req, res, next) => {
    deleteCar(req,res,next)
}

// Controller for checking car availability
const checkCarAvailabilityController = async (req, res, next) => {
    checkCarAvailability(req,res,next );
}

// Controller for renting a car
const rentCarController = async (req, res, next) => {
    rentCar(req,res,next)
}

// Controller for getting car by its ID
const getCarByIdController = async (req, res, next) => {
    getCarById(req,res,next)
}

export {
getAvailableCarsController,
addCarController,
updateCarController,
deleteCarController,
checkCarAvailabilityController,
rentCarController,
getCarByIdController
}
