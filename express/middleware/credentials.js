const allowedOrigins = require("../config/allowedOrigins");

//checking if origin ip in allowed ip's
const credentilas = (req,res,next)=>{
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)){
        res.set("Access-Control-Allow-Credentials",true);
    }
    next();
}

module.exports =credentilas;

/**
    To send cookie from client using fetch we need to set credentials: 'include' in request

    "Access-Control-Allow-Credentials" must be true not blank while sending cookie back to client
 */