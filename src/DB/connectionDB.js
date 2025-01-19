import mongoose from "mongoose";
import { config } from "dotenv";
config();

export const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.URI_ONLINE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected to " + process.env.URI_ONLINE);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
