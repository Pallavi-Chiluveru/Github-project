import exp from "express";
import { IssueModel } from "../models/IssueModel.js";
import { RepositoryModel } from "../models/RepositoryModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const issueApp = exp.Router();

/* ---------------- HELPERS ---------------- */
const hasAccess = (repo, userId) => {
  return (
    repo.owner.toString() === userId ||
    (repo.collaborators || []).some((id) => id.toString() === userId) ||
    (repo.viewers || []).some((id) => id.toString() === userId)
  );
};

const canWrite = (repo, userId) => {
  return (
    repo.owner.toString() === userId ||
    (repo.collaborators || []).some((id) => id.toString() === userId)
  );
};

/* ---------------- CREATE ISSUE ---------------- */
issueApp.post("/:repoId", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const { repoId } = req.params;

    const repo = await RepositoryModel.findById(repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (!canWrite(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can create issues" });
    }

    const issue = await IssueModel.create({
      title,
      description,
      repoId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Issue created",
      issue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET ALL ISSUES OF REPO ---------------- */
issueApp.get("/:repoId", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });
    if (!hasAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const issues = await IssueModel.find({
      repoId: req.params.repoId,
    })
      .populate("createdBy", "username email profileImageUrl")
      .populate("assignedTo", "username email profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET SINGLE ISSUE ---------------- */
issueApp.get("/single/:issueId", verifyToken, async (req, res) => {
  try {
    const issue = await IssueModel.findById(req.params.issueId)
      .populate("createdBy", "username email profileImageUrl")
      .populate("assignedTo", "username email profileImageUrl");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- UPDATE ISSUE ---------------- */
issueApp.put("/:issueId", verifyToken, async (req, res) => {
  try {
    const issue = await IssueModel.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const repo = await RepositoryModel.findById(issue.repoId);
    if (!canWrite(repo, req.user.id) && issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { title, description } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;

    await issue.save();

    res.status(200).json({
      message: "Issue updated",
      issue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- TOGGLE ISSUE STATUS ---------------- */
issueApp.patch("/:issueId/status", verifyToken, async (req, res) => {
  try {
    const issue = await IssueModel.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const repo = await RepositoryModel.findById(issue.repoId);
    if (!canWrite(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can update issues" });
    }

    issue.status = issue.status === "open" ? "closed" : "open";

    await issue.save();

    res.status(200).json({
      message: "Status updated",
      issue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- ASSIGN USER ---------------- */
issueApp.patch(
  "/:issueId/assign/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const issue = await IssueModel.findById(req.params.issueId);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      if (!issue.assignedTo.includes(req.params.userId)) {
        issue.assignedTo.push(req.params.userId);
      }

      await issue.save();

      res.status(200).json({
        message: "User assigned",
        issue,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ---------------- DELETE ISSUE ---------------- */
issueApp.delete("/:issueId", verifyToken, async (req, res) => {
  try {
    const issue = await IssueModel.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const repo = await RepositoryModel.findById(issue.repoId);
    if (!canWrite(repo, req.user.id) && issue.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await issue.deleteOne();

    res.status(200).json({
      message: "Issue deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
