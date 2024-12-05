import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }

  const db = mongoose.connection;
  db.on("error", (err) => console.error("MongoDB Connection Error:", err));
};

export default connectToDB;
