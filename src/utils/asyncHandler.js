const  asyncHandler = (requestHandler)=>{
    return (req,res,next) => {
        // console.log("next function is ",next)
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
    }
}

export {asyncHandler}