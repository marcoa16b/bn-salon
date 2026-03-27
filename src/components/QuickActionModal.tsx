'use client';

interface QuickActionModalProps {
  open: boolean;
  onClose: () => void;
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

export function QuickActionModal({ open, onClose }: QuickActionModalProps) {
  if (!open) return null;

  const actions = [
    { label: 'Agregar Cliente', href: '/clientes?new=true', icon: UsersIcon },
    { label: 'Agregar Servicio', href: '/servicios?new=true', icon: ScissorsIcon },
    { label: 'Agendar Cita', href: '/agenda?new=true', icon: CalendarIcon },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={onClose}
      />
      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 pb-20 max-w-[480px] mx-auto animate-slide-up">
        <div className="w-12 h-1 bg-rose-200 rounded-full mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-rose-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="space-y-2">
          {actions.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
              onClick={onClose}
            >
              <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-rose-900">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
