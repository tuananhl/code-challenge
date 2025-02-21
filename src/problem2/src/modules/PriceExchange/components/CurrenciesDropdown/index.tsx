import { memo } from 'react';
import { Popover } from 'react-tiny-popover';
import { twMerge } from 'tailwind-merge';
import useDisclosure from '@hooks/useDisclosure';
import ArrowDownIcon from '@icons/ArrowDown';
import FLAGS from '@modules/PriceExchange/constants/flag';
import CurrenciesDropdownContainer from './container';

interface Props {
  selectedCurrency: string;
  onChangeCurrency: (currency: string) => void;
  isDisabled?: boolean;
}

function CurrenciesDropdown({
  selectedCurrency,
  onChangeCurrency,
  isDisabled = false,
}: Props) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={onClose}
      positions={['bottom', 'top', 'left', 'right']}
      content={(
        <CurrenciesDropdownContainer
          selectedCurrency={selectedCurrency}
          onChangeCurrency={onChangeCurrency}
          onClose={onClose}
        />
      )}
    >
      <div
        onClick={() => {
          if (isDisabled) return;
          onToggle();
        }}
        className={twMerge('py-3 px-5 inline-flex items-center gap-2 shrink-0 cursor-pointer', isDisabled && 'cursor-not-allowed')}
      >
        <img loading="lazy" className="w-6 h-6" src={FLAGS[selectedCurrency]} />
        <div className="text-xl uppercase leading-normal font-medium">{selectedCurrency}</div>
        <ArrowDownIcon className={`transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
    </Popover>
  );
}

export default memo(CurrenciesDropdown);
