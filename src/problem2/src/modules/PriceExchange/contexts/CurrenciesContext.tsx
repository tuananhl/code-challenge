import { createContext, memo, ReactNode, useMemo, useContext } from 'react';
import { ICurrency } from '@typed/currency.types';
import { EMPTY_ARRAY } from '@utils/array.util';

interface ICurrentContextValues {
  currencies: ICurrency[];
}

interface Props extends ICurrentContextValues {
  children: ReactNode;
}

const CurrenciesContext = createContext<ICurrentContextValues>({
  currencies: EMPTY_ARRAY as ICurrency[],
});

function useCurrenciesContext() {
  return useContext(CurrenciesContext);
}

function CurrenciesContextProvider({ currencies, children }: Props) {
  const values = useMemo<ICurrentContextValues>(() => ({
    currencies,
  }), [currencies]);

  return (
    <CurrenciesContext.Provider value={values}>
      {children}
    </CurrenciesContext.Provider>
  )
}

export { useCurrenciesContext };
export default memo(CurrenciesContextProvider);