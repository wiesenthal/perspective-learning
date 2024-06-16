import Button from "@/components/Button";
import ChatBox from "../components/ChatBox";
import { Page, usePageNavigator } from "../hooks/pageContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

export default function Upload() {
  const { setPage } = usePageNavigator();
  const { value: id, setValue: setId } = useLocalStorage<string>(
    "upload-id",
    `${Math.random().toString(36).substring(2, 15)}${Math.random()
      .toString(36)
      .substring(2, 15)}`
  );
  const {
    value: allIds,
    setValue: setAllIds,
    getIsLoading: getIsLoadingAllIds,
  } = useLocalStorage<{ id: string; title: string }[]>("upload-ids", []);
  const [title, setTitle] = useState<string>();
  const [openSelector, setOpenSelector] = useState<boolean>(false);

  useEffect(() => {
    if (
      title &&
      !getIsLoadingAllIds() &&
      !allIds?.some((t) => t.id === id) &&
      id
    ) {
      setAllIds([...(allIds || []), { id, title }]);
    }
  }, [title, getIsLoadingAllIds, allIds, id]);

  return (
    <div className="size-full flex flex-col items-center justify-start">
      <Title
        onMouseDown={() => {
          if (allIds?.length === 1 && allIds[0].id === id) {
            setTitle(undefined);
            setId(
              `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`
            );
          } else if (allIds?.length && allIds.length > 1) {
            setOpenSelector((prev) => !prev);
          }
        }}
      >
        {title || "Upload Perspective"}
      </Title>
      {openSelector && allIds && (
        <UploadSelector
          allIds={allIds}
          setId={setId}
          setTitle={setTitle}
          setOpenSelector={setOpenSelector}
          newPerspective={() => {
            setTitle(undefined);
            setId(
              `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`
            );
          }}
        />
      )}
      {id && (
        <ChatBox
          key={id}
          id={id}
          setTitle={setTitle}
          doesSave={true}
          defaultMessages={[
            {
              id: `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`,
              role: "system",
              content: `Your task is to download a core perspective from the user. Be laser focused on this and empathetic. You soak in their perspective by elucidating a rich story that formed their core belief.`,
            },
            {
              id: `${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`,
              role: "assistant",
              content: `What perspective do you want to upload today?`,
            },
          ]}
        />
      )}
      <Button
        className="text-2xl md:text-4xl p-12 md:p-16 fixed bottom-4 right-4 md:bottom-12 md:left-12"
        onMouseDown={() => {
          setPage(Page.Home);
        }}
      >
        Back
      </Button>
    </div>
  );
}

const UploadSelector = ({
  allIds,
  setId,
  setTitle,
  setOpenSelector,
  newPerspective,
}: {
  allIds: { id: string; title: string }[];
  setId: (id: string) => void;
  setTitle: (title: string) => void;
  setOpenSelector: (open: boolean) => void;
  newPerspective: () => void;
}) => {
  const handleClick = (id: string, title: string) => {
    setId(id);
    setTitle(title);
    setOpenSelector(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".UploadSelector")) {
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
        className="UploadSelector fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center bg-black/50 p-12 rounded-full max-h-[80%] overflow-y-auto backdrop-blur"
        onMouseDown={() => setOpenSelector(false)}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {allIds?.map(({ id, title }) => (
            <Button
              key={id}
              className="text-2xl md:text-2xl p-24"
              onMouseDown={() => handleClick(id, title)}
            >
              {title}
            </Button>
          ))}
          <Button
            className="text-4xl scale-200 md:text-6xl p-24 bg-blue-700/90 hover:bg-blue-600/80"
            onMouseDown={newPerspective}
          >
            New +
          </Button>
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
