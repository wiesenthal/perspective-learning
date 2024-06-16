import Button from "@/components/Button";
import ChatBox from "./components/ChatBox";
import { Page, usePageNavigator } from "../hooks/pageContext";

export default function Upload() {
  const { setPage } = usePageNavigator();
  return (
    <div className="size-full flex flex-col items-center justify-start">
      <h1 className="text-6xl font-bold font-ageta">Upload Perspective</h1>
      <ChatBox />
      <Button
        className="text-4xl p-24 fixed bottom-12 left-12"
        onMouseDown={() => {
          setPage(Page.Home);
        }}
      >
        Back
      </Button>
    </div>
  );
}
