import mongoose from "mongoose"; // Import mongoose library for MongoDB interactions

// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the database using the URI stored in environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        // Log the host of the connected database to the console
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log any errors that occur during the connection attempt
        console.error(`Error: ${error.message}`);
    }
}

// Export the connectDB function for use in other parts of the application
export default connectDB;
