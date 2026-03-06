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

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
  } catch (err) {
    throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté en ejecución.");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la API");
  }

  return response.json() as Promise<T>;
}

export async function getAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/appointments");
}

export async function addAppointment(
  appointment: Omit<Appointment, "id" | "createdAt" | "status" | "queueNumber">,
): Promise<Appointment> {
  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(appointment),
  });
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<boolean> {
  try {
    await request<Appointment>(`/appointments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    return true;
  } catch {
    return false;
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    return await request<Appointment>(`/appointments/${id}`);
  } catch {
    return null;
  }
}

export async function getTodayAppointments(): Promise<Appointment[]> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await request<Appointment[]>(`/appointments?date=${today}`);
    return appointments.sort((a, b) => a.time.localeCompare(b.time));
  } catch {
    return [];
  }
}

export async function addToQueue(
  appointment: Omit<Appointment, "id" | "createdAt" | "status" | "queueNumber">,
): Promise<Appointment> {
  const queue = await getQueue();
  const nextNumber = queue.length === 0 ? 1 : Math.max(...queue.map((q) => q.queueNumber || 0)) + 1;

  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify({
      ...appointment,
      status: "checked_in",
      queueNumber: nextNumber,
    }),
  });
}

export async function getQueue(): Promise<Appointment[]> {
  try {
    const appointments = await getTodayAppointments();
    return appointments
      .filter((appointment) => appointment.status === "checked_in")
      .sort((a, b) => (a.queueNumber || 0) - (b.queueNumber || 0));
  } catch {
    return [];
  }
}

export async function deleteAppointment(id: string): Promise<void> {
  await request<void>(`/appointments/${id}`, { method: "DELETE" });
}
