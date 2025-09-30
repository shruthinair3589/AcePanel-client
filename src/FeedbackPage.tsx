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
  Award,
  CheckCircle2,
  XCircle,
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

const getQualifiedText = (qualified: string) => {
  if (qualified === "1") return "Qualified";
  if (qualified === "0") return "Not Qualified";
  return "Not Evaluated";
};

const FeedbackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://127.0.0.1:8000/interview/${id}`)
      .then((res) => {
        setInterview(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Loading interview...</p>;
  if (!interview) return <p className="p-6 text-red-600">Interview not found.</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Interview Details</h1>

      {/* Candidate Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-center gap-4 mb-2">
          <User size={20} />{" "}
          <span className="font-medium text-lg">{interview.candidate_name}</span>
        </div>
        <p className="text-gray-600 mb-1">
          <strong>Email:</strong> {interview.candidate_email}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Technology assessed:</strong> {interview.technology.join(", ")}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Scheduled:</strong>{" "}
          {format(new Date(interview.scheduled_at), "PPpp")}
        </p>
      </div>

      {/* Evaluation Highlights */}
      {(interview.score !== undefined || interview.qualified !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Score */}
          {interview.score !== undefined && (
            <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center">
              <Award size={32} className="text-indigo-600 mb-2" />
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-3xl font-bold text-gray-800">
                {interview.score}/100
              </p>
            </div>
          )}

          {/* Qualification */}
          {interview.qualified !== undefined && (
            <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center text-center">
              {interview.qualified === "1" ? (
                <CheckCircle2 size={32} className="text-green-600 mb-2" />
              ) : interview.qualified === "0" ? (
                <XCircle size={32} className="text-red-600 mb-2" />
              ) : (
                <FileText size={32} className="text-gray-400 mb-2" />
              )}
              <p className="text-sm text-gray-500">AI Evaluation</p>
              <p
                className={`text-xl font-semibold ${
                  interview.qualified === "1"
                    ? "text-green-600"
                    : interview.qualified === "0"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {getQualifiedText(interview.qualified)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ Feedback Section (with Markdown-style parsing restored) */}
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
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {elements}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* Video / Download Links */}
      <div className="flex gap-4 mt-6">
        {interview.transcript && (
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
