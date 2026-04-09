import { useState } from "react";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/board/Navbar";
import StatsBar from "../components/board/StatsBar";
import KanbanBoard from "../components/board/KanbanBoard";
import AddApplicationModal from "../components/board/AddApplicationModal";
import ApplicationDetailModal from "../components/board/ApplicationDetailModal";
import { useApplications } from "../hooks/useApplications";
import { Application } from "../types";

const BoardPage = () => {
  const { data: applications = [], isLoading, isError } = useApplications();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [search, setSearch] = useState("");

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      app.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      <Navbar />

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-white/6 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Search company, role, skill..."
            className="input pl-8 text-sm h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="btn-primary flex items-center gap-1.5 text-sm h-9"
        >
          <Plus size={15} />
          Add Application
        </button>
      </div>

      {/* Stats */}
      {applications.length > 0 && <StatsBar applications={applications} />}

      {/* Board content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={20} className="animate-spin text-white/30" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <AlertCircle size={20} className="text-red-400" />
            <p className="text-white/50 text-sm">
              Failed to load applications. Is the backend running?
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center">
              <Plus size={20} className="text-brand-400" />
            </div>
            <div className="text-center">
              <p className="font-medium">No applications yet</p>
              <p className="text-white/40 text-sm mt-1">
                Add your first application to get started
              </p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="btn-primary text-sm mt-1"
            >
              Add your first application
            </button>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pt-5">
            <KanbanBoard
              applications={filtered}
              onCardClick={setSelectedApp}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddApplicationModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <ApplicationDetailModal
        application={selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default BoardPage;
