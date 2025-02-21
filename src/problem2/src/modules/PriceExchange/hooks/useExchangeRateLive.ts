import { useEffect, useRef } from 'react';

function useExchangeRateLive(
  getExchangeRateMethod: (keepSilent?: boolean) => Promise<number>,
  liveId: string,
) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (liveId) {
      const intervalId = setInterval(() => {
        getExchangeRateMethod(true);
      }, 2 * 60 * 1000); // update exchange rate every 2 mins
      intervalRef.current = intervalId;

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [liveId, getExchangeRateMethod])
}

export default useExchangeRateLive;
