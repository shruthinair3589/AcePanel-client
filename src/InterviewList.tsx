import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { User, Calendar, PlayCircle, FileText, Download } from "lucide-react";
import { statusBadgeColors } from "./RecruiterDashboard";

interface Interview {
  id: number;
  candidate_id: number;
  candidate_name: string;
  scheduled_at: string;
  status: string;
  call_id?: string;
  feedback?: string;
  score?: number;
  transcript?: string;
  video_url?: string;
}

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<{ upcoming: Interview[]; past: Interview[] }>({
    upcoming: [],
    past: [],
  });
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get-all-interviews")
      .then((res) => setInterviews(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filterInterviews = (arr: Interview[]) =>
    arr.filter(
      (i) =>
        i.candidate_name.toLowerCase().includes(filterName.toLowerCase()) &&
        (filterStatus === "All" || i.status === filterStatus)
    );

  const statusOptions = ["All", "Scheduled", "Completed", "Cancelled"];

  const StatusBadge = ({ status }: { status: string }) => (
    <span
      className={`px-3 py-1 text-xs rounded-full font-medium ${
        statusBadgeColors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );

  const renderInterviewCard = (i: Interview) => (
    <div
      key={i.id}
      className="rounded-xl border shadow-sm hover:shadow-md transition-all p-5 bg-white cursor-pointer"
      onClick={() => navigate(`/reports/${i.id}`)}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 font-medium text-gray-800">
          <User size={18} /> {i.candidate_name}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={i.status} />
          {isToday(new Date(i.scheduled_at)) && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-yellow-500 text-white font-semibold">
              Starts Today
            </span>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Scheduled:</strong> {format(new Date(i.scheduled_at), "PPpp")}
      </p>
      {i.score !== undefined && (
        <p className="text-sm text-gray-600">
          <strong>Score:</strong> {i.score}
        </p>
      )}
      <div className="flex gap-3 mt-4">
        {i.feedback && (
          <span className="flex items-center gap-1 text-indigo-600 text-sm">
            <FileText size={16} /> Feedback available
          </span>
        )}
        {i.video_url && (
          <span className="flex items-center gap-1 text-indigo-600 text-sm">
            <PlayCircle size={16} /> Video available
          </span>
        )}
        {i.transcript && (
          <span className="flex items-center gap-1 text-indigo-600 text-sm">
            <Download size={16} /> Transcript available
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Interview Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-10 gap-4">
        <input
          type="text"
          placeholder="Search by candidate name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 hover:bg-indigo-50 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Upcoming Interviews */}
      {(filterStatus === "All" || filterStatus === "Scheduled" || filterStatus === "Cancelled") && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
            <Calendar className="w-5 h-5" /> Upcoming Interviews
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterInterviews(interviews.upcoming).length
              ? filterInterviews(interviews.upcoming).map(renderInterviewCard)
              : <p className="text-gray-500">No upcoming interviews</p>}
          </div>
        </section>
      )}

      {/* Past Interviews */}
      {(filterStatus === "All" || filterStatus === "Completed" || filterStatus === "Cancelled") && (
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-indigo-700">
            <Calendar className="w-5 h-5" /> Past Interviews
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterInterviews(interviews.past).length
              ? filterInterviews(interviews.past).map(renderInterviewCard)
              : <p className="text-gray-500">No past interviews</p>}
          </div>
        </section>
      )}
    </div>
  );
};

export default InterviewList;
