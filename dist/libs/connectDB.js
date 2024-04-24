import mongoose from "mongoose";
import { database } from "../config/keys.js";
const connectDB = () => mongoose
    .connect(database.mongoDB)
    .then(() => console.log("Successfully connected to the database."));
export default connectDB;
