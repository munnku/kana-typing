import { cn } from '@/lib/cn';

interface StarDisplayProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const sizeMap = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

export function StarDisplay({ stars, size = 'md', animate = false }: StarDisplayProps) {
  return (
    <div className="flex gap-0.5" aria-label={`${stars}つ星`}>
      {[1, 2, 3].map(n => (
        <span
          key={n}
          className={cn(
            sizeMap[size],
            'transition-all duration-300',
            n <= stars ? 'text-yellow-400' : 'text-gray-300',
            animate && n <= stars ? 'animate-bounce' : ''
          )}
          style={animate && n <= stars ? { animationDelay: `${(n - 1) * 150}ms`, animationDuration: '0.5s', animationIterationCount: '1' } : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}
