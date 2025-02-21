import './index.css';

interface Props {
  borderRadius?: string;
  className?: string;
}

function Skeleton({
  borderRadius = '12px',
  className,
}: Props) {
  return (
    <div className={`skeleton-box ${className}`} style={{ borderRadius }} />
  );
}

export default Skeleton;
