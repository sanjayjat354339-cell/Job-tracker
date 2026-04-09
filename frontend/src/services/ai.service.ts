import api from "./api";
import { ParseResponse } from "../types";

export const aiService = {
  async parseJobDescription(jobDescription: string): Promise<ParseResponse> {
    const { data } = await api.post<ParseResponse>("/ai/parse", {
      jobDescription,
    });
    return data;
  },
};
