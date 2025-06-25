const authMiddleware = (req, res, next) => {
    const token = "abc123"
    const isAuthenticated = token === "abc123"; 
    if(!isAuthenticated) {
        return res.status(401).json({ message: "Unauthorized" });
    }else{
        console.log("User is authenticated successfully");
        next();
    }
}

module.exports = {
    authMiddleware,
};