const numBars = 10;

const VolumeLevel = ({ volume }) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-800 shadow-md">
      <div className="flex gap-1 items-end h-8">
        {Array.from({ length: numBars }, (_, i) => (
          <div
            key={i}
            className={`w-1 rounded-sm transition-all duration-200 ${
              i / numBars < volume ? "bg-green-400 h-8" : "bg-gray-600 h-3"
            }`}
          ></div>
        ))}
      </div>
      <span className="text-sm text-gray-300">Volume</span>
    </div>
  );
};

export default VolumeLevel;
