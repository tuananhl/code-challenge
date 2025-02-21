import axios, { AxiosResponse } from 'axios';
import { ICurrency } from '@typed/currency.types';

async function getCurrencies() {
  return axios.get('/prices.json')
    .then((response: AxiosResponse<ICurrency[]>) => response.data)
    .then((currencies) => {
      // Remove duplicate items
      const currenciesMap = currencies.reduce<Record<string, ICurrency>>((hashMap, currency) => ({
        ...hashMap,
        [currency.currency]: currency,
      }), {});
      return Object.values(currenciesMap);
    });
}

async function getExchangeRate(from: string, to: string): Promise<number> {
  return axios.get('/prices.json')
    .then((response: AxiosResponse<ICurrency[]>) => response.data)
    .then((currencies) => {
      const [fromCurrency, toCurrency] = currencies
        .filter((currency) => [from, to].includes(currency.currency))
        .sort((a) => a.currency === from ? -1 : 1);
      return fromCurrency.price / toCurrency.price;
    });
}

export {
  getCurrencies,
  getExchangeRate,
};
