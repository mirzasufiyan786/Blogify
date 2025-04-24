const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookies (cookieNAME){
    return (req,res,next) => {
const tokenCookieValue = req.cookies[cookieNAME];
if(!tokenCookieValue) {
   return next();
}
try {
    const userPayload = validateToken(tokenCookieValue);
    req.user = userPayload
} catch (error) {}  
 return next();
    }
}
function restrictTo(roles = []){
    return function(req,res,next){
  if(!req.user) return res.redirect("/login");
  
  if(!req.user.role) return res.end("unAuthorized");
  
  return next();
    }
  }


module.exports= {
    checkForAuthenticationCookies,
    restrictTo
}