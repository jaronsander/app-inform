import type { Message } from "ai/react";

export function ChatMessageBubble(props: { message: Message, aiEmoji?: string, sources?: any[] }) {
  const colorClassName =
    props.message.role === "user" ? "bg-sky-600" : "bg-slate-50 text-black";
  const alignmentClassName =
    "px-auto";
  const prefix = props.message.role === "user" ? "" : props.aiEmoji;
  return (
    <div
      className={props.message.role === 'user' ? "border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white mb-3": "border border-green-300 px-4 py-2 rounded-md bg-green-800 text-white mb-3"}
    >
      <div className="mr-2">
        {prefix}
      </div>
      <div className="whitespace-pre-wrap flex flex-col">
        <span>{props.message.content}</span>
      </div>
    </div>
  );
}