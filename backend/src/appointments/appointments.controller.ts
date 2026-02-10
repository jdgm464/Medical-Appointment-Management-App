import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto, UpdateAppointmentStatusDto } from "./appointments.dto";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  list(@Query("date") date?: string) {
    return this.appointmentsService.list(date);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.appointmentsService.getById(id);
  }

  @Post()
  create(@Body() payload: CreateAppointmentDto) {
    return this.appointmentsService.create(payload);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() payload: UpdateAppointmentStatusDto) {
    return this.appointmentsService.updateStatus(id, payload);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(id);
  }
}
