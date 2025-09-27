import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hi! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setInput(""); // clear input

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: data.answer, sender: "bot" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "⚠️ Error fetching response",
          sender: "bot",
        },
      ]);
    }
  };
  const handleClearChat = () => {
    setMessages([{ id: Date.now(), text: "👋 Hi! How can I help you today?", sender: "bot" }]);
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center z-50 w-1/2"
            
          >
            {/* Chat Container */}
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-3xl h-[36rem] flex flex-col rounded-2xl shadow-2xl overflow-hidden
                         bg-gray-900 border border-gray-700 text-white"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white flex justify-between items-center">
                <h2 className="font-semibold text-lg">💬 Live Chat</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearChat}
                    className="bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-sm font-medium"
                  >
                    Clear
                  </button>
                   <button
                    onClick={() => setOpen(false)}
                    className="bg-gray-600 hover:bg-gray-700 rounded-full p-1 text-lg text-black font-bold"
                  >
                    ✖
                  </button>
                </div>
                {/* <button
                  onClick={() => setOpen(false)}
                  className="bg-grey-600 hover:bg-grey-700 rounded-full p-1 text-lg text-black font-bold"
                >
                  ✖
                </button> */}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
                {messages.map((msg) => (
                   <div
                      key={msg.id}
                      style={{background: 'white', color: 'black', marginTop: "10px", width: 'fit-content', padding: '10px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}
                      className={`relative max-w-[75%] px-4 py-2 rounded-2xl shadow-md break-words ${
                        msg.sender === "user"
                          ? "ml-auto bg-green-500 text-white rounded-br-none"
                          : "mr-auto bg-gray-800 text-gray-200 rounded-bl-none"
                      }`}
                    >
                    {msg.text}
                    <span
                      className={`absolute bottom-0 w-3 h-3 bg-inherit transform rotate-45 ${
                        msg.sender === "user"
                          ? "-right-1 rounded-br-none"
                          : "-left-1 rounded-bl-none"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 text-sm rounded-full border  text-white placeholder-white-400 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full outline-none bg-black"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-full hover:scale-105 transition shadow-md"
                >
                  ➤
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-teal-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl"
          >
            💬
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
