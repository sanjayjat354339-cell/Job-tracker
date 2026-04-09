import { Request, Response } from "express";
import { Application } from "../models/Application";
import { ApplicationStatus } from "../types";

export const getApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applications = await Application.find({
      userId: req.user?.userId,
    }).sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getApplicationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.json({ application });
  } catch (error) {
    console.error("Get application error:", error);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

export const createApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      company,
      role,
      status,
      jdLink,
      notes,
      dateApplied,
      salaryRange,
      requiredSkills,
      niceToHaveSkills,
      seniority,
      location,
      resumeSuggestions,
    } = req.body;

    if (!company || !role) {
      res.status(400).json({ message: "Company and role are required" });
      return;
    }

    const application = await Application.create({
      userId: req.user?.userId,
      company,
      role,
      status: status || "Applied",
      jdLink,
      notes,
      dateApplied: dateApplied || new Date(),
      salaryRange,
      requiredSkills: requiredSkills || [],
      niceToHaveSkills: niceToHaveSkills || [],
      seniority,
      location,
      resumeSuggestions: resumeSuggestions || [],
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ message: "Failed to create application" });
  }
};

export const updateApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.json({ application });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body as { status: ApplicationStatus };

    const validStatuses: ApplicationStatus[] = [
      "Applied",
      "Phone Screen",
      "Interview",
      "Offer",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.userId },
      { status },
      { new: true }
    );

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.json({ application });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const deleteApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.userId,
    });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
};
