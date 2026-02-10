import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppointmentsModule } from "./appointments/appointments.module";
import { mongoUri } from "./config/database";

@Module({
  imports: [MongooseModule.forRoot(mongoUri!), AppointmentsModule],
})
export class AppModule {}
