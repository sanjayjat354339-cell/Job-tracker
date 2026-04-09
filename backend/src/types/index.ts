export type ApplicationStatus =
  | "Applied"
  | "Phone Screen"
  | "Interview"
  | "Offer"
  | "Rejected";

export interface ParsedJobData {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface ResumeSuggestion {
  id: string;
  text: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

// Extend express Request
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
