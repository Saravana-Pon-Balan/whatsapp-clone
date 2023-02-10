const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server,{
  cors:{
    origin:['http://localhost:3000'],
  }
});
import connectDB from "./dbConnection/index.js";
import routes from "./routes/index.js";
import configureExpressApp from "./config/index.js";

const PORT = 3001;

configureExpressApp(app);
routes(app);

io.on("connect", (socket) => {  
  socket.on('send-message',(messages,channelId)=>{
    console.log(messages);
    socket.to(channelId).emit('receive-message',messages)
  })
  socket.on('join-channel',channelId=>{
    socket.join(channelId);
    console.log(`joined ${channelId}`);
  })


  socket.on('disconnect', () => {
  console.log('Client disconnected');
  });
  });

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
  });
}).catch((error) => {
  console.error(`Unable to start the server`, error);
});
