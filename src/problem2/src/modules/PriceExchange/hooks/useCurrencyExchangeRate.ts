import { useCallback, useEffect } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import useGlobalErrorHandler from '@hooks/useGlobalErrorHandler';
import { getExchangeRate } from '@apis/currency.api';
import { sleep } from '@utils/timer.util';

function useCurrencyExchangeRate(from: string, to: string, onRateChange: (newRate: number) => void) {
  const { showErrorMessage } = useGlobalErrorHandler();
  const {
    isOpen: isGettingRate,
    onOpen: startGettingRate,
    onClose: finishGettingRate,
  } = useDisclosure({ defaultIsOpen: true });

  const handleGetExchangeRate = useCallback(async (keepSilent = false) => {
    let rate = 0;
    try {
      if (!keepSilent) startGettingRate();
      rate = await getExchangeRate(from, to);
      await sleep(1_000); // fake api delay
      onRateChange(rate);
    } catch (error: unknown) {
      showErrorMessage(error);
      onRateChange(0);
      rate = 0;
    }
    finishGettingRate();
    return rate;
  }, [finishGettingRate, from, onRateChange, showErrorMessage, startGettingRate, to]);

  useEffect(() => {
    handleGetExchangeRate();
  }, [handleGetExchangeRate]);

  return { onGetExchangeRate: handleGetExchangeRate, isGettingRate };
}

export default useCurrencyExchangeRate;
