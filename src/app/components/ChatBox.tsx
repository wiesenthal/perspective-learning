"use client";

import useLocalStorage from "@/app/hooks/useLocalStorage";
import { useRefState } from "@/app/hooks/useRefState";
import { cn } from "@/lib/utils";
import { useChat, Message } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function ChatBox({
  id,
  defaultMessages,
  setTitle,
  doesSave,
}: {
  id: string;
  defaultMessages?: Message[];
  setTitle: (title: string) => void;
  doesSave: boolean;
}) {
  const [voice, setVoice] = useState("aura-luna-en");
  const {
    value: initialMessages,
    setValue: setInitialMessages,
    getIsLoading: getIsLoadingInitialMessages,
  } = useLocalStorage<Message[]>(
    `initialMessages-${id}`,
    defaultMessages ?? []
  );
  const hasSubmitted = useRef(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading: isLoadingChat,
  } = useChat({
    api: "/api/generate",
    initialMessages,
    onFinish: (message) => {
      let sentences = message.content
        .match(/[^.!?]+[.!?]/g)
        ?.map((sentence) => sentence.trim());
      if (!sentences || sentences.length <= 1) return;
      const lastSentence = sentences[sentences.length - 1];
      setMessagesToPlay((prev) => [...prev, lastSentence]);
    },
  });
  const [getMessagesToPlay, setMessagesToPlay] = useRefState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const seenSentenceMap = useRef<Record<string, Set<string>>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  };

  const { value: title, setValue: _setTitle } = useLocalStorage<string>(
    `title-${id}`,
    ""
  );

  useEffect(() => {
    if (title) {
      setTitle(title);
    }
  }, [title]);

  const promptForSummary = async () => {
    const result = await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "Encapsulate the subject into 3 short words or less",
          },
          ...messages,
          {
            role: "user",
            content:
              "Encapsulate the subject into 3 short words or less, do not include upload or download",
          },
        ],
      }),
    });

    const text = await result.text();
    _setTitle(text);
  };

  useEffect(() => {
    if (messages.length > 0 && !isLoadingChat) {
      setInitialMessages(messages);
      if (doesSave) {
        fetch("/api/saveChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            title,
            messages,
          }),
        });
      }
    }
    if (messages.length > 3 && !title) {
      promptForSummary();
    }
  }, [messages.length, isLoadingChat]);

  const hasLoadedInitialMessages = useRef(false);

  useEffect(() => {
    if (getIsLoadingInitialMessages() || hasLoadedInitialMessages.current)
      return;
    if (initialMessages) {
      hasLoadedInitialMessages.current = true;
      setMessages(initialMessages);
    }
  }, [getIsLoadingInitialMessages()]);

  useEffect(() => {
    scrollToBottom();
    if (!hasSubmitted.current) return;
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.role === "assistant") {
      let sentences = latestMessage.content
        .match(/[^.!?]+[.!?]/g)
        ?.map((sentence) => sentence.trim());
      if (!sentences || sentences.length <= 1) return;
      sentences = sentences.slice(0, sentences.length - 1);

      for (const sentence of sentences) {
        if (!seenSentenceMap.current[latestMessage.id]?.has(sentence)) {
          if (!seenSentenceMap.current[latestMessage.id]) {
            seenSentenceMap.current[latestMessage.id] = new Set();
          }
          console.log("new sentence", latestMessage.id, sentence);
          setMessagesToPlay((prev) => [...prev, sentence]);
          seenSentenceMap.current[latestMessage.id].add(sentence);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    if (!isPlaying && getMessagesToPlay().length > 0) {
      playNextMessage();
    }
  }, [getMessagesToPlay(), isPlaying]);

  const playNextMessage = async () => {
    if (getMessagesToPlay().length === 0) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.onended = null; // Clear the onended event handler
      }
      return;
    }
    if (isPlaying) return;

    setIsPlaying(true);
    const text = getMessagesToPlay()[0];
    console.log(
      "playing",
      text,
      getMessagesToPlay(),
      getMessagesToPlay().slice(1)
    );
    setMessagesToPlay((prev) => prev.slice(1));

    // return;

    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, model: voice }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const audioUrl = data.audioUrl;

      if (audioRef.current) {
        audioRef.current.onended = null; // Clear the previous onended event handler
        audioRef.current.src = audioUrl;
        console.log("playing", audioRef.current.src);
        audioRef.current.onended = async () => {
          await fetch("/api/deleteAudio", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileName: audioUrl }),
          });
          setIsPlaying(false);
        };
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center size-full overflow-auto">
      <div className="flex flex-col items-center justify-center w-full md:w-3/4 md:p-8 gap-8">
        {messages
          .filter((message) => message.role !== "system")
          .map((message) => (
            <MessageBox key={message.id} role={message.role} id={message.id}>
              {message.content}
            </MessageBox>
          ))}
        <div ref={messagesEndRef} />
        <form
          onSubmit={(e) => {
            hasSubmitted.current = true;
            handleSubmit(e);
          }}
          className="bg-white/70 dark:bg-neutral-800/70 rounded-5xl w-full text-lg"
        >
          <input
            className="size-full rounded-5xl p-16"
            onChange={handleInputChange}
            value={input}
            placeholder="Input Message Here"
          />
        </form>
      </div>
      <VoiceSelect voice={voice} setVoice={setVoice} />
      <audio ref={audioRef} />
    </div>
  );
}

function VoiceSelect({
  voice,
  setVoice,
}: {
  voice: string;
  setVoice: (voice: string) => void;
}) {
  return (
    <div className="fixed bottom-72 right-4 md:bottom-16 md:right-16">
      <div className="flex flex-row items-center justify-center w-full gap-8">
        <select
          className="bg-neutral-500 text-white rounded-5xl p-2 w-20 h-20 md:w-24 md:h-24 flex justify-center items-center text-xs md:text-md font-custom text-center"
          id="voices"
          name="voices"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          <option value="aura-asteria-en">Asteria</option>
          <option value="aura-luna-en">Luna</option>
          <option value="aura-stella-en">Stella</option>
          <option value="aura-athena-en">Athena</option>
          <option value="aura-hera-en">Hera</option>
          <option value="aura-orion-en">Orion</option>
          <option value="aura-arcas-en">Arcas</option>
          <option value="aura-perseus-en">Perseus</option>
          <option value="aura-angus-en">Angus</option>
          <option value="aura-orpheus-en">Orpheus</option>
          <option value="aura-helios-en">Helios</option>
          <option value="aura-zeus-en">Zeus</option>
        </select>
      </div>
    </div>
  );
}

function MessageBox({
  role,
  id,
  children,
}: {
  role: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div
      key={id}
      className={cn(
        "bg-white dark:bg-neutral-800 p-8 rounded-5xl w-full text-lg",
        role === "user" && "bg-white/50 dark:bg-neutral-800/50"
      )}
    >
      <div className="text-sm text-gray-500">
        {role === "user" ? "You" : "AI"}
      </div>
      <div className="md:p-8 rounded-2xl w-full text-lg md:text-2xl">
        {children}
      </div>
    </div>
  );
}
