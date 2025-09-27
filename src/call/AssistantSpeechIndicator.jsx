const AssistantSpeechIndicator = ({ isSpeaking }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 shadow-md">
      <div
        className={`w-4 h-4 rounded-full ${
          isSpeaking ? "bg-green-400 animate-pulse" : "bg-red-500"
        }`}
      ></div>
      <p
        className={`font-medium ${
          isSpeaking ? "text-green-400" : "text-red-400"
        }`}
      >
        {isSpeaking ? "Assistant Speaking" : "Assistant Not Speaking"}
      </p>
    </div>
  );
};

export default AssistantSpeechIndicator;
