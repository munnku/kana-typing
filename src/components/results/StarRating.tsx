'use client';
import { useEffect, useState } from 'react';

interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
}

export function StarRating({ stars }: StarRatingProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealed(count);
      if (count >= stars) clearInterval(interval);
    }, 400);
    return () => clearInterval(interval);
  }, [stars]);

  return (
    <div className="flex gap-3 justify-center" aria-label={`${stars}つ星`}>
      {[1, 2, 3].map(n => (
        <span
          key={n}
          className={`text-5xl transition-all duration-300 ${
            n <= revealed
              ? 'text-yellow-400 scale-110 drop-shadow-lg'
              : 'text-gray-300 scale-90'
          }`}
          style={{ transitionDelay: `${(n - 1) * 50}ms` }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
