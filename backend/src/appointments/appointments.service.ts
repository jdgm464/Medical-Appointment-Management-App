import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from "./appointments.dto";
import { Appointment, AppointmentStatus } from "./appointments.types";
import { AppointmentDocument } from "./appointments.schema";

const STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ["checked_in", "in_service", "cancelled", "no_show"],
  checked_in: ["in_service", "cancelled", "no_show"],
  in_service: ["completed"],
  completed: [],
  no_show: [],
  cancelled: [],
};

const VALID_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "checked_in",
  "in_service",
  "completed",
  "no_show",
  "cancelled",
];

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(AppointmentDocument.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async list(date?: string): Promise<Appointment[]> {
    const filter = date ? { date } : {};
    const items = await this.appointmentModel
      .find(filter)
      .sort({ date: -1, time: 1 })
      .lean();
    return items.map((item) => this.mapDocToAppointment(item));
  }

  async getById(id: string): Promise<Appointment> {
    const item = await this.appointmentModel.findById(id).lean();
    if (!item) {
      throw new NotFoundException("Turno no encontrado");
    }
    return this.mapDocToAppointment(item);
  }

  async create(payload: CreateAppointmentDto): Promise<Appointment> {
    this.validateCreate(payload);

    const status: AppointmentStatus = payload.status ?? "scheduled";
    const created = await this.appointmentModel.create({
      patientName: payload.patientName,
      phone: payload.phone,
      email: payload.email,
      date: payload.date,
      time: payload.time,
      reason: payload.reason,
      status,
      queueNumber: payload.queueNumber ?? null,
    });

    return this.mapDocToAppointment(created.toObject());
  }

  async updateStatus(id: string, payload: UpdateAppointmentStatusDto): Promise<Appointment> {
    if (!VALID_STATUSES.includes(payload.status)) {
      throw new BadRequestException("Estado invalido");
    }

    const current = await this.getById(id);
    const allowed = STATUS_TRANSITIONS[current.status] || [];
    if (!allowed.includes(payload.status)) {
      throw new BadRequestException("Cambio de estado no permitido");
    }

    const updated = await this.appointmentModel
      .findByIdAndUpdate(id, { status: payload.status }, { new: true })
      .lean();

    if (!updated) {
      throw new NotFoundException("Turno no encontrado");
    }

    return this.mapDocToAppointment(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentModel.findByIdAndDelete(id).lean();
    if (!result) {
      throw new NotFoundException("Turno no encontrado");
    }
  }

  private validateCreate(payload: CreateAppointmentDto) {
    if (!payload.patientName || !payload.phone || !payload.email) {
      throw new BadRequestException("Datos del paciente incompletos");
    }
    if (!payload.date || !payload.time || !payload.reason) {
      throw new BadRequestException("Datos del turno incompletos");
    }
    if (payload.status && !VALID_STATUSES.includes(payload.status)) {
      throw new BadRequestException("Estado invalido");
    }
  }

  private mapDocToAppointment(doc: Record<string, any>): Appointment {
    return {
      id: doc._id?.toString() ?? doc.id,
      patientName: doc.patientName,
      phone: doc.phone,
      email: doc.email,
      date: doc.date,
      time: doc.time,
      reason: doc.reason,
      status: doc.status,
      createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
      queueNumber: doc.queueNumber ?? null,
    };
  }
}
