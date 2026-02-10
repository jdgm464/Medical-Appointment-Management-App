import mongoose from "mongoose";
import { mongoUri } from "./src/config/database";

void mongoose.connect(mongoUri!);
