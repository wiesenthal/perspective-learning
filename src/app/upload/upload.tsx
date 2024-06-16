import Button from "@/components/Button";
import ChatBox from "./components/ChatBox";
import { Page, usePageNavigator } from "../hooks/pageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";

export default function Upload() {
  const { setPage } = usePageNavigator();
  const { value: id } = useLocalStorage<string>(
    "upload-id",
    `${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 15)}`
  );
  const [title, setTitle] = useState<string>();
  return (
    <div className="size-full flex flex-col items-center justify-start">
      <h1 className="text-2xl md:text-6xl font-bold font-ageta">
        {title || "Upload Perspective"}
      </h1>
      {id && (
        <ChatBox
          id={id}
          setTitle={setTitle}
          doesSave={true}
          defaultMessages={[
            {
              id: "0",
              role: "system",
              content: `Your task is to download a core perspective from the user. Be laser focused on this and empathetic. You soak in their perspective by elucidating a rich story that formed their core belief.`,
            },
            {
              id: "1",
              role: "assistant",
              content: `What perspective do you want to upload today?`,
            },
          ]}
        />
      )}
      <Button
        className="text-2xl md:text-4xl p-12 md:p-24 fixed bottom-48 right-4 md:bottom-12 md:left-12"
        onMouseDown={() => {
          setPage(Page.Home);
        }}
      >
        Back
      </Button>
    </div>
  );
}
