import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó una excepción:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.hash = '';
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 text-slate-100 font-sans">
          <div className="max-w-lg w-full glass-panel border border-red-900/60 bg-red-950/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-950/50">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Se ha producido una interrupción en la vista
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                El sistema de protección interceptó un fallo en la renderización de la guía o componente. Los datos del catálogo están a salvo.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-red-300 max-h-32 overflow-y-auto">
                <span className="text-slate-500 block mb-1">Detalle del error:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Recargar Aplicación</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Volver a la Biblioteca</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
