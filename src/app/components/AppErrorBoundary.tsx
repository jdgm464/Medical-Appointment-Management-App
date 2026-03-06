import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Captura errores de renderizado para que el frontend siempre muestre algo en Vercel
 * aunque el backend no esté disponible o haya un fallo en la app.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("AppErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Centro Médico Salud Integral
            </h1>
            <p className="text-gray-600">
              La aplicación está cargada. Si ves esto, puede que el backend no esté disponible o haya un error temporal.
            </p>
            <p className="text-sm text-gray-500">
              Podés volver a intentar recargando la página.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
