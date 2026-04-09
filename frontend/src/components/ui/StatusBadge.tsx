import { ApplicationStatus } from "../../types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Phone Screen": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface Props {
  status: ApplicationStatus;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: Props) => {
  return (
    <span
      className={`tag border ${STATUS_STYLES[status]} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
