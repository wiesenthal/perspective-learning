"use client";

import { useEffect, useRef, useState } from "react";
import { useRefState } from "./useRefState";

const getFromLocalStorage = <T>(key: string): T | undefined => {
  const value =
    typeof window !== "undefined" && window.localStorage?.getItem(key);
  if (value) {
    return JSON.parse(value)["value"];
  }
};

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, _setValue] = useState<T | undefined>();
  const [getIsLoading, setIsLoading] = useRefState(true);

  useEffect(() => {
    if (getIsLoading()) {
      const value = getFromLocalStorage<T>(key);
      if (value === undefined && defaultValue !== undefined) {
        setValue(defaultValue);
      } else if (value !== undefined) {
        _setValue(value);
      }
      setIsLoading(false);
    }
  }, []);

  const setValue = (value: T) => {
    window.localStorage?.setItem(
      key,
      JSON.stringify({
        value,
      })
    );
    _setValue(value);
  };

  return { value, setValue, getIsLoading };
}
