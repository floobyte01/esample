import mongoose from "mongoose";

export default async function connectDb() {
  try {
    const URI = process.env.URI;
    
    if (!URI) {
      throw new Error("MongoDB URI is not defined. Please check your environment variables.");
    }

    // Connect without options like useNewUrlParser and useUnifiedTopology
    await mongoose.connect(URI);

    const connection = mongoose.connection;
    
    connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
      process.exit(1); // Exit with a failure code
    });

    console.log("MongoDB connected successfully");

  } catch (error: any) {
    console.error(`Connection failed: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
}
