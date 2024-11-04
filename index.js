const express = require("express");
const {logReqRes} = require('./middlewares/index')
const userRouter = require("./routes/user")
const {connectMongoDB} = require("./connection")


const app = express();
const PORT = 8000;

// MongoDB Connection
connectMongoDB("mongodb://localhost:27017/youtube-app-1").then(()=>console.log("MongoDb Connected"));



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'))


// Routes
app.use("/api/users", userRouter)

// Start the server
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
