import { useCallback, useEffect, useState } from 'react';
import useDisclosure from '@hooks/useDisclosure';
import { getCurrencies } from '@apis/currency.api';
import { ICurrency } from '@typed/currency.types';
import useGlobalErrorHandler from '@hooks/useGlobalErrorHandler';
import { sleep } from '@utils/timer.util';

interface UseCurrencies {
  isLoadingCurrencies: boolean;
  currencies: ICurrency[];
}

function useCurrencies(): UseCurrencies {
  const { showErrorMessage } = useGlobalErrorHandler();
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const {
    isOpen: isLoadingCurrencies,
    onOpen: startLoadingCurrencies,
    onClose: finishLoadingCurrencies,
  } = useDisclosure({ defaultIsOpen: true });

  const handleLoadCurrencies = useCallback(async (keepSilent = false) => {
    try {
      if (!keepSilent) startLoadingCurrencies();
      const result = await getCurrencies();
      await sleep(1_000); // fake api delay
      setCurrencies(result);
    } catch (error: unknown) {
      showErrorMessage(error);
    }
    finishLoadingCurrencies();
  }, [finishLoadingCurrencies, showErrorMessage, startLoadingCurrencies]);

  useEffect(() => {
    handleLoadCurrencies();
  }, [handleLoadCurrencies]);

  return {
    isLoadingCurrencies,
    currencies,
  };
}

export default useCurrencies;
