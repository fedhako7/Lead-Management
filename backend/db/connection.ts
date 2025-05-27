import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables")
    }

    const conn = await mongoose.connect(mongoURI)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
}

export default connectDB
