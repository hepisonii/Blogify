const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
function setToken(user){
    const payload = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    }
    const token = jwt.sign(payload,secret);
    return token;
} // yeh sab hum models ke matchPassword vale function se krege

function verifyToken(token){
    if(!token) return;
    return jwt.verify(token,secret); // returns payload
}

module.exports = {
    verifyToken,
    setToken
}