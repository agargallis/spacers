import { useEffect, useState } from 'react';
import { getCountdown } from '../utils/format';

/** Live-ticking countdown to an ISO datetime. */
export function useCountdown(targetIso) {
  const [parts, setParts] = useState(() =>
    targetIso ? getCountdown(targetIso) : null
  );

  useEffect(() => {
    if (!targetIso) {
      setParts(null);
      return;
    }
    setParts(getCountdown(targetIso));
    const id = setInterval(() => setParts(getCountdown(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return parts;
}
