import * as yup from 'yup';
import { IExchangeFormValues } from '@modules/PriceExchange/types/exchange-form.types';

function getPriceExchangeValidationSchema() {
  return yup.object({
    from_amount: yup
      .string()
      .trim()
      .required('Enter your amount to swap')
      .test({
        name: 'amount_value_check',
        message: 'The amount must be great than 0',
        test() {
          const { originalValue } = this;
          if (Number.isNaN(originalValue)) return false;
          if (Number(originalValue) === 0) return false;
          return true;
        },
      })
      .test({
        name: 'max_amount_value',
        message: 'The amount must be less than 1 million',
        test() {
          const { originalValue } = this;
          if (Number.isNaN(originalValue)) return true;
          return Number(originalValue) <= 100_000_000;
        },
      }),
  }) as unknown as yup.ObjectSchema<IExchangeFormValues>;
}

export default getPriceExchangeValidationSchema;
