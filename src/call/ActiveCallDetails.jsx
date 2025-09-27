import React, { useRef } from "react";
import AssistantSpeechIndicator from "./AssistantSpeechIndicator";
import VolumeLevel from "./VolumeLevel";
import Chatbox from "./Chatbox";
import CameraFeed from "../CameraRecorder";

const ActiveCallDetails = ({
  assistantIsSpeaking,
  volumeLevel,
  endCallCallback,
  callId,
  setCallLoading
}) => {
   const cameraRecorderRef = useRef(null);
  const handleEndCall = () => {
     if (cameraRecorderRef.current && cameraRecorderRef.current.stopRecording) {
      cameraRecorderRef.current.stopRecording();
    }
    setCallLoading(true);
    endCallCallback();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto">
      {/* Call Info */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between w-full">
        <AssistantSpeechIndicator isSpeaking={assistantIsSpeaking} />
        <VolumeLevel volume={volumeLevel} />
      </div>

      {/* Chatbox */}
      <div className="w-full mt-6">
        <Chatbox callId={callId} />
      </div>

      {/* Camera Feed */}
      <div className="w-full mt-6">
        <CameraFeed ref={cameraRecorderRef}  />
      </div>

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
