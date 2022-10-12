import ComponentPromiseError from "ComponentPromiseError";
import { useCallback, useState, useMemo } from "react";

type ResolveRejectState = {
  resolve: (value: unknown) => void | null;
  reject: (reason: any) => void | null;
};

const ResolveRejectStateDefault = {
  resolve: () => console.log("Component Promise did not start"),
  reject: () => console.log("Component Promise did not start"),
};

function useComponentPromise() {
  const [{ resolve, reject }, setResolveReject] = useState<ResolveRejectState>(
    ResolveRejectStateDefault
  );
  const start = useCallback(() => {
    return new Promise((res, rej) => {
      setResolveReject({
        resolve: res,
        reject: rej,
      });
    });
  }, []);

  const handleResolve = useCallback(
    (value: unknown) => {
      resolve(value);
      setResolveReject(ResolveRejectStateDefault);
    },
    [resolve]
  );

  const handleReject = useCallback(
    (reason: any) => {
      reject(reason || new ComponentPromiseError());
      setResolveReject(ResolveRejectStateDefault);
    },
    [reject]
  );

  return useMemo(
    () => ({
      start,
      resolve: handleResolve,
      reject: handleReject,
    }),
    [resolve, reject]
  );
}

export default useComponentPromise;
