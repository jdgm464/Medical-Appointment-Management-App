import { useState } from "react";
import { Calendar, Clock, Users, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { addAppointment, addToQueue, getAppointmentById, type Appointment } from "../utils/appointmentStore";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LandingPage() {
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showQueueDialog, setShowQueueDialog] = useState(false);
  const [showCheckDialog, setShowCheckDialog] = useState(false);
  const [bookingType, setBookingType] = useState<"appointment" | "queue">("appointment");
  const [searchId, setSearchId] = useState("");
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);

  const handleBookAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const appointmentData = {
      patientName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      reason: formData.get("reason") as string,
    };

    try {
      const newAppointment = await addAppointment(appointmentData);
      toast.success("¡Turno reservado exitosamente!", {
        description: `Tu ID de turno es: ${newAppointment.id.slice(0, 8)}`,
      });
      setShowBookingDialog(false);
      e.currentTarget.reset();
    } catch (error) {
      toast.error("No se pudo reservar el turno");
    }
  };

  const handleJoinQueue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const queueData = {
      patientName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      reason: formData.get("reason") as string,
    };

    try {
      const newEntry = await addToQueue(queueData);
      toast.success("¡Ingresaste a la fila de espera!", {
        description: `Tu número es: ${newEntry.queueNumber}. ID: ${newEntry.id.slice(0, 8)}`,
      });
      setShowQueueDialog(false);
      e.currentTarget.reset();
    } catch (error) {
      toast.error("No se pudo ingresar a la fila");
    }
  };

  const handleCheckStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const appointment = await getAppointmentById(searchId);

    if (appointment) {
      setFoundAppointment(appointment);
      return;
    }

    toast.error("No se encontró el turno", {
      description: "Verifica el ID ingresado",
    });
    setFoundAppointment(null);
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
      scheduled: "bg-blue-100 text-blue-800",
      checked_in: "bg-yellow-100 text-yellow-800",
      in_service: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      no_show: "bg-orange-100 text-orange-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Centro Médico Salud Integral</h1>
              <p className="text-xs text-gray-500">Tu bienestar es nuestra prioridad</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setShowCheckDialog(true)}
            className="hidden sm:flex"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Consultar Estado
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
                Atención médica de calidad
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Cuidamos tu salud con profesionalismo y calidez
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Reservá tu turno online o ingresá a nuestra fila de espera virtual. 
                Sistema moderno de gestión para una mejor experiencia de atención.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setBookingType("appointment");
                    setShowBookingDialog(true);
                  }}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Reservar Turno
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setBookingType("queue");
                    setShowQueueDialog(true);
                  }}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Fila de Espera
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1758691463606-1493d79cc577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3MDI5NDgzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Consulta médica"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">+15 años</p>
                    <p className="text-sm text-gray-600">de experiencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Nuestros Servicios</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ofrecemos atención médica integral con especialistas capacitados 
              y tecnología de última generación
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle>Medicina General</CardTitle>
                <CardDescription>
                  Consultas médicas generales, control de salud y seguimiento de tratamientos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <CardTitle>Estudios y Análisis</CardTitle>
                <CardDescription>
                  Laboratorio completo, estudios por imágenes y diagnósticos especializados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Atención Inmediata</CardTitle>
                <CardDescription>
                  Sin turno previo. Ingresá a nuestra fila virtual y te atenderemos en orden
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwY2xpbmljfGVufDF8fHx8MTc3MDI4MjAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Consultorio moderno"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">¿Por qué elegirnos?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Gestión de turnos moderna</h4>
                    <p className="text-gray-600">Reservá online y consultá el estado de tu turno en tiempo real</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Profesionales capacitados</h4>
                    <p className="text-gray-600">Equipo médico con amplia experiencia y formación continua</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Instalaciones modernas</h4>
                    <p className="text-gray-600">Equipamiento de última tecnología para diagnósticos precisos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Ubicación y Contacto</h3>
            <p className="text-gray-600">Estamos para atenderte cuando nos necesites</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-center mb-2">Dirección</h4>
                <p className="text-gray-600 text-center text-sm">
                  Av. Corrientes 1234<br />
                  Ciudad Autónoma de Buenos Aires
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-center mb-2">Teléfono</h4>
                <p className="text-gray-600 text-center text-sm">
                  (011) 4567-8900<br />
                  Lun a Vie: 8:00 - 20:00
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-center mb-2">Email</h4>
                <p className="text-gray-600 text-center text-sm">
                  info@saludintegral.com.ar<br />
                  turnos@saludintegral.com.ar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Centro Médico Salud Integral</h4>
              <p className="text-gray-400 text-sm">
                Brindamos atención médica de calidad con un equipo comprometido con tu bienestar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <p className="text-gray-400 text-sm">
                Lunes a Viernes: 8:00 - 20:00<br />
                Sábados: 9:00 - 14:00<br />
                Domingos: Cerrado
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Acceso Rápido</h4>
              <div className="space-y-2">
                <Button 
                  variant="link" 
                  className="text-gray-400 hover:text-white p-0 h-auto"
                  onClick={() => setShowCheckDialog(true)}
                >
                  Consultar Estado de Turno
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Centro Médico Salud Integral. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservar Turno</DialogTitle>
            <DialogDescription>
              Completá tus datos para reservar tu turno. Te enviaremos un ID para consultar el estado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" name="name" required placeholder="Juan Pérez" />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="11 1234-5678" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="juan@ejemplo.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" name="date" type="date" required min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <Label htmlFor="time">Hora</Label>
                <Select name="time" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">09:00</SelectItem>
                    <SelectItem value="10:00">10:00</SelectItem>
                    <SelectItem value="11:00">11:00</SelectItem>
                    <SelectItem value="12:00">12:00</SelectItem>
                    <SelectItem value="14:00">14:00</SelectItem>
                    <SelectItem value="15:00">15:00</SelectItem>
                    <SelectItem value="16:00">16:00</SelectItem>
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="18:00">18:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Motivo de consulta</Label>
              <Textarea id="reason" name="reason" required placeholder="Describe brevemente el motivo de tu consulta" />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowBookingDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Confirmar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Queue Dialog */}
      <Dialog open={showQueueDialog} onOpenChange={setShowQueueDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ingresar a Fila de Espera</DialogTitle>
            <DialogDescription>
              Completá tus datos para ingresar a la fila virtual. Recibirás un número de orden.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJoinQueue} className="space-y-4">
            <div>
              <Label htmlFor="queue-name">Nombre completo</Label>
              <Input id="queue-name" name="name" required placeholder="Juan Pérez" />
            </div>
            <div>
              <Label htmlFor="queue-phone">Teléfono</Label>
              <Input id="queue-phone" name="phone" type="tel" required placeholder="11 1234-5678" />
            </div>
            <div>
              <Label htmlFor="queue-email">Email</Label>
              <Input id="queue-email" name="email" type="email" required placeholder="juan@ejemplo.com" />
            </div>
            <div>
              <Label htmlFor="queue-reason">Motivo de consulta</Label>
              <Textarea id="queue-reason" name="reason" required placeholder="Describe brevemente el motivo de tu consulta" />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowQueueDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                Ingresar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Check Status Dialog */}
      <Dialog open={showCheckDialog} onOpenChange={setShowCheckDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Consultar Estado del Turno</DialogTitle>
            <DialogDescription>
              Ingresá el ID que recibiste al reservar tu turno o ingresar a la fila
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCheckStatus} className="space-y-4">
            <div>
              <Label htmlFor="search-id">ID del Turno</Label>
              <Input 
                id="search-id" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Ej: a1b2c3d4"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Buscar
            </Button>
          </form>

          {foundAppointment && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Información del Turno</h4>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(foundAppointment.status)}`}>
                  {getStatusLabel(foundAppointment.status)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paciente:</span>
                  <span className="font-medium">{foundAppointment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="font-medium">{foundAppointment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hora:</span>
                  <span className="font-medium">{foundAppointment.time}</span>
                </div>
                {foundAppointment.queueNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de fila:</span>
                    <span className="font-medium">#{foundAppointment.queueNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
