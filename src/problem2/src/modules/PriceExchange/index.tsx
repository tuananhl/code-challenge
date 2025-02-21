import { memo, useCallback, useMemo, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { sleep } from '@utils/timer.util';
import { yupResolver } from '@hookform/resolvers/yup';
import { IExchangeFormValues } from './types/exchange-form.types';
import PriceExchangeRate from './parts/PriceExchangeRate';
import useExchangeRateLive from './hooks/useExchangeRateLive';
import PriceExchangeForm from './parts/PriceExchangeForm';
import useCurrencyExchangeRate from './hooks/useCurrencyExchangeRate';
import getPriceExchangeValidationSchema from './schema/price-exchange.schema';

function PriceExchange() {
  const isDoneFirstCalculation = useRef<boolean>(false);
  const formMethods = useForm<IExchangeFormValues>({
    defaultValues: {
      from: 'ETH',
      to: 'USD',
      from_amount: '1',
      to_amount: '0',
      price_rate: 0,
    },
    resolver: yupResolver(getPriceExchangeValidationSchema()),
  });
  const from = formMethods.watch('from');
  const to = formMethods.watch('to');

  const handleRateChange = useCallback((newRate: number) => {
    formMethods.setValue('price_rate', newRate);
    if (!isDoneFirstCalculation.current) {
      const fromAmount = formMethods.getValues('from_amount');
      formMethods.setValue('to_amount', (Number(fromAmount) * newRate).toString());
    }
  }, [formMethods]);

  const { isGettingRate, onGetExchangeRate } = useCurrencyExchangeRate(from, to, handleRateChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liveId = useMemo(() => Date.now().toString(), [from, to, isGettingRate]);
  useExchangeRateLive(onGetExchangeRate, liveId);

  const onSubmit = useCallback(async (values: IExchangeFormValues) => {
    return sleep(3_000).then(() => {
      toast.success(`Swap from ${values.from_amount} ${values.from} to ${values.to_amount} ${values.to} successfully`);
    });
  }, []);

  return (
    <FormProvider {...formMethods}>
      <div className="flex items-center justify-center bg-white w-full h-full">
        <form onSubmit={formMethods.handleSubmit(onSubmit)} className="swap-form-wrapper w-[600px] rounded-2xl py-5 px-10 relative">
          <img loading="lazy" src="/assets/swap-logo.svg" width="180px" className="mx-auto" />
          <PriceExchangeRate isLoadingRate={isGettingRate} />
          <div className="mt-10 block">
            <PriceExchangeForm isLoadingRate={isGettingRate} onGetExchangeRate={onGetExchangeRate} />
          </div>
        </form>
      </div>
    </FormProvider>
  );
}

export default memo(PriceExchange);
