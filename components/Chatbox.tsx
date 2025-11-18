"use client";
import React, { useState, useRef, useEffect } from "react";
import { getAssistantResponse } from "@/lib/chat";
import { LucideIcon, MessageCircle } from "lucide-react"; // Optional: use lucide icons

const Chatbox = () => {
  const [open, setOpen] = useState(false); // side panel open/close
  const [messages, setMessages] = useState<{ sender: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);

    try {
      const response = await getAssistantResponse(userMessage);
      setMessages((prev) => [...prev, { sender: "assistant", text: response }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "assistant", text: "Error getting response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating assistant button */}
      <button
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        onClick={() => setOpen(!open)}
        title="Open Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Side panel */}
      {open && (
        <div className="fixed top-0 right-0 h-full w-[350px] bg-white shadow-lg z-50 flex flex-col border-l border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Assistant</h2>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  msg.sender === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
