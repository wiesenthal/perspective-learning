import { PageNavigatorProvider } from "../hooks/pageContext";
import HomePage from "./HomePage";

export default function MAINPAGE() {
  return (
    <PageNavigatorProvider>
      <HomePage />
    </PageNavigatorProvider>
  );
}
