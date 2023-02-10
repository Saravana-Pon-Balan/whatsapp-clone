import mongoose from "mongoose";

const DB_CONNECTION_URL =   "mongodb://localhost:27017/test";

const connectDB = ()=>{
    console.log("DB trying to connnect on "+new Date().toLocaleString("en-US", "Asia/Delhi"));
    const options = {
        autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4
      }; 
    mongoose.set('strictQuery', false);
    return mongoose.connect(DB_CONNECTION_URL,options);

};
export default connectDB;