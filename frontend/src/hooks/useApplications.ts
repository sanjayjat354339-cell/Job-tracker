import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../services/application.service";
import {
  Application,
  ApplicationStatus,
  CreateApplicationPayload,
} from "../types";
import toast from "react-hot-toast";

export const APPLICATIONS_KEY = ["applications"];

export const useApplications = () => {
  return useQuery({
    queryKey: APPLICATIONS_KEY,
    queryFn: applicationService.getAll,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateApplicationPayload) =>
      applicationService.create(payload),
    onSuccess: (newApp) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) => [
        newApp,
        ...old,
      ]);
      toast.success("Application added!");
    },
    onError: () => {
      toast.error("Failed to create application");
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateApplicationPayload>;
    }) => applicationService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.map((app) => (app._id === updated._id ? updated : app))
      );
      toast.success("Application updated!");
    },
    onError: () => {
      toast.error("Failed to update application");
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.map((app) => (app._id === updated._id ? updated : app))
      );
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Application[]>(APPLICATIONS_KEY, (old = []) =>
        old.filter((app) => app._id !== id)
      );
      toast.success("Application deleted");
    },
    onError: () => {
      toast.error("Failed to delete application");
    },
  });
};
