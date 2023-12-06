const express = require("express");
const cors = require("cors");
const path = require('path')
require("dotenv").config();
const db = require("./config/db");
const app = express();
app.use(
  cors({
    origin: "*",
  })
); 

// to destructure json type data from user as reqest
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

// //user
const userRoute = require("./routes/userRoutes");
// // when ever this kind of end points come it will search in userRoute
app.use("/api/user", userRoute); 

// //artist
// const artistRoutes = require("./routes/artistRoutes");
// app.use("/api/artist", artistRoutes);

// //admin
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server Started!");
});
