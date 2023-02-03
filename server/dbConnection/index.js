import mongoose from "mongoose";

const DB_CONNECTION_URL =   "mongodb://localhost:27017/test";

const connectDB = ()=>{
    console.log("DB trying to connnect on "+new Date());
    const options={
        useNewUrlParser:true,
    };
    mongoose.set('strictQuery', false);
    return mongoose.connect(DB_CONNECTION_URL,options);

};
export default connectDB;