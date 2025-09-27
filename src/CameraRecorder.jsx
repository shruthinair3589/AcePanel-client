import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
const  CameraRecorder = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
      startRecording();
      return () => {
          if (stream) {
              stream.getTracks().forEach(track => track.stop());
          }
      };
  }, []);

  const startRecording = () => {
    console.log("Start recording ==>")
    if (!stream) return;
    setRecordedChunks([]);
    const options = { mimeType: "video/webm; codecs=vp9" };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(100); // collect data in 100ms chunks
    setRecording(true);
  };
 

 const stopRecording = () => {
  console.log("Stop recording ==>");
  console.log("mediaRecorderRef.current ==>", mediaRecorderRef.current);
  if (!mediaRecorderRef.current) return;

  // Make sure to capture the chunks at this moment
  const chunks = [...recordedChunks];

  // Set the onstop BEFORE calling stop
  mediaRecorderRef.current.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    if (blob.size === 0) {
      console.error("No data recorded!");
      return;
    }

    const url = URL.createObjectURL(blob);
    console.log("Recording URL:", url);

    // Automatically download
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded_video.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // // Optional: send to backend
    // const formData = new FormData();
    // formData.append("file", blob, "recorded_video.webm");
    // fetch("http://localhost:8000/save-video", {
    //   method: "POST",
    //   body: formData,
    // }).then(() => console.log("Video uploaded to backend"));
  };

  mediaRecorderRef.current.stop();
  setRecording(false);
};


  useImperativeHandle(ref, () => ({
    stopRecording,
  }));


  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg border border-gray-700">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-80 object-cover bg-black"
        />
        <div className="absolute bottom-3 right-3">
          {recording ? (
            <span className="text-xs px-3 py-1 rounded-full bg-red-600 text-white font-semibold shadow-md animate-pulse">
              ● Recording
            </span>
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-600 text-white font-semibold shadow-md">
              Stopped
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
export default CameraRecorder;
