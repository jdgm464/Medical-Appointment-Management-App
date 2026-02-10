import mongoose from "mongoose";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI no esta configurada");
}

const seedPath = path.resolve(process.cwd(), "../database/seed.json");
const raw = fs.readFileSync(seedPath, "utf-8");
const data = JSON.parse(raw);

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["scheduled", "checked_in", "in_service", "completed", "no_show", "cancelled"],
      default: "scheduled",
      required: true,
    },
    queueNumber: { type: Number, default: null },
  },
  { timestamps: true },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

await mongoose.connect(uri);
await Appointment.deleteMany({});
await Appointment.insertMany(data);
await mongoose.disconnect();

console.log("Seed completado");
