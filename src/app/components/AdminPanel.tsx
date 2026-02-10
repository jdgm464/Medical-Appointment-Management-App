import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Clock, 
  Users, 
  Calendar, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  PlayCircle,
  Trash2
} from "lucide-react";
import {
  getTodayAppointments,
  getQueue,
  updateAppointmentStatus,
  deleteAppointment,
  type Appointment,
  type AppointmentStatus,
} from "../utils/appointmentStore";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function AdminPanel() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<Appointment[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin/login");
      return;
    }

    void loadData();

    // Actualizar datos cada 5 segundos
    const interval = setInterval(() => {
      void loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadData = async () => {
    try {
      const [todayAppointments, todayQueue] = await Promise.all([
        getTodayAppointments(),
        getQueue(),
      ]);
      setAppointments(todayAppointments);
      setQueue(todayQueue);
    } catch {
      toast.error("No se pudieron cargar los datos");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Sesión cerrada");
    navigate("/admin/login");
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    const updated = await updateAppointmentStatus(id, status);
    if (!updated) {
      toast.error("Cambio de estado no permitido");
      return;
    }
    await loadData();
    toast.success("Estado actualizado correctamente");
  };

  const handleDelete = async (id: string) => {
    await deleteAppointment(id);
    await loadData();
    setDeleteId(null);
    toast.success("Turno eliminado");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: "Programado",
      checked_in: "En espera",
      in_service: "En atención",
      completed: "Finalizado",
      no_show: "No se presentó",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      checked_in: "bg-yellow-100 text-yellow-800 border-yellow-200",
      in_service: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      no_show: "bg-orange-100 text-orange-800 border-orange-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: appointments.length,
    waiting: queue.length,
    inProgress: appointments.filter(a => a.status === "in_service").length,
    completed: appointments.filter(a => a.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Panel Administrativo</h1>
              <p className="text-sm text-gray-600">Gestión de Turnos y Fila de Espera</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-gray-600">Sistema de gestión</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hoy</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En Fila</p>
                  <p className="text-2xl font-bold">{stats.waiting}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En Atención</p>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Finalizados</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="queue">
              Fila de Espera ({stats.waiting})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              Turnos del Día ({stats.total})
            </TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fila de Espera Virtual</CardTitle>
                <CardDescription>
                  Pacientes esperando atención sin turno previo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {queue.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pacientes en la fila de espera</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {queue.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-lg">#{item.queueNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate">{item.patientName}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {getStatusLabel(item.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{item.reason}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>📞 {item.phone}</span>
                            <span>🕐 {item.time}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {item.status === "checked_in" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(item.id, "in_service")}
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Atender
                            </Button>
                          )}
                          {item.status === "in_service" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStatusChange(item.id, "completed")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Finalizar
                            </Button>
                          )}
                          {item.status === "checked_in" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-orange-600 hover:text-orange-700"
                              onClick={() => handleStatusChange(item.id, "no_show")}
                            >
                              <AlertCircle className="w-4 h-4 mr-1" />
                              No se presentó
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Turnos Programados - {new Date().toLocaleDateString("es-AR")}</CardTitle>
                <CardDescription>
                  Lista de todos los turnos del día
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No hay turnos programados para hoy</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-16 flex-shrink-0">
                          <div className="text-center">
                            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm font-semibold">{appointment.time}</p>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate">{appointment.patientName}</h4>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusLabel(appointment.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{appointment.reason}</p>
                          <div className="flex gap-4 text-xs text-gray-500 mt-1">
                            <span>📞 {appointment.phone}</span>
                            <span>📧 {appointment.email}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {appointment.status === "scheduled" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(appointment.id, "checked_in")}
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                En Espera
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(appointment.id, "in_service")}
                              >
                                <PlayCircle className="w-4 h-4 mr-1" />
                                Iniciar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 hover:text-orange-700"
                                onClick={() => handleStatusChange(appointment.id, "no_show")}
                              >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                No se presentó
                              </Button>
                            </>
                          )}
                          {appointment.status === "checked_in" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusChange(appointment.id, "in_service")}
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Atender
                            </Button>
                          )}
                          {appointment.status === "in_service" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleStatusChange(appointment.id, "completed")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Finalizar
                            </Button>
                          )}
                          {(appointment.status === "scheduled" || appointment.status === "checked_in") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteId(appointment.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente este turno del sistema.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
