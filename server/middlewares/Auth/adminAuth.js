require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const tokenWithoutQuotes = req.headers["authorization"]?.split(" ")[1];
    const admintoken = tokenWithoutQuotes.replace(/"/g, "");
    if (!admintoken) {
      return res.json({
        error: "No token provided",
      });
    }

    jwt.verify(
      admintoken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      (err, decoded) => {
        if (err) {
          console.log(err.message);
          return res.json({
            error: "Authentication failed",
          });
        }
        req.adminId = decoded?.id; // Assuming 'id' is the correct field in your token 
        next();
      }
    );
  } catch (error) {
    console.error(error);
    return res.json({ error: "Internal server error" });
  }
};
