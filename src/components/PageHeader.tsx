interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold text-rose-900">{title}</h1>
      {subtitle && <p className="text-rose-600 mt-1">{subtitle}</p>}
    </header>
  );
}
