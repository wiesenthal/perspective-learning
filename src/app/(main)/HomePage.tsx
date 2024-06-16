"use client";

import Home from "./Home";
import Upload from "../upload/upload";
import { Page, usePageNavigator } from "../hooks/pageContext";
import Download from "../download/download";

export default function HomePage() {
  const { page } = usePageNavigator();
  return (
    <div className="size-full flex flex-col justify-start items-center px-4 py-4 pt-8 md:px-8">
      {page === Page.Home && <Home />}
      {page === Page.Upload && <Upload />}
      {page === Page.Download && <Download />}
    </div>
  );
}
