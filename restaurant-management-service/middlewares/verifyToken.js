// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');
 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
 
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
 
    const token = authHeader.split(" ")[1]; // Bearer <token>
 
    jwt.verify(token, "R09QnkodNmD4jcxWq+1444X99hiCY0964LOrE5rUAAo4uigMgSjINdQ2I8VF6eEe9gSnGed4Rh+rrNWZt", (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
 
        console.log("✅ Token decoded:", decoded); // 🐛 DEBUG: Print the decoded payload
 
        req.user = decoded; // Store decoded token info in request
        next();
    });
};
 
module.exports = verifyToken;
 
