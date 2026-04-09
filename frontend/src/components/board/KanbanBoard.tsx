import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { Application, ApplicationStatus } from "../../types";
import KanbanColumn from "./KanbanColumn";
import ApplicationCard from "./ApplicationCard";
import { useUpdateStatus } from "../../hooks/useApplications";

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

interface Props {
  applications: Application[];
  onCardClick: (app: Application) => void;
}

const KanbanBoard = ({ applications, onCardClick }: Props) => {
  const { mutate: updateStatus } = useUpdateStatus();
  const [activeApp, setActiveApp] = useState<Application | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = STATUSES.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<ApplicationStatus, Application[]>
  );

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find((a) => a._id === event.active.id);
    if (app) setActiveApp(app);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveApp(null);

    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    // overId is either a status column or another card's id
    const targetStatus = STATUSES.includes(overId as ApplicationStatus)
      ? (overId as ApplicationStatus)
      : applications.find((a) => a._id === overId)?.status;

    const draggedApp = applications.find((a) => a._id === draggedId);

    if (draggedApp && targetStatus && draggedApp.status !== targetStatus) {
      updateStatus({ id: draggedId, status: targetStatus });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 px-6">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            applications={grouped[status]}
            onCardClick={onCardClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp && (
          <div className="opacity-90 rotate-1 shadow-2xl">
            <ApplicationCard
              application={activeApp}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
