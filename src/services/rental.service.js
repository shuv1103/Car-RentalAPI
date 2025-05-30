import {Car} from "../models/car.model.js"
import {User} from "../models/user.model.js"
import { waitListQueue } from "./waitList.service.js"
import { sendEmail } from "../notifications/user.email.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Car-Availability logic
const checkCarAvailability = asyncHandler(async(req,res)=>{
    const {userId, carId} = req.body

    if(!carId || !userId)
    {
        throw new ApiError(400,"Car Id and User Id is required")
    }

    // Fetch the user document having that userId from DB(collection)
    const user = await User.findById(userId)

    // check if a user with given userId exists in User Collection
    if(!user)
    {
        throw new ApiError(404,"User not found")
    }

    // Fetch the car document having that carId from DB(collection)
    const car = await Car.findById(carId)

    // check if a car with given carId exists in Car Collection
    if(!car)
    {
        throw new ApiError(404,"Car not found")
    }

    // check if car available for rent
    if(!car.isAvailability)
    { 
        // car not available, add to waiting queue
        await waitListQueue.add("waitlist",{userId, carId})
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    carId: carId,
                    isAvailability: false
                },
                "Car unavailable. Added to the waitlist"
            )
        )
    }

    // car is available for rent
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                carId: carId,
                isAvailability: car.isAvailability
            },
            "Car is available"
        )
    )
})


// Rent-Car service logic
const rentCar = asyncHandler(async(req,res)=>{
    
    // de-structure info from json request
    const {email,startDate,endDate} = req.body
    const carId = req.params.id

    console.log("email recepient = ", email)

    // validate user inputs
    if([email,carId,startDate,endDate].some(value => value == null || value.trim() == ''))
    {
        throw new ApiError(400,"All fields are required")
    }

    // parse the duration of rental 
    const rentStart = new Date(startDate)
    const rentEnd = new Date(endDate)
    
    // check validity of start and ending dates
    if(rentEnd < rentStart)
    {
        throw new ApiError(400," rental end date is greater than starting date!")
    }

    // check availability of car requested
    const car = await Car.findOne({carId}) // get the carId from DB

    if(!car)
    {
        throw new ApiError(404,"car not found!")
    }

    if(!car.isAvailability || car.count <= 0)
    {
        throw new ApiError(400,"car is unavailable for rent!")
    }

    // find the user by email
    const user = await User.findOne({email}) // get the user by email from DB

    if(!user)
    {
        throw new ApiError(400,"User not found")
    }

    // calculate the total rental cost
    const rentalDays = Math.ceil((rentEnd - rentStart) / (1000 * 60 * 60 * 24)) + 1
    const totalPrice = rentalDays * car.pricePerDay

    console.log("rental days = ",rentalDays)
    console.log("price per day = ",car.pricePerDay)
    console.log("total price = ",totalPrice)

    // Initialize rentalHistory if undefined
    if (!Array.isArray(car.rentalHistory)) {
        car.rentalHistory = [];
    }

    // rent a car
    car.rentalHistory.push({
        email: user.email, // email: user._id
        startDate: rentStart,
        endDate: rentEnd,
        totalPrice: totalPrice
    })

    // update car's availability and count
    car.count = car.count - 1 // decrease count by 1 after renting
    if(car.count <= 0){
        car.isAvailability = false
    }

    await car.save(); // Save the updated car to the database
    
    // send email notification
    const emailSubject = `Car Rental Confirmation: ${car.model}`;
    const emailBody = `
        <h3>Car Rental Confirmation</h3>
        <p>Dear ${user.name},</p>
        <p>Your booking for the car <b>${car.model}</b> (${car.manufacturer}) has been confirmed.</p>
        <p><b>Rental Duration:</b> ${rentStart.toDateString()} tno ${rentEnd.toDateString()}</p>
        <p><b>Total Cost:</b> $${totalPrice}</p>
        <p>Thank you for choosing our service!</p>
    `
    console.log("recepient = ",user.name)

    //send the email
    await sendEmail({
        to: email,
        subject: emailSubject, 
        text: "Car rented successfully", 
        html: emailBody
    })

    // send the response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                rentalHistory: car.rentalHistory,
                availability: car.isAvailability
            },
            "Car rented successfully!"
        )
    )
})

const returnCar = asyncHandler(async (req,res) => {
    const carId = req.params.id;
    const userId = req.user._id; // comes from verifyJWT

    if([carId, userId].some(value => value == null || value.trim() == ''))
    {
        throw new ApiError(400, "All fields are required");
    }

    const car = await Car.findOne({carId});

    if(!car)
    {
        throw new ApiError(404, "Car not found");
    }

    car.count = car.count + 1; // car returned
    car.isAvailability = true;
    
    await car.save(); // save changes to DB

    // trigger background job to notify next user in waitlist queue
    await waitListQueue.add("notifyNextUser", {carId});

    return res.status(200).json(
        new ApiResponse(
            200,
            {
               message : `Car ${car.model} returned successfully by user ${userId}` 
            }
        )
    );
});

export {checkCarAvailability,rentCar,returnCar}