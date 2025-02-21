import { IconProps } from './types';

function CheckIcon(props: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" strokeWidth="1" stroke="#fff" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 3L4.5 8.5L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default CheckIcon;