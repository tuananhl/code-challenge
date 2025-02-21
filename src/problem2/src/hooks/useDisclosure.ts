import { useCallback, useState } from 'react';

interface Props {
  defaultIsOpen?: boolean;
}

function useDisclosure(props?: Props) {
  const [isOpen, setOpen] = useState<boolean>(props?.defaultIsOpen ?? false);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setOpen((currentIsOpen) => !currentIsOpen);
  }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}

export default useDisclosure;
