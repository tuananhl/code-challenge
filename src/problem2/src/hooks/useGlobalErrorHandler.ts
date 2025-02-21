import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

function useGlobalErrorHandler() {
  // we can pass the configs of toast via params here. but not for now.
  const handleShowErrorMessage = useCallback((error: unknown) => {
    if (error instanceof AxiosError || error instanceof Error) {
      toast.error(error.message);
      return;
    }
    toast.error('Oops, something went wrong. Please try again later.');
  }, []);

  return { showErrorMessage: handleShowErrorMessage };
}

export default useGlobalErrorHandler;
