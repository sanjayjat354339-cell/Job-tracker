import api from "./api";
import {
  Application,
  ApplicationStatus,
  CreateApplicationPayload,
} from "../types";

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const { data } = await api.get<{ applications: Application[] }>(
      "/applications"
    );
    return data.applications;
  },

  async getById(id: string): Promise<Application> {
    const { data } = await api.get<{ application: Application }>(
      `/applications/${id}`
    );
    return data.application;
  },

  async create(payload: CreateApplicationPayload): Promise<Application> {
    const { data } = await api.post<{ application: Application }>(
      "/applications",
      payload
    );
    return data.application;
  },

  async update(
    id: string,
    payload: Partial<CreateApplicationPayload>
  ): Promise<Application> {
    const { data } = await api.put<{ application: Application }>(
      `/applications/${id}`,
      payload
    );
    return data.application;
  },

  async updateStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<Application> {
    const { data } = await api.patch<{ application: Application }>(
      `/applications/${id}/status`,
      { status }
    );
    return data.application;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};
