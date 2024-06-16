"use client";

import { useRefState } from "@/app/hooks/useRefState";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

export default function ChatBox({}: {}) {
  const [voice, setVoice] = useState("aura-luna-en");
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/generate",
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

  useEffect(() => {
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
    scrollToBottom();
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
      <div className="flex flex-col items-center justify-center w-full md:w-3/4 p-16 gap-8">
        {messages.map((message) => (
          <Message key={message.id} role={message.role}>
            {message.content}
          </Message>
        ))}
        <div ref={messagesEndRef} />
        <form
          onSubmit={handleSubmit}
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
    <div className="fixed bottom-16 right-16">
      <div className="flex flex-row items-center justify-center w-full gap-8">
        <select
          className="bg-neutral-500 text-white rounded-5xl p-2 w-24 h-24 flex justify-center items-center text-md font-ageta text-center"
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

function Message({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-800 p-8 rounded-5xl w-full text-lg",
        role === "user" && "bg-white/50 dark:bg-neutral-800/50"
      )}
    >
      <div className="text-sm text-gray-500">{role}</div>
      <div className="p-8 rounded-2xl w-full text-lg md:text-2xl">
        {children}
      </div>
    </div>
  );
}
