import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AppointmentStatus } from "./appointments.types";

@Schema({ timestamps: true })
export class AppointmentDocument extends Document {
  @Prop({ required: true })
  patientName!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  time!: string;

  @Prop({ required: true })
  reason!: string;

  @Prop({
    type: String,
    required: true,
    enum: ["scheduled", "checked_in", "in_service", "completed", "no_show", "cancelled"],
    default: "scheduled",
  })
  status!: AppointmentStatus;

  @Prop({ type: Number, default: null })
  queueNumber?: number | null;
}

export const AppointmentSchema = SchemaFactory.createForClass(AppointmentDocument);
