import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

function Spinner({
  className = 'w-5 h-5',
}: Props) {
  return (
    <div className={twMerge('box-border rounded-full border-2 border-black-00 border-t-gray-50 animate-spinner', className)} />
  )
}

export default memo(Spinner);
