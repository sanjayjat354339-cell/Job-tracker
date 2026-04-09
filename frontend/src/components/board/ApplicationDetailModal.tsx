import { useState, FormEvent, useEffect } from "react";
import {
  Loader2,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  Layers,
} from "lucide-react";
import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import {
  useUpdateApplication,
  useDeleteApplication,
} from "../../hooks/useApplications";
import { Application, ApplicationStatus } from "../../types";
import { format } from "date-fns";

interface Props {
  application: Application | null;
  onClose: () => void;
}

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

const ApplicationDetailModal = ({ application, onClose }: Props) => {
  const { mutate: updateApp, isPending: updating } = useUpdateApplication();
  const { mutate: deleteApp, isPending: deleting } = useDeleteApplication();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Editable state
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [notes, setNotes] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jdLink, setJdLink] = useState("");

  useEffect(() => {
    if (application) {
      setCompany(application.company);
      setRole(application.role);
      setStatus(application.status);
      setNotes(application.notes || "");
      setSalaryRange(application.salaryRange || "");
      setJdLink(application.jdLink || "");
      setEditing(false);
      setConfirmDelete(false);
    }
  }, [application]);

  if (!application) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateApp(
      {
        id: application._id,
        payload: {
          company,
          role,
          status,
          notes: notes || undefined,
          salaryRange: salaryRange || undefined,
          jdLink: jdLink || undefined,
        },
      },
      {
        onSuccess: () => {
          setEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteApp(application._id, { onSuccess: onClose });
  };

  return (
    <Modal
      isOpen={!!application}
      onClose={onClose}
      title={editing ? "Edit Application" : "Application Details"}
      size="lg"
    >
      <div className="p-5">
        {editing ? (
          <form
            id="edit-app-form"
            onSubmit={handleSave}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  className="input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">Role</label>
                <input
                  type="text"
                  className="input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  className="input"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ApplicationStatus)
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Salary Range</label>
                <input
                  type="text"
                  className="input"
                  placeholder="8–12 LPA"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label">JD Link</label>
              <input
                type="url"
                className="input"
                placeholder="https://..."
                value={jdLink}
                onChange={(e) => setJdLink(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                className="input resize-none"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>
        ) : (
          <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">{application.company}</h3>
                <p className="text-white/60 mt-0.5">{application.role}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {format(new Date(application.dateApplied), "MMM d, yyyy")}
              </span>
              {application.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {application.location}
                </span>
              )}
              {application.salaryRange && (
                <span className="flex items-center gap-1.5">
                  <DollarSign size={13} />
                  {application.salaryRange}
                </span>
              )}
              {application.seniority && (
                <span className="flex items-center gap-1.5">
                  <Layers size={13} />
                  {application.seniority}
                </span>
              )}
            </div>

            {/* JD Link */}
            {application.jdLink && (
              <a
                href={application.jdLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
              >
                <ExternalLink size={13} />
                View Job Description
              </a>
            )}

            {/* Skills */}
            {application.requiredSkills.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {application.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="tag bg-brand-500/10 text-brand-300 border border-brand-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {application.niceToHaveSkills.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Nice to Have
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {application.niceToHaveSkills.map((s) => (
                    <span
                      key={s}
                      className="tag bg-purple-500/10 text-purple-300 border border-purple-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume suggestions */}
            {application.resumeSuggestions.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Resume Bullets
                </p>
                <ul className="space-y-2">
                  {application.resumeSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="text-sm text-white/70 bg-surface-800 px-3 py-2.5 rounded-lg border border-white/8"
                    >
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-medium mb-2">
                  Notes
                </p>
                <p className="text-sm text-white/70 bg-surface-800 px-3 py-2.5 rounded-lg border border-white/8 whitespace-pre-wrap">
                  {application.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-white/8 bg-surface-900/50 shrink-0">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className={`btn-danger flex items-center gap-2 text-sm ${
            confirmDelete ? "bg-red-500/20 border-red-500/40" : ""
          }`}
        >
          {deleting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {confirmDelete ? "Confirm Delete" : "Delete"}
        </button>

        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-app-form"
                disabled={updating}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {updating && <Loader2 size={14} className="animate-spin" />}
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="btn-primary text-sm"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;
