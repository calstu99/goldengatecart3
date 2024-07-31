import mongoose from "mongoose";

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    // this will use db "test" by default
    // await mongoose.connect(process.env.MONGO_URI!, {}); 
    

    // using MongoDB Atlas cluster - default dbname is test 
    await mongoose.connect(process.env.MONGO_URI!, {
      // dbName: "trurosa",
      dbName: process.env.MONGO_DB_NAME,
    });
    
    console.log("Mongo Connection successfully established.");
  } catch (error) {
    throw new Error("Error connecting to Mongoose");
  }
};

export default connect;