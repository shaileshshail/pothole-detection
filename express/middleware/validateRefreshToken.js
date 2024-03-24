const jwt = require("jsonwebtoken");

const validateRefreshToken = async (req,res,next)=>{
    const cookies=req.cookies
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // verify jwt 
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decode)=>{

        if(err){
            res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 ,sameSite:"Lax"});
            return res.sendStatus(401);
        }
        console.log("decode-handle",decode);
        req.user = decode.user;//append the decoded user in req to pass to router 
        next();//next() : It will run or execute the code after all the middleware function is finished.
    });
};

module.exports = validateRefreshToken;