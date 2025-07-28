import { useEffect, useState, ChangeEvent } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { withCredentials: true });

type ChatMessage = {
  message: string;
  sender?: {
    name?: string;
  };
};

export default function RealTimeChat({ projectId }: { projectId: string }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.emit("join_room", projectId);

    socket.on("receive_message", (data: ChatMessage) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId]); // ✅ include dependency

  const sendMessage = () => {
    if (!message) return;
    const data = { room: projectId, message };
    socket.emit("send_message", data);
    setChat((prev) => [...prev, { message }]);
    setMessage("");
  };

  return (
    <div>
      <div className="h-64 overflow-y-scroll border p-2 rounded">
        {chat.map((m, i) => (
          <p key={i}>{m.sender?.name ?? "User"}: {m.message}</p>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          className="border p-2 flex-1"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
          placeholder="Type here..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
