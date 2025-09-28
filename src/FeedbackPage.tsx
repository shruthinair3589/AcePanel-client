import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import {
    User,
    Calendar,
    FileText,
    PlayCircle,
    Download,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface Interview {
    id: number;
    candidate_name: string;
    candidate_email: string;
    technology: string[];
    scheduled_at: string;
    status: string;
    score?: number;
    feedback?: string;
    transcript?: string;
    video_url?: string;
    qualified?: string;
}

interface ChatEntry {
    role: "assistant" | "user";
    text: string;
}
const getQualifiedText = (qualified: string) => {
    if (qualified === "1") return "Qualified";
    if (qualified === "0") return "Not Qualified";
    return "Not Evaluated";
}
const FeedbackPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [chat, setChat] = useState<ChatEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(true);

    useEffect(() => {
        if (!id) return;
        axios
            .get(`http://127.0.0.1:8000/interview/${id}`)
            .then((res) => {
                setInterview(res.data);

                // const transcriptLines = res.data.transcript?.split("\n").filter(Boolean) || [];
                // const chatEntries: ChatEntry[] = transcriptLines.reduce((acc: ChatEntry[], line: string) => {
                //   const aiIndicators = [
                //     "Hello,", "Thank you,", "Understood,", "Certainly,", "Let's", "Sorry,", "Proceed", "We'll",
                //   ];
                //   const isAssistant = aiIndicators.some((ind) => line.startsWith(ind)) || line.includes("AI");
                //   const role: "assistant" | "user" = isAssistant ? "assistant" : "user";

                //   const lastEntry = acc[acc.length - 1];
                //   if (lastEntry && lastEntry.role === role) {
                //     lastEntry.text += " " + line;
                //   } else {
                //     acc.push({ role, text: line });
                //   }

                //   return acc;
                // }, []);
                // setChat(chatEntries);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="p-6 text-gray-600">Loading interview...</p>;
    if (!interview) return <p className="p-6 text-red-600">Interview not found.</p>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Interview Details</h1>

            {/* Candidate Info */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <User size={20} /> <span className="font-medium">{interview.candidate_name}</span>
                </div>
                <p className="text-gray-600 mb-1"><strong>Email:</strong> {interview.candidate_email}</p>
                <p className="text-gray-600 mb-1"><strong>Technology assessed:</strong> {interview.technology.join(", ")}</p>
                <p className="text-gray-600 mb-1"><strong>Scheduled:</strong> {format(new Date(interview.scheduled_at), "PPpp")}</p>
                {interview.score !== undefined && <p className="text-gray-600 mb-1"><strong>Score:</strong> {interview.score}</p>}
                {interview.qualified !== undefined && (
                    <p className="text-gray-600 mb-1">
                        <strong>AI Evaluation:</strong> {getQualifiedText(interview.qualified)}
                    </p>
                )}
            </div>

            {/* Feedback Section */}
            {interview.feedback && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Feedback</h2>
                    <div className="bg-white p-6 rounded-xl shadow space-y-2">
                        {interview.feedback.split("\n").map((line, idx) => {
                            const elements: React.ReactNode[] = [];

                            let remaining = line;
                            let match;
                            const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/; // matches **bold** or *italic*

                            while ((match = remaining.match(regex))) {
                                const [fullMatch, , boldText, , italicText] = match;
                                const index = match.index || 0;

                                if (index > 0) {
                                    elements.push(remaining.slice(0, index));
                                }

                                if (boldText) {
                                    elements.push(<strong key={elements.length}>{boldText}</strong>);
                                } else if (italicText) {
                                    elements.push(<em key={elements.length}>{italicText}</em>);
                                }

                                remaining = remaining.slice(index + fullMatch.length);
                            }

                            if (remaining) elements.push(remaining);

                            return (
                                <p key={idx} className="text-gray-700">
                                    {elements}
                                </p>
                            );
                        })}
                    </div>
                </div>
            )}


            {/* Transcript Section
      {chat.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="flex items-center gap-2 text-indigo-600 font-medium mb-3"
          >
            {isTranscriptOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {isTranscriptOpen ? "Hide Transcript" : "Show Transcript"}
          </button>

          {isTranscriptOpen && (
            <div className="bg-white p-6 rounded-xl shadow max-h-[600px] overflow-y-auto space-y-3">
              {chat.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    entry.role === "assistant" ? "bg-indigo-50 ml-auto" : "bg-gray-100"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1">
                    {entry.role === "assistant" ? "AI Voice Agent" : interview.candidate_name}
                  </p>
                  <p className="text-gray-700">{entry.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )} */}

            {/* Video / Download Links */}
            <div className="flex gap-4 mt-6">
                {(
                    <a
                        href={interview.video_url}
                        download
                        className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
                    >
                        <PlayCircle size={16} /> Download Video
                    </a>
                )}
                {interview.transcript && (
                    <a
                        href={interview.transcript}
                        download
                        className="flex items-center gap-1 text-indigo-600 hover:underline text-sm"
                    >
                        <Download size={16} /> Download Transcript
                    </a>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
