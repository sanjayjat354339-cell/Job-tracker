import { useState, FormEvent } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Modal from "../ui/Modal";
import { useCreateApplication } from "../../hooks/useApplications";
import { aiService } from "../../services/ai.service";
import { ApplicationStatus, ParsedJobData, ResumeSuggestion } from "../../types";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STATUSES: ApplicationStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
];

const AddApplicationModal = ({ isOpen, onClose }: Props) => {
  const { mutate: createApplication, isPending } = useCreateApplication();

  // Form fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [jdLink, setJdLink] = useState("");
  const [notes, setNotes] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [dateApplied, setDateApplied] = useState(
    new Date().toISOString().split("T")[0]
  );

  // AI section
  const [jdText, setJdText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);
  const [suggestions, setSuggestions] = useState<ResumeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [niceSkills, setNiceSkills] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const resetForm = () => {
    setCompany("");
    setRole("");
    setStatus("Applied");
    setJdLink("");
    setNotes("");
    setSalaryRange("");
    setDateApplied(new Date().toISOString().split("T")[0]);
    setJdText("");
    setParsedData(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSkills([]);
    setNiceSkills([]);
    setSelectedSuggestions([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleParseJD = async () => {
    if (jdText.trim().length < 50) {
      toast.error("Paste a longer job description (min 50 chars)");
      return;
    }

    setAiLoading(true);
    try {
      const result = await aiService.parseJobDescription(jdText);
      const { parsedData: pd, suggestions: sg } = result;

      setParsedData(pd);
      setSuggestions(sg);
      setShowSuggestions(true);

      // Auto-fill form fields from AI
      if (!company && pd.company && pd.company !== "Unknown") {
        setCompany(pd.company);
      }
      if (!role && pd.role) {
        setRole(pd.role);
      }

      setSelectedSkills(pd.requiredSkills);
      setNiceSkills(pd.niceToHaveSkills);
      toast.success("JD parsed successfully!");
    } catch {
      toast.error("AI parse failed — check your API key or try again");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleSkill = (skill: string, type: "required" | "nice") => {
    if (type === "required") {
      setSelectedSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    } else {
      setNiceSkills((prev) =>
        prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
      );
    }
  };

  const toggleSuggestion = (text: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(text) ? prev.filter((s) => s !== text) : [...prev, text]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !role.trim()) {
      toast.error("Company and role are required");
      return;
    }

    createApplication(
      {
        company: company.trim(),
        role: role.trim(),
        status,
        jdLink: jdLink.trim() || undefined,
        notes: notes.trim() || undefined,
        salaryRange: salaryRange.trim() || undefined,
        dateApplied,
        requiredSkills: selectedSkills,
        niceToHaveSkills: niceSkills,
        seniority: parsedData?.seniority,
        location: parsedData?.location,
        resumeSuggestions: selectedSuggestions,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Application" size="xl">
      <div className="p-5 space-y-6">
        {/* AI JD Parser */}
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} className="text-brand-400" />
            <span className="text-sm font-medium text-brand-300">
              AI Job Description Parser
            </span>
            <span className="tag bg-brand-500/10 text-brand-400 border border-brand-500/20 ml-auto">
              Optional
            </span>
          </div>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here and let AI extract skills, auto-fill fields, and generate resume bullet points..."
            rows={4}
            className="input resize-none text-sm"
          />

          <button
            type="button"
            onClick={handleParseJD}
            disabled={aiLoading || jdText.trim().length < 50}
            className="btn-primary mt-3 flex items-center gap-2 text-sm"
          >
            {aiLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            {aiLoading ? "Parsing..." : "Parse with AI"}
          </button>

          {/* Parsed skills */}
          {parsedData && (
            <div className="mt-4 space-y-3 animate-slide-up">
              <div>
                <p className="text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {parsedData.requiredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill, "required")}
                      className={`tag border transition-colors ${
                        selectedSkills.includes(skill)
                          ? "bg-brand-500/20 text-brand-300 border-brand-500/40"
                          : "bg-surface-800 text-white/50 border-white/10"
                      }`}
                    >
                      {selectedSkills.includes(skill) ? "✓ " : ""}
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {parsedData.niceToHaveSkills.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-1.5 font-medium uppercase tracking-wider">
                    Nice to Have
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedData.niceToHaveSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill, "nice")}
                        className={`tag border transition-colors ${
                          niceSkills.includes(skill)
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                            : "bg-surface-800 text-white/50 border-white/10"
                        }`}
                      >
                        {niceSkills.includes(skill) ? "✓ " : ""}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume suggestions toggle */}
              {suggestions.length > 0 && (
                <div className="border-t border-white/8 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSuggestions((v) => !v)}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {showSuggestions ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                    Resume bullet suggestions ({suggestions.length})
                  </button>

                  {showSuggestions && (
                    <div className="mt-2 space-y-2 animate-slide-up">
                      <p className="text-xs text-white/40">
                        Click to select bullets to save with this application
                      </p>
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSuggestion(s.text)}
                          className={`w-full text-left text-sm px-3 py-2.5 rounded-lg border transition-colors ${
                            selectedSuggestions.includes(s.text)
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                              : "bg-surface-800 border-white/8 text-white/70 hover:border-white/20"
                          }`}
                        >
                          {selectedSuggestions.includes(s.text) && (
                            <span className="mr-1.5">✓</span>
                          )}
                          {s.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main form */}
        <form id="add-app-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                className="input"
                placeholder="Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Role *</label>
              <input
                type="text"
                className="input"
                placeholder="Software Engineer"
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
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Date Applied</label>
              <input
                type="date"
                className="input"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Referral contact, interview tips, anything useful..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8 bg-surface-900/50 shrink-0">
        <button type="button" onClick={handleClose} className="btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          form="add-app-form"
          disabled={isPending}
          className="btn-primary flex items-center gap-2"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? "Adding..." : "Add Application"}
        </button>
      </div>
    </Modal>
  );
};

export default AddApplicationModal;
