'use client';

export default function OfflinePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-rose-900">Sin conexión</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">📡</div>
        <h2 className="text-xl font-semibold text-rose-900 mb-2">
          No hay conexión a internet
        </h2>
        <p className="text-rose-600 mb-6">
          Por favor, verificá tu conexión e intentá nuevamente.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
