import Button from "@/components/Button";
import ChatBox from "../components/ChatBox";
import { Page, usePageNavigator } from "../hooks/pageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Perspective, Prisma } from "@prisma/client";

export default function Download() {
  const { setPage } = usePageNavigator();
  const [openSelector, setOpenSelector] = useState<boolean>(false);
  const {
    value: id,
    setValue: setId,
    getIsLoading: getIsLoadingId,
  } = useLocalStorage<string | undefined>("download-id", undefined);

  const [perspectives, setPerspectives] = useState<
    Prisma.PerspectiveGetPayload<{ include: { messages: true } }>[]
  >([]);

  const selectedPerspective = useMemo(
    () => perspectives?.find((p) => p.id === id),
    [perspectives, id]
  );

  const constructSysPrompt = useCallback(
    (
      perspective: Prisma.PerspectiveGetPayload<{ include: { messages: true } }>
    ) => {
      if (!perspective) return;
      return `\
"""
${perspective.messages.map((m) => `${m.role}: ${m.content}`).join("\n\n")}
"""

Above is the uploaded perspective of a different user, created long ago.

Your task is to download this perspective into a new person that you will be conversing with.
You will do so by telling them a story in the second person (like a choose your own adventure) that will allow them to empathise and form the core belief represented by the perspective above.
You will put this new person in a situation which reflects the core belief of the perspective above, and tell them about how and why they are feeling in this empathy simulation.
`;
    },
    []
  );

  useEffect(() => {
    const getPerspectives = async () => {
      const response = await fetch("/api/perspectives", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPerspectives(data);
    };
    getPerspectives();
  }, []);

  // need to replace sys prompt with the message history, and make new message history

  return (
    <div className="size-full flex flex-col items-center justify-start">
      <Title
        onMouseDown={() => {
          if (!id) return;
          setOpenSelector(true);
        }}
      >
        {selectedPerspective?.name || "Download Perspective"}
      </Title>
      {openSelector && perspectives?.length > 0 && (
        <DownloadSelector
          perspectives={perspectives}
          setId={setId}
          setOpenSelector={setOpenSelector}
        />
      )}
      {!getIsLoadingId() && !id && perspectives?.length > 0 && (
        <DownloadSelector
          perspectives={perspectives}
          setId={setId}
          setOpenSelector={setOpenSelector}
        />
      )}
      {id && selectedPerspective && (
        <ChatBox
          key={id}
          id={`download-${id}`}
          setTitle={() => {}}
          doesSave={false}
          defaultMessages={[
            {
              id: `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`,
              role: "system",
              content: constructSysPrompt(selectedPerspective) ?? "",
            },
            {
              id: `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`,
              role: "assistant",
              content: `Ready to begin downloading the new perspective?`,
            },
          ]}
        />
      )}
      <Button
        className="text-2xl md:text-4xl p-12 md:p-16 fixed bottom-48 right-4 md:bottom-12 md:left-12"
        onMouseDown={() => {
          setPage(Page.Home);
        }}
      >
        Back
      </Button>
    </div>
  );
}

const DownloadSelector = ({
  perspectives,
  setId,
  setOpenSelector,
}: {
  perspectives: Prisma.PerspectiveGetPayload<{ include: { messages: true } }>[];
  setId: (id: string) => void;
  setOpenSelector: (open: boolean) => void;
}) => {
  const handleClick = (id: string) => {
    setId(id);
    setOpenSelector(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".DownloadSelector")) {
        setOpenSelector(false);
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="size-full fixed bg-white/50 top-0 left-0 backdrop-blur-sm">
      <div
        className="DownloadSelector fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center bg-black/50 p-12 rounded-full max-h-[80%] overflow-y-auto backdrop-blur"
        onMouseDown={() => setOpenSelector(false)}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {perspectives?.map(({ id, name }) => (
            <Button
              key={id}
              className="text-2xl md:text-2xl p-24"
              onMouseDown={() => handleClick(id)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Title = ({
  onMouseDown,
  children,
}: {
  onMouseDown?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <h1
      className="text-4xl md:text-8xl font-bold font-custom cursor-pointer"
      onMouseDown={onMouseDown}
    >
      {children}
    </h1>
  );
};
