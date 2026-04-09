import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Application, ApplicationStatus } from "../../types";
import ApplicationCard from "./ApplicationCard";

interface Props {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (app: Application) => void;
}

const COLUMN_COLORS: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500",
  "Phone Screen": "bg-purple-500",
  Interview: "bg-amber-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-red-500",
};

const KanbanColumn = ({ status, applications, onCardClick }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col w-64 shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2 h-2 rounded-full ${COLUMN_COLORS[status]}`} />
        <span className="text-sm font-medium text-white/80">{status}</span>
        <span className="ml-auto text-xs text-white/30 font-mono bg-surface-800 px-1.5 py-0.5 rounded-md">
          {applications.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-2 space-y-2 transition-colors duration-150 ${
          isOver
            ? "bg-surface-800/80 ring-1 ring-brand-500/40"
            : "bg-surface-900/30"
        }`}
      >
        <SortableContext
          items={applications.map((a) => a._id)}
          strategy={verticalListSortingStrategy}
        >
          {applications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onClick={onCardClick}
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs text-white/20">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
