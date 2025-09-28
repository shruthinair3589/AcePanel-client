import React, { useRef, useState } from "react";
import AssistantSpeechIndicator from "./AssistantSpeechIndicator";
import VolumeLevel from "./VolumeLevel";
import Chatbox from "./Chatbox";
import CameraFeed from "../CameraRecorder";

const ActiveCallDetails = ({
  assistantIsSpeaking,
  volumeLevel,
  endCallCallback,
  callId,
  setCallLoading,
  transcripts = [],
}) => {
  const cameraRecorderRef = useRef(null);

  // Transcript state (dummy data, later replace with live API/WebSocket updates)
  // const [transcript, setTranscript] = useState([
  //   { id: 1, sender: "agent", text: "Welcome to the interview, please introduce yourself." },
  //   { id: 2, sender: "candidate", text: "Sure, I am Henry Bard, a technical support specialist." },
  // ]);

  const handleEndCall = () => {
    if (cameraRecorderRef.current && cameraRecorderRef.current.stopRecording) {
      cameraRecorderRef.current.stopRecording();
    }
    setCallLoading(true);
    endCallCallback();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-6xl mx-auto">
      {/* Call Info */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
      </div>

      {/* Main Content: Chatbox + Transcript */}
      <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chatbox */}
       

        {/* Transcript Panel */}
        <div className="h-[26rem] rounded-xl border border-gray-700 bg-gray-800 flex flex-col">
          <div className="p-3 border-b border-gray-700 bg-gray-700 text-sm font-semibold text-gray-100">
            🎤 Transcript
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm">
                        {transcripts.length > 0 ? (
              transcripts.map((line, idx) => (
                <div
                  key={idx}
                  className={`max-w-[85%] px-4 py-2 rounded-2xl shadow-md break-words ${
                    line.role === "assistant"
                      ? "mr-auto bg-blue-600 text-white rounded-bl-none"
                      : "ml-auto bg-teal-600 text-white rounded-br-none"
                  }`}
                >
                  <span className="block text-xs text-gray-200 mb-1">
                    {line.role === "assistant" ? "Assistant" : "Candidate"}
                  </span>
                  {line.text}
                </div>
              ))
            ) : (
              <p className="text-gray-400">Transcript will appear here...</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <CameraFeed ref={cameraRecorderRef} />
        </div>
      </div>

      {/* Camera Feed */}
     

      {/* End Call Button */}
      <div className="w-full mt-10 flex justify-center">
        <button
          className="w-1/2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-2xl py-3 px-12 rounded-3xl shadow-lg transition-all duration-300 hover:scale-105"
          onClick={handleEndCall}
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default ActiveCallDetails;
