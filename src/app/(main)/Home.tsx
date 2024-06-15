"use client";

import Button from "@/components/Button";
import { Page, usePageNavigator } from "../hooks/pageContext";

export default function Home() {
  const { setPage } = usePageNavigator();
  return (
    <div className="size-full flex flex-col justify-start items-center p-24">
      <Button
        className="text-5xl leading-relaxed"
        onMouseDown={(e) => {
          console.log("upload");
          setPage(Page.Upload);
        }}
      >
        Upload Perspective
      </Button>
    </div>
  );
}
