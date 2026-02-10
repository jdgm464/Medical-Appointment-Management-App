import { AppointmentStatus } from "./appointments.types";

export interface CreateAppointmentDto {
  patientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  status?: AppointmentStatus;
  queueNumber?: number | null;
}

export interface UpdateAppointmentStatusDto {
  status: AppointmentStatus;
}
