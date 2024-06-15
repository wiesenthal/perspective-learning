"use client";

import { useEffect, useRef, useState } from "react";

const getFromLocalStorage = <T>(key: string): T | undefined => {
  const value =
    typeof window !== "undefined" && window.localStorage?.getItem(key);
  if (value) {
    console.log("value", value);
    return JSON.parse(value)["value"];
  }
};

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, _setValue] = useState<T | undefined>();
  const isLoading = useRef(true);

  useEffect(() => {
    if (isLoading.current) {
      const value = getFromLocalStorage<T>(key) ?? defaultValue;
      if (value !== undefined) {
        _setValue(value);
      }
      isLoading.current = false;
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

  return { value, setValue };
}
