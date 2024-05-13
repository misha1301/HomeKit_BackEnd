require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConnection");
const PORT = process.env.PORT || 3001;

//connect to MongoDB
connectDB();

//custom maiddleware logger
app.use(logger);

// Handle options credentials check before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded from data
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running now");
});

//serve static file
// app.use("/", express.static(path.join(__dirname, "/public")));

//routes
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/updating", require("./routes/updating"));

app.use(verifyJWT);
app.use("/sensors", require("./routes/api/sensors"));
app.use("/rooms", require("./routes/api/rooms"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.send("anything in there");
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
