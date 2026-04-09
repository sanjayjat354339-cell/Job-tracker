import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, DollarSign, GripVertical } from "lucide-react";
import { Application } from "../../types";
import { format } from "date-fns";

interface Props {
  application: Application;
  onClick: (app: Application) => void;
}

const ApplicationCard = ({ application, onClick }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-surface-800 border border-white/8 rounded-xl p-3.5 cursor-pointer hover:border-white/20 transition-all duration-150 ${
        isDragging ? "opacity-50 shadow-2xl scale-105" : ""
      }`}
      onClick={() => onClick(application)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{application.company}</p>
          <p className="text-xs text-white/50 truncate mt-0.5">
            {application.role}
          </p>
        </div>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing transition-colors p-0.5 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100"
        >
          <GripVertical size={14} />
        </div>
      </div>

      {/* Skills row */}
      {application.requiredSkills.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {application.requiredSkills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="tag bg-surface-900 text-white/40 border border-white/8 text-[10px]"
            >
              {skill}
            </span>
          ))}
          {application.requiredSkills.length > 3 && (
            <span className="tag bg-surface-900 text-white/30 border border-white/8 text-[10px]">
              +{application.requiredSkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/6">
        <span className="text-[11px] text-white/30 font-mono">
          {format(new Date(application.dateApplied), "MMM d")}
        </span>
        <div className="flex items-center gap-2 text-[11px] text-white/30">
          {application.location && (
            <span className="flex items-center gap-0.5">
              <MapPin size={10} />
              {application.location.split(",")[0]}
            </span>
          )}
          {application.salaryRange && (
            <span className="flex items-center gap-0.5">
              <DollarSign size={10} />
              {application.salaryRange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
