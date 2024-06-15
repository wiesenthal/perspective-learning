import Button from "@/components/Button";
import ChatBox from "./components/ChatBox";
import { Page, usePageNavigator } from "../hooks/pageContext";

export default function Upload() {
  const { setPage } = usePageNavigator();
  return (
    <div>
      {" "}
      <h1 className="text-6xl font-bold">Upload your mind</h1>
      <ChatBox />
      <Button
        className="text-4xl p-32 bg-orange-500 hover:bg-orange-400 fixed bottom-12 left-12"
        onMouseDown={() => {
          setPage(Page.Home);
        }}
      >
        Back
      </Button>
    </div>
  );
}
