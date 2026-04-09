import OpenAI from "openai";
import { ParsedJobData, ResumeSuggestion } from "../types";

const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
};

export const parseJobDescription = async (
  jobDescription: string
): Promise<ParsedJobData> => {
  const client = getOpenAIClient();

  const prompt = `You are a job description parser. Extract structured information from the job description below.

Return ONLY a valid JSON object with these exact fields:
- company: string (company name, or "Unknown" if not found)
- role: string (job title)
- requiredSkills: string[] (must-have technical skills, max 8)
- niceToHaveSkills: string[] (preferred/bonus skills, max 5)
- seniority: string (e.g. "Junior", "Mid-level", "Senior", "Lead", or "Not specified")
- location: string (city/remote/hybrid, or "Not specified")

Job Description:
${jobDescription}`;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.2,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse OpenAI response as JSON");
  }

  // Basic validation
  const data = parsed as Record<string, unknown>;
  const result: ParsedJobData = {
    company: typeof data.company === "string" ? data.company : "Unknown",
    role: typeof data.role === "string" ? data.role : "Unknown Role",
    requiredSkills: Array.isArray(data.requiredSkills)
      ? (data.requiredSkills as string[])
      : [],
    niceToHaveSkills: Array.isArray(data.niceToHaveSkills)
      ? (data.niceToHaveSkills as string[])
      : [],
    seniority:
      typeof data.seniority === "string" ? data.seniority : "Not specified",
    location:
      typeof data.location === "string" ? data.location : "Not specified",
  };

  return result;
};

export const generateResumeSuggestions = async (
  parsedData: ParsedJobData,
  jobDescription: string
): Promise<ResumeSuggestion[]> => {
  const client = getOpenAIClient();

  const prompt = `You are a professional resume writer. Based on this job, write 4 strong resume bullet points a candidate could add to their resume.

Role: ${parsedData.role}
Company: ${parsedData.company}
Required Skills: ${parsedData.requiredSkills.join(", ")}
Seniority: ${parsedData.seniority}

Job Description (excerpt):
${jobDescription.slice(0, 800)}

Return ONLY a valid JSON object with this structure:
{
  "suggestions": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"]
}

Rules:
- Start each bullet with a strong action verb (Built, Led, Developed, Optimized, etc.)
- Include specific technologies from the job requirements
- Make them achievement-oriented with measurable outcomes where possible
- Each bullet should be 1-2 sentences max
- Do NOT use generic phrases like "responsible for" or "worked on"`;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty suggestions");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse suggestions from OpenAI");
  }

  const data = parsed as Record<string, unknown>;
  const suggestions = Array.isArray(data.suggestions)
    ? (data.suggestions as string[])
    : [];

  return suggestions.map((text, idx) => ({
    id: `suggestion-${idx + 1}`,
    text,
  }));
};
