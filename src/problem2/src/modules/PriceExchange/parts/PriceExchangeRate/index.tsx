import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { formatNumber } from '@utils/number.util';
import Skeleton from '@components/atomic/Skeleton';
import { IExchangeFormValues } from '@modules/PriceExchange/types/exchange-form.types';

interface Props {
  isLoadingRate: boolean;
}

function PriceExchangeRate({
  isLoadingRate,
}: Props) {
  const { watch } = useFormContext<IExchangeFormValues>();
  const priceRate = watch('price_rate');
  const fromCurrency = watch('from');
  const toCurrency = watch('to');

  const rateText = `1 ${fromCurrency} = ${formatNumber(priceRate.toString())} ${toCurrency}`;

  if (isLoadingRate) {
    return (
      <div className="text-center leading-0">
        <Skeleton className="w-[180px] h-7" />
      </div>
    );
  }

  return (
    <div className="text-center">
      <span className="inline-block text-sm text-black-00 bg-gray-neutral-78 font-semibold py-1 px-2.5 rounded-lg">
        {rateText}
      </span>
    </div>
  );
}

export default memo(PriceExchangeRate);
