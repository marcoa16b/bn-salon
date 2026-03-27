import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('bg-rose-50 border border-rose-200 rounded-xl p-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
