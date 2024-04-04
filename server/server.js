// server.js
import express from "express";
import connectDB from "./dbConnection/index.js";
import routes from "./routes/index.js";
import configureExpressApp from "./config/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

configureExpressApp(app);

const httpserver = createServer(app);
const io = new Server(httpserver,{
  cors: {
    origin: "*", // Allow all origins for now, adjust as needed
    methods: ["GET", "POST"] // Allow only GET and POST requests
  }
});

const PORT = 3001;

io.on("connection", (socket) => {
  socket.on('user', function (data) {
    socket.join(data.room);
    console.log(data)
    socket.broadcast.to(data.room).emit("msg",data.msgReqData)
    console.log("sent");

  });
});


const startServer = () => {
  Promise.all([connectDB()])
    .then(() => {
      httpserver.listen(PORT);
      console.log(`Server started on Port ${PORT}`);
      routes(app);
    }).catch((error) => console.error(`Unable to start the server`, error));
};

startServer();
