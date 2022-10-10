import ComponentPromiseError from "ComponentPromiseError";
import { useRef } from "react";

const INTERVAL_CHECK_MS: number = 200;

function useComponentPromise<T>() {
  const doneVerification = useRef(false);
  const doneVerificationInterval = useRef<NodeJS.Timer>();
  const doneValue = useRef<T | PromiseLike<T>>();

  const errorVerification = useRef(false);
  const errorVerificationInterval = useRef<NodeJS.Timer>();
  const errorValue = useRef<Error>();

  const clear = () => {
    clearInterval(doneVerificationInterval.current);
    clearInterval(errorVerificationInterval.current);
    doneVerification.current = false;
    errorVerification.current = false;
  };

  const getComponentPromise = () => {
    clear();
    return new Promise<T | undefined>((resolve, reject) => {
      doneVerificationInterval.current = setInterval(() => {
        if (doneVerification.current) {
          clear();
          resolve(doneValue.current);
        }
      }, INTERVAL_CHECK_MS);
      errorVerificationInterval.current = setInterval(() => {
        if (errorVerification.current) {
          clear();
          reject(errorValue.current);
        }
      }, INTERVAL_CHECK_MS);
    });
  };

  const resolve = (value?: T) => {
    doneVerification.current = true;
    doneValue.current = value;
  };

  const reject = (error?: Error) => {
    errorVerification.current = true;
    errorValue.current = error || new ComponentPromiseError();
  };

  return { getComponentPromise, resolve, reject };
}

export default useComponentPromise;
