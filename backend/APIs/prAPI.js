import exp from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { PullRequestModel } from "../models/PullRequestModel.js";
import { CommitModel } from "../models/CommitModel.js";
import { RepositoryModel } from "../models/RepositoryModel.js";
import { ReviewCommentModel } from "../models/ReviewCommentModel.js";
import { notifyUsers } from "../utils/notifications.js";

export const prApp = exp.Router();

/* ---------------- ACCESS CHECK ---------------- */
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

/* ---------------- CREATE PULL REQUEST ---------------- */
prApp.post("/:repoId/create", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const { title, description, fromCommitId } = req.body;

    if (!title || !fromCommitId) {
      return res.status(400).json({
        message: "title and fromCommitId required",
      });
    }

    const repo = await RepositoryModel.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (!canWrite(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can open pull requests" });
    }

    const commit = await CommitModel.findById(fromCommitId);
    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    const pr = await PullRequestModel.create({
      repoId,
      title,
      description,
      fromCommit: fromCommitId,
      createdBy: req.user.id,
      status: "open",
    });

    notifyUsers([repo.owner, ...(repo.collaborators || [])], {
      type: "pr",
      message: `New pull request: ${title}`,
      repoId,
    });

    res.status(201).json({
      message: "Pull request created",
      pr,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET ALL PRs ---------------- */
prApp.get("/:repoId", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (!hasAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "No access" });
    }

    const prs = await PullRequestModel.find({
      repoId: req.params.repoId,
    })
      .populate("createdBy", "username email")
      .populate("fromCommit")
      .sort({ createdAt: -1 });

    res.status(200).json(prs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- GET SINGLE PR ---------------- */
prApp.get("/detail/:prId", verifyToken, async (req, res) => {
  try {
    const pr = await PullRequestModel.findById(req.params.prId)
      .populate("createdBy", "username email")
      .populate("fromCommit");

    if (!pr) {
      return res.status(404).json({ message: "Pull request not found" });
    }

    const repo = await RepositoryModel.findById(pr.repoId);

    if (!hasAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "No access" });
    }

    res.status(200).json(pr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- MERGE PR ---------------- */
prApp.post("/merge/:prId", verifyToken, async (req, res) => {
  try {
    const pr = await PullRequestModel.findById(req.params.prId);

    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }

    const repo = await RepositoryModel.findById(pr.repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can merge PR" });
    }

    if (pr.status !== "open") {
      return res.status(400).json({ message: "PR already processed" });
    }

    pr.status = "merged";
    await pr.save();

    notifyUsers([pr.createdBy, ...(repo.collaborators || [])], {
      type: "pr",
      message: `Pull request merged: ${pr.title}`,
      repoId: repo._id,
    });

    res.status(200).json({
      message: "Pull request merged (simulation)",
      pr,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- REJECT PR ---------------- */
prApp.post("/reject/:prId", verifyToken, async (req, res) => {
  try {
    const pr = await PullRequestModel.findById(req.params.prId);

    if (!pr) {
      return res.status(404).json({ message: "PR not found" });
    }

    const repo = await RepositoryModel.findById(pr.repoId);

    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can reject PR" });
    }

    pr.status = "rejected";
    await pr.save();

    notifyUsers([pr.createdBy, ...(repo.collaborators || [])], {
      type: "pr",
      message: `Pull request rejected: ${pr.title}`,
      repoId: repo._id,
    });

    res.status(200).json({
      message: "Pull request rejected",
      pr,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- REVIEW COMMENTS ---------------- */
prApp.get("/:prId/comments", verifyToken, async (req, res) => {
  try {
    const pr = await PullRequestModel.findById(req.params.prId);
    if (!pr) return res.status(404).json({ message: "Pull request not found" });

    const repo = await RepositoryModel.findById(pr.repoId);
    if (!hasAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "No access" });
    }

    const comments = await ReviewCommentModel.find({ prId: req.params.prId })
      .populate("createdBy", "username email profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

prApp.post("/:prId/comments", verifyToken, async (req, res) => {
  try {
    const { fileName, lineNumber, comment } = req.body;
    const pr = await PullRequestModel.findById(req.params.prId);
    if (!pr) return res.status(404).json({ message: "Pull request not found" });

    const repo = await RepositoryModel.findById(pr.repoId);
    if (!canWrite(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can comment on reviews" });
    }

    const reviewComment = await ReviewCommentModel.create({
      prId: pr._id,
      fileName,
      lineNumber,
      comment,
      createdBy: req.user.id,
    });

    notifyUsers([pr.createdBy, repo.owner, ...(repo.collaborators || [])], {
      type: "comment",
      message: `New review comment on line ${lineNumber}`,
      repoId: repo._id,
    });

    res.status(201).json({ message: "Review comment added", comment: reviewComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
