require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const userToken = req.headers["authorization"];
    jwt.verify(
      userToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      (err, decoded) => { 
        if (err) {
          console.log(err.message);
          return res.json({
            error: "Authentication failed",
          });
        }
        req.userId = decoded?.id; // Assuming 'id' is the correct field in your token
        next();
      }
    );
  } catch (error) {
    console.error(error);
    return res.json({ error: error.message });
  }
};
