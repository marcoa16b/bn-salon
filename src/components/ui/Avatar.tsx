import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }
  
  return (
    <div
      className={cn(
        'bg-rose-500 text-white rounded-full flex items-center justify-center font-medium',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}
