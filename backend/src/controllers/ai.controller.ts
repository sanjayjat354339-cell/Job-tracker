import { Request, Response } from "express";
import {
  parseJobDescription,
  generateResumeSuggestions,
} from "../services/openai.service";

export const parseJD = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body as { jobDescription: string };

    if (!jobDescription || jobDescription.trim().length < 50) {
      res.status(400).json({
        message: "Job description must be at least 50 characters",
      });
      return;
    }

    const parsedData = await parseJobDescription(jobDescription);
    const suggestions = await generateResumeSuggestions(
      parsedData,
      jobDescription
    );

    res.json({ parsedData, suggestions });
  } catch (error) {
    console.error("AI parse error:", error);

    if (error instanceof Error && error.message.includes("API key")) {
      res.status(503).json({ message: "AI service not configured" });
      return;
    }

    res.status(500).json({ message: "Failed to parse job description" });
  }
};
