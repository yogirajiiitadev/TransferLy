

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next)=>{
    console.log('middleware utilized!')
    const x = req.headers.authorization;
    if(!x || !x.startsWith('Bearer')){
        return res.status(403).json({
            msg : "No token sent!"
        })
    }
    const token = x.split(' ')[1];
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({
            msg: "Invalid token!"
        });
    }
}

module.exports = {
    authMiddleware
}