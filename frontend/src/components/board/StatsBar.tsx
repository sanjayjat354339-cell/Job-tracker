import { Application, ApplicationStatus } from "../../types";

const STATUS_ORDER: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

const COLORS: Record<ApplicationStatus, string> = {
  Applied: "text-blue-400",
  "Phone Screen": "text-purple-400",
  Interview: "text-amber-400",
  Offer: "text-emerald-400",
  Rejected: "text-red-400",
};

interface Props {
  applications: Application[];
}

const StatsBar = ({ applications }: Props) => {
  const total = applications.length;

  const counts = STATUS_ORDER.reduce<Record<string, number>>((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {});

  const responseRate =
    total > 0
      ? Math.round(
          ((counts["Phone Screen"] +
            counts["Interview"] +
            counts["Offer"]) /
            total) *
            100
        )
      : 0;

  return (
    <div className="flex items-center gap-6 px-6 py-3 border-b border-white/6 text-sm text-white/50 overflow-x-auto shrink-0">
      <div>
        <span className="text-white font-semibold">{total}</span>
        <span className="ml-1.5">total</span>
      </div>

      <div className="w-px h-4 bg-white/10" />

      {STATUS_ORDER.map((s) => (
        <div key={s} className="flex items-center gap-1.5 shrink-0">
          <span className={`font-semibold ${COLORS[s]}`}>{counts[s]}</span>
          <span>{s}</span>
        </div>
      ))}

      <div className="w-px h-4 bg-white/10" />

      <div>
        <span className="text-white font-semibold">{responseRate}%</span>
        <span className="ml-1.5">response rate</span>
      </div>
    </div>
  );
};

export default StatsBar;
