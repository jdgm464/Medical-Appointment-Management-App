export type AppointmentStatus =
  | "scheduled"
  | "checked_in"
  | "in_service"
  | "completed"
  | "no_show"
  | "cancelled";

export interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  createdAt: string;
  queueNumber?: number | null;
}
