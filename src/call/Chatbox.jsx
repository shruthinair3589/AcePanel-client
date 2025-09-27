import { useState } from "react";


const Chatbox = ({ callId }) => {
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async () => {
    if (!code.trim()) return;
    
    console.log("code ==>", code)
    // Optimistically add to local messages
    setMessages((prev) => [...prev, { role: "user", text: code }]);

    // Send to backend → which relays to Vapi
    const res = await fetch("/submit-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_id: callId, code }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", text: data.response?.reply || "Analyzing..." }]);

    setCode("");
  };

  return (
    <div className="chatbox-container" >
      <div className="messages-container">
        {messages.map((m, i) => (
          <p key={i} className={m.role}>
            <b>{m.role === "user" ? "You" : "Assistant"}:</b> {m.text}
          </p>
        ))}
      </div>
        {/* <Editor
        height="300px"
        width="100%" 
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
      />
      <button onClick={handleSubmit} style={{background: "#e64a19"}}>Submit Code</button> */}
    </div>
  );
};

export default Chatbox;
