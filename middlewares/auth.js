const { verifyToken } = require("../services/auth");

function checkAuth(cookieName){
    console.log("CookieName: ",cookieName);
    return (req,res,next) => {
        const providedToken = req.cookies?.uid;
        if(!providedToken){
            return next();
        }
            try{
                const providedPayload = verifyToken(providedToken);
                req.user = providedPayload;
            }catch(err){}
            return next();
    }
}

/*function checkAuth(req,res,next){
        console.log("Reached");
        const providedToken = req.cookies?.uid;
        if(!providedToken){
            next();
        }
        try{
            const providedPayload = verifyToken(providedToken);
            req.user = providedPayload
        }catch(error){}
        next();
}*/

module.exports = {
    checkAuth
}