// components/Chatbot.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const INITIAL_BOT_MESSAGE: Message = {
  id: "0",
  text: "Hi there! How can I help with your shopping today?",
  sender: "bot",
  timestamp: new Date(),
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .map(
          (msg) =>
            `${msg.sender === "user" ? "Customer" : "Assistant"}: ${msg.text}`
        )
        .join("\n");

      // Call API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a helpful e-commerce assistant for a store that sells clothing and accessories.
            Be concise and friendly. Provide specific information about products, shipping, returns, and payment methods.
            Current shipping policy: Free shipping on orders over $50. Standard delivery takes 3-5 business days.
            Return policy: Returns accepted within 30 days with receipt. Items must be unused with original packaging.
            Payment methods: All major credit cards, PayPal, and crypto (BTC, ETH, SOL).
            If asked about specific products, suggest checking the catalog or ask for more details.`,
            },
            {
              role: "user",
              content: `Previous conversation:\n${conversationHistory}\n\nCustomer: ${input}\n\nAssistant:`,
            },
          ],
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const botResponse =
        data.choices[0]?.message?.content?.trim() ||
        "Sorry, I'm having trouble connecting to my knowledge base. Please try again.";

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling OpenAI API:", error);

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick response suggestions based on context
  const getQuickResponses = () => {
    const lastBotMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "bot");

    // Default quick responses
    let quickResponses = [
      { id: "shipping", text: "Shipping information" },
      { id: "returns", text: "Return policy" },
      { id: "payment", text: "Payment methods" },
    ];

    // Context-aware suggestions
    if (lastBotMessage) {
      const text = lastBotMessage.text.toLowerCase();

      if (text.includes("product") || text.includes("looking for")) {
        quickResponses = [
          { id: "tshirts", text: "T-shirts" },
          { id: "jeans", text: "Jeans" },
          { id: "accessories", text: "Accessories" },
        ];
      } else if (text.includes("payment") || text.includes("pay")) {
        quickResponses = [
          { id: "crypto", text: "Crypto payment" },
          { id: "creditcard", text: "Credit card" },
          { id: "paypal", text: "PayPal" },
        ];
      }
    }

    return quickResponses;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Customer Support</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick responses */}
          <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
            {getQuickResponses().map((item) => (
              <button
                key={item.id}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                onClick={() => {
                  setInput(item.text);
                  // Auto-send after a brief delay
                  setTimeout(() => {
                    setInput(item.text);
                    handleSend();
                  }, 100);
                }}
                disabled={isLoading}
              >
                {item.text}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              className={`${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded-r-lg`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
