import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/myapi";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useCompletion } from "ai/react";
import Cookies from "js-cookie";
import { MessagesSquareIcon, SendHorizonal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

const scrollChat = () => {
  const myDiv = document.querySelector(
    "div[style='min-width: 100%; display: table;']"
  );
  if (myDiv) {
    myDiv.scrollIntoView({ block: "end", behavior: "smooth" });
  }
};

// eslint-disable-next-line react/prop-types
export function ChatSection({ id }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        setTimeout(() => {
          scrollChat();
        }, 100);
      }}
    >
      <DialogTrigger
        disabled={!id}
        className="flex text-white items-center max-sm:w-full fixed bottom-4 right-4"
      >
        <Button
          onClick={() => {
            setOpen(true);
          }}
          disabled={!id}
          className="max-sm:w-full text-white"
        >
          <MessagesSquareIcon className="w-4 h-4 mr-2" />
          AI Chat
        </Button>
      </DialogTrigger>
      {id && (
        <ChatModal
          close={() => {
            setOpen(false);
          }}
          open={open}
          id={id}
        />
      )}
    </Dialog>
  );
}

// eslint-disable-next-line react/prop-types
export function ChatModal({ id, close, open }) {
  console.log("ChatModal id: ", id);
  const [messages, setMessages] = useState([]);

  async function getMessages() {
    const { data } = await api.post(`/ai/chat`, {
      contentId: id,
    });
    setMessages(data);
  }

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    setCompletion,
    isLoading,
  } = useCompletion({
    api: `${api.getUri()}/ai/chat/complete`,
    body: {
      contentId: id,
    },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("hanko")}`,
    },
    onFinish: async (prompt, completion) => {
      setInput("");
      setCompletion("");
      await api.post(`/ai/chat/save`, {
        contentId: id,
        resultText: completion,
        promptText: input,
      });
      await getMessages();
    },
  });

  useEffect(() => {
    getMessages().then(() => {
      scrollChat();
    });
  }, [id]);

  useEffect(() => {
    scrollChat();
  }, [completion, isLoading]);

  let flag = 0;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogOverlay className="bg-black/60 inset-0 fixed" />
      <DialogContent
        className="fixed bg-muted py-4 px-4 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] h-[480px] max-h-[480px] shadow-lg shadow-black/25 flex flex-col
      max-sm:w-screen max-sm:h-screen max-sm:max-w-full max-sm:max-h-full max-sm:rounded-none max-sm:top-0 max-sm:left-0 max-sm:-translate-x-0 max-sm:-translate-y-0
      "
      >
        <DialogTitle className="text-xl text-foreground font-black mb-4 items-center flex">
          <h1>AI Chat</h1>
          <Cross2Icon
            onClick={close}
            className="sm:hidden w-6 h-6 ml-auto cursor-pointer"
          />
        </DialogTitle>
        <ScrollArea className="flex-1 flex-col pr-2 scroll-area">
          {messages &&
            messages.map((message, i) => {
              console.log("Message: ", i);
              flag++;
              if (flag < 2) return;
              return (
                <>
                  <ChatBubble key={i} text={message.promptText} isAi={false} />
                  <ChatBubble
                    key={i + 1}
                    text={message.resultText}
                    isAi={true}
                  />
                  {i === messages.length - 1 && (
                    <>
                      <ChatBubble
                        visible={isLoading}
                        key={i + 2}
                        text={input}
                        isAi={false}
                      />
                      <ChatBubble
                        visible={completion.length > 0}
                        key={i + 3}
                        text={completion}
                        isAi={true}
                      />
                    </>
                  )}
                </>
              );
            })}
        </ScrollArea>
        <form
          onSubmit={handleSubmit}
          className="flex w-full pt-2 items-end space-x-2"
        >
          <Input
            onChange={handleInputChange}
            value={isLoading || completion.length > 0 ? "" : input}
            type="text"
            placeholder="Type a message..."
            className="text-foreground"
          />
          <Button disabled={isLoading} type="submit">
            <SendHorizonal />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// eslint-disable-next-line react/prop-types
function ChatBubble({ text, isAi, visible }) {
  visible = visible ?? true;
  return (
    <div
      className={`flex flex-col mb-4 ${isAi ? "items-start" : "items-end"}
    ${!visible && "hidden"}
    `}
    >
      <div className="flex max-w-[90%] items-center">
        <div
          className={`
            ${isAi ? "bg-[#4F4CE5]" : "bg-gray-500"}
        rounded-lg py-2 px-4`}
        >
          <p className="text-white leading-relaxed break-words whitespace-pre-wrap">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
