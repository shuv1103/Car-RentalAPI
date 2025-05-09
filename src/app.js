import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
// how backend and frontend can interact
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"})) // Parses incoming JSON requests and limits the request body size to 16kb.
app.use(express.urlencoded({extended:true,limit:"16kb"})) // Parses URL-encoded data with extended option for rich objects and arrays, and limits the request body size to 16kb.
app.use(express.static("public")) // Serves static files(images,css,js) from the "public" directory.
app.use(cookieParser())  // Parses cookies attached to the client request object.

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: err.message || "Internal Server Error",
    });
});


// import routes
import userRouter from "./routes/user.routes.js"
import carRouter from "./routes/car.routes.js"

app.use("/api/v1/users",userRouter);
app.use("/api/v1/cars",carRouter);

export {app}