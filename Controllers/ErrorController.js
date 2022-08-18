



const devHandleError = (err,req,res)=>{
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
          error: err,
          stack: err.stack,
        });
      } else {
        // res.status(500).render('error', {
        //   title: 'Something went wrong',
        //   msg: err.message,
        // });
        return res.status(500).json({
            msg : "Somthing went wrong"
        })
      }
}
const prodHandleError = (err,req,res)=>{
    if (err.isOperational) {
        // return res.status(500).render('error', {
        //   title: 'Something went wrong',
        //   msg: `${err.message} Please try again`,
        // });
        return res.status(500).json({
            msg : "Somthing went wrong",
            err : err
        })
      } else {
        // console.log("Error : ",err);
        // return res.status(500).render('error', {
        //   title: 'Something went wrong',
        //   msg: 'Please try again!',
        // });
        return res.status(500).json({
            msg : "Somthing went wrong",
            err :err
        })
      }
}
const globalHandlerError = (err,req,res,next) =>{
    
    err.statusCode =  err.statusCode || 500;
    err.status =err.status || "error";
    if(process.env.NODE_ENV === "production"){
         prodHandleError(err,req,res)
    }else if(process.env.NODE_ENV === "development"){
                devHandleError(err,req,res);
    }
}

export default globalHandlerError;