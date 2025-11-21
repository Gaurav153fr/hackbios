"use client";
import React, { useState, useRef, useEffect } from "react";
// Assuming you'll replace getAssistantResponse with a streaming version
// The actual import path and function name will depend on your server-side implementation.
import { getAssistantResponse } from "@/lib/chat"; 
import { MessageCircle } from "lucide-react"; 

const Chatbox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "assistant"; text: string }[]>([
    { sender: "assistant", text: "Hello! I'm your market intelligence assistant. Ask me about import/export trends, market data, or global trade news." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  // --- START: STREAMING IMPLEMENTATION ---
  
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessageText = input;
    // 1. Add the user message and an empty assistant message placeholder
    setMessages((prev) => [
      ...prev, 
      { sender: "user", text: userMessageText },
      { sender: "assistant", text: "" } // Placeholder for streaming
    ]);
    
    setInput("");
    setLoading(true);

    try {
      // 2. Call the new streaming API function
      // This function should return a ReadableStream or similar object/iterator.
      const responseStream = await getAssistantResponse(userMessageText, );
      
      if (typeof responseStream === 'string') {
        // Handle the server-side error message gracefully
        setMessages((prev) => [
            ...prev, 
            { sender: "assistant", text: responseStream } // Display the error message
        ]);
        setLoading(false);
        return; // Exit the function gracefully
    }
      const reader = responseStream.getReader();
    
      // 3. Read the stream chunk by chunk
      while (true) {
                const { done, value } = await reader.read();
                if (done) break;
        
                const chunk = typeof value === 'string' ? value : new TextDecoder().decode(value); 
        
                // 4. ***REFINED UPDATE LOGIC***
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessageIndex = newMessages.length - 1;
                   // Append the new chunk to the existing text of the last message
                  newMessages[lastMessageIndex].text += chunk; 
                  return newMessages;
                });
        scrollToBottom(); 
         }
      
    } catch (err) {
      console.error("Streaming error:", err);
      // Update the last message (the placeholder) with the error
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.sender === 'assistant') {
             lastMessage.text = lastMessage.text.length > 0 
                 ? lastMessage.text + "\n\n[Stream Interrupted: Error]" 
                 : "Error getting response.";
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };
  
  // --- END: STREAMING IMPLEMENTATION ---

  // ... (The rest of the return block is the same)
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
                // Use a dynamic class to allow messages to wrap correctly
                className={`p-2 rounded-md max-w-[85%] ${
                  msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100 mr-auto"
                }`}
              >
                {/* Add a blinking cursor while streaming */}
                {msg.text || (loading && msg.sender === 'assistant' && idx === messages.length - 1 ? '❚' : '')}
              </div>
            ))}
            {/* Loading indicator that scrolls */}
            {loading && (
              <div className="text-gray-500 text-sm italic">Assistant is typing...</div>
            )}
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
              disabled={loading} // Disable input while streaming
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading || !input.trim()} // Disable send button while streaming or if input is empty
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