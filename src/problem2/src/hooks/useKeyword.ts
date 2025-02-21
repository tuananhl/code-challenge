import debounce from 'lodash.debounce';
import { useCallback, useState } from 'react';

function useKeyword(defaultKeyword: string | null) {
  const [keyword, setKeyword] = useState<string | null>(defaultKeyword);

  const handleChangeKeyword = useCallback(debounce((newKeyword: string) => {
    setKeyword(newKeyword);
  }, 500), []);

  return { keyword, onChangeKeyword: handleChangeKeyword };
}

export default useKeyword;
