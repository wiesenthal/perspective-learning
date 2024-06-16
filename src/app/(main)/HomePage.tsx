"use client";

import Home from "./Home";
import Upload from "../upload/upload";
import { Page, usePageNavigator } from "../hooks/pageContext";

export default function HomePage() {
  const { page } = usePageNavigator();
  return (
    <div className="size-full flex flex-col justify-start items-center px-4 md:px-8 py-4">
      {page === Page.Home && <Home />}
      {page === Page.Upload && <Upload />}
    </div>
  );
}
