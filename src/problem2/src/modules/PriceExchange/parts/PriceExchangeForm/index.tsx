import { memo } from 'react';
import Skeleton from '@components/atomic/Skeleton';
import useCurrencies from '@modules/PriceExchange/hooks/useCurrencies';
import CurrenciesContextProvider from '@modules/PriceExchange/contexts/CurrenciesContext';
import PriceExchangeFormContainer from './container';

interface Props {
  isLoadingRate: boolean;
  onGetExchangeRate: (keepSilent?: boolean) => Promise<number>;
}

function PriceExchangeForm({
  isLoadingRate,
  onGetExchangeRate,
}: Props) {
  const { isLoadingCurrencies, currencies } = useCurrencies();

  if (isLoadingCurrencies) {
    return (
      <>
        <div className="my-10 block">
          <div className="leading-0">
            <Skeleton className="w-[62px] h-5" />
            <Skeleton className="w-full h-[62px] mt-3" />
          </div>
          <div className="my-5 text-center leading-0">
            <Skeleton className="w-6 h-6" />
          </div>
          <div className="leading-0">
            <Skeleton className="w-[62px] h-5" />
            <Skeleton className="w-full h-[62px] mt-3" />
          </div>
        </div>
        <Skeleton className="w-full h-12" />
      </>
    );
  }

  return (
    <CurrenciesContextProvider currencies={currencies}>
      <PriceExchangeFormContainer isLoadingRate={isLoadingRate} onGetExchangeRate={onGetExchangeRate} />
    </CurrenciesContextProvider>
  );
}

export default memo(PriceExchangeForm);
