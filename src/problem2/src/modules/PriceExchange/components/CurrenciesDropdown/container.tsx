import { memo, useMemo } from 'react';
import { useCurrenciesContext } from '../../contexts/CurrenciesContext';
import FLAGS from '../../constants/flag';
import CheckIcon from '../../../../icons/Check';
import useKeyword from '../../../../hooks/useKeyword';
import Fuse from 'fuse.js';

interface Props {
  selectedCurrency: string;
  onChangeCurrency: (currency: string) => void;
  onClose: () => void;
}

function CurrenciesDropdownContainer({
  selectedCurrency,
  onChangeCurrency,
  onClose,
}: Props) {
  const { currencies } = useCurrenciesContext();
  const { keyword, onChangeKeyword } = useKeyword(null);
  
  const fuse = useMemo(() => new Fuse(currencies, { threshold: 0.4, keys: ['currency'] }), [currencies]);
  const listCurrencies = useMemo(() => {
    if (!keyword) return currencies;
    return fuse.search(keyword).map((item) => item.item);
  }, [currencies, fuse, keyword]);

  return (
    <div className="w-[350px] h-[360px] pt-5 pb-3 px-2.5 shadow-[0_0_40px_rgba(69,71,69,.2)] bg-white rounded-xl overflow-y-auto">
      <input type="text" placeholder="Your keyword" className="input-control mb-2" defaultValue={keyword ?? ''} onChange={(event) => onChangeKeyword(event.target.value)} />
      <div className="flex flex-col gap-0.5">
        {listCurrencies.length === 0 && (
          <div className="text-center ws-text-base font-normal text-red-500">No currencies</div>
        )}
        {listCurrencies.map((currency) => (
          <div
            key={currency.currency}
            className="flex items-center justify-between gap-5 py-2 px-2.5 rounded-xl hover:shadow-[inset_0_0_0_1px_var(--color-black-00)] cursor-pointer"
            onClick={() => {
              onClose();
              onChangeCurrency(currency.currency);
            }}
          >
            <div className="flex items-center gap-5 w-full">
              <img loading="lazy" className="w-6 h-6" src={FLAGS[currency.currency]} />
              <div className="text-xl uppercase font-normal leading-normal text-black-00">{currency.currency}</div>
            </div>
            {selectedCurrency === currency.currency && (
              <div className="leading-0"><CheckIcon className="w-6 h-6 stroke-primary-00" /></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(CurrenciesDropdownContainer);
