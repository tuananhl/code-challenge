import { ChangeEvent, memo, useCallback } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import debounce from 'lodash.debounce';
import { twMerge } from 'tailwind-merge';
import SwapIcon from '@assets/exchange-arrow.svg';
import { formatNumber } from '@utils/number.util';
import Spinner from '@components/atomic/Spinner';
import CurrenciesDropdown from '@modules/PriceExchange/components/CurrenciesDropdown';
import { IExchangeFormValues } from '@modules/PriceExchange/types/exchange-form.types';

interface Props {
  isLoadingRate: boolean;
  onGetExchangeRate: (keepSilent?: boolean) => Promise<number>;
}

function PriceExchangeFormContainer({
  isLoadingRate,
  onGetExchangeRate,
}: Props) {
  const { control, getValues, setValue, watch } = useFormContext<IExchangeFormValues>();
  const { errors, isSubmitting } = useFormState({ control }); 
  const toAmount = watch('to_amount');
  const from = watch('from');
  const to = watch('to');

  const handleCalculateByRate = useCallback(debounce(async (newValue: string) => {
    const rate = await onGetExchangeRate(false);
    setValue('to_amount', (Number(newValue) * rate).toString());
  }, 1_000), [setValue, onGetExchangeRate]);
  
  async function handleFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.target.value.replaceAll(' ', '');
    setValue('from_amount', newValue, { shouldValidate: true });
    if (newValue) handleCalculateByRate(newValue);
  }

  const swapCurrencyPosition = useCallback(() => {
    const to = getValues('to');
    const from = getValues('from');
    const fromAmount = getValues('from_amount');
    setValue('from', to);
    setValue('from_amount', toAmount);
    setValue('to', from);
    setValue('to_amount', fromAmount);
  }, [getValues, setValue, toAmount]);

  const handleCurrencyChange = useCallback((newCurrency: string, fieldName: 'from' | 'to') => {
    const currentFieldValue = getValues(fieldName);
    if (currentFieldValue === newCurrency) return;
    const fieldValue = getValues(fieldName === 'to' ? 'from' : 'to');
    if (fieldValue === newCurrency) {
      swapCurrencyPosition();
      return;
    }
    setValue(fieldName, newCurrency);
    setValue('to_amount', '0');
  }, [getValues, setValue, swapCurrencyPosition]);

  const handleFromCurrencyChange = useCallback((newCurrency: string) => {
    handleCurrencyChange(newCurrency, 'from');
  }, [handleCurrencyChange]);

  const handleTargetCurrencyChange = useCallback((newCurrency: string) => {
    handleCurrencyChange(newCurrency, 'to');
  }, [handleCurrencyChange]);

  return (
    <>
      <div>
        <label className="inline-block text-sm font-medium text-black-00 leading-5">You send</label>
        <div className={twMerge('mt-3 flex items-center swap-form-input rounded-xl', errors?.from_amount?.message && 'error')}>
          <Controller
            render={({ field }) => (
              <input
                inputMode="decimal"
                placeholder="0"
                disabled={isSubmitting}
                className="input-price w-full disabled:opacity-65 disabled:cursor-not-allowed"
                readOnly={isLoadingRate}
                onChange={handleFieldChange}
                value={formatNumber(field.value)}
              />
            )}
            control={control}
            name="from_amount"
          />
          <CurrenciesDropdown isDisabled={isSubmitting} selectedCurrency={from} onChangeCurrency={handleFromCurrencyChange} />
        </div>
        {errors?.from_amount?.message && (
          <div className="text-sm font-normal leading-normal text-red-500 mt-1">{errors?.from_amount?.message}</div>
        )}
      </div>
      <div className="my-5 text-center leading-0">
        <div
          className={twMerge('leading-0 inline-block relative', isLoadingRate ? 'cursor-not-allowed' : 'cursor-pointer')}
          onClick={() => {
            if (isLoadingRate) return;
            swapCurrencyPosition();
          }}
        >
          {isLoadingRate && (
            <div className="leading-0 absolute -right-10 top-1/2 -translate-y-1/2"><Spinner /></div>
          )}
          <img src={SwapIcon} alt="Swap" className="mx-auto" />
        </div>
      </div>
      <div>
        <label className="inline-block text-sm font-medium text-black-00 leading-5">Will get</label>
        <div className="mt-3 flex items-center swap-form-input rounded-xl">
          <div className={twMerge('h-[62px] input-price w-full overflow-hidden whitespace-nowrap', isSubmitting && 'opacity-65 cursor-not-allowed')}>
            {formatNumber(toAmount)}
          </div>
          <CurrenciesDropdown isDisabled={isSubmitting} selectedCurrency={to} onChangeCurrency={handleTargetCurrencyChange} />
        </div>
      </div>
      <button type="submit" disabled={isLoadingRate || isSubmitting} role="button" className="mt-10 cursor-pointer py-3 px-10 rounded-xl w-full bg-primary-00 text-base font-medium text-white">
        {isSubmitting ? <Spinner className="w-6 h-6 border-gray-50 border-t-black-00 mx-auto" /> : 'Swap'}
      </button>
    </>
  );
}

export default memo(PriceExchangeFormContainer);
