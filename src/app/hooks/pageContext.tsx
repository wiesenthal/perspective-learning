"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import useLocalStorage from "./useLocalStorage";

export enum Page {
  Home,
  Upload,
  Download,
}

interface PageNavigatorContextProps {
  page?: Page;
  setPage: (page: Page) => void;
}

const PageNavigatorContext = createContext<
  PageNavigatorContextProps | undefined
>(undefined);

export const PageNavigatorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { value: page, setValue: setPage } = useLocalStorage<Page>(
    "page",
    Page.Home
  );

  return (
    <PageNavigatorContext.Provider value={{ page, setPage }}>
      {children}
    </PageNavigatorContext.Provider>
  );
};

export const usePageNavigator = () => {
  const context = useContext(PageNavigatorContext);
  if (!context) {
    throw new Error(
      "usePageNavigator must be used within a PageNavigatorProvider"
    );
  }
  return context;
};
