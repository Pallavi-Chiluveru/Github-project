import exp from "express";
import { RepositoryModel } from "../models/RepositoryModel.js";
import { CollaborationModel } from "../models/CollaborationModel.js"; 
import { verifyToken } from "../middleware/verifyToken.js";

export const repoApp = exp.Router();

/* CREATE REPOSITORY */
repoApp.post("/createRepo", verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic, gitignore, license } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Repository name required" });
    }

    const existing = await RepositoryModel.findOne({
      name,
      owner: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    const repo = new RepositoryModel({
      name,
      description,
      isPrivate: !isPublic,
      owner: req.user.id,
      gitignore: gitignore || "None",
      license: license || "None",
    });

    await repo.save();
    res.status(201).json({ message: "Repository created successfully", repo });
  } catch (err) {
    console.error("REPO CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating repository on server", error: err.message });
  }
});

/* IMPORT REPOSITORY */
repoApp.post("/import", verifyToken, async (req, res) => {
  try {
    const { sourceUrl, repoName, isPrivate, username, password } = req.body;

    if (!sourceUrl || !repoName) {
      return res.status(400).json({ message: "Source URL and Repository name are required" });
    }

    const existing = await RepositoryModel.findOne({
      name: repoName,
      owner: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: "Repository already exists" });
    }

    const repo = new RepositoryModel({
      name: repoName,
      isPrivate: isPrivate,
      owner: req.user.id,
      gitRemoteUrl: sourceUrl,
      gitProvider: sourceUrl.includes("github.com") ? "github" : "none",
    });

    await repo.save();

    res.status(201).json({ 
      message: "Repository imported successfully", 
      repo 
    });
  } catch (err) {
    console.error("REPO IMPORT ERROR:", err);
    res.status(500).json({ message: "Error importing repository", error: err.message });
  }
});


/* GET ALL REPOS (OWNER + COLLABORATOR) */
repoApp.get("/user", verifyToken, async (req, res) => {
  try {
    const repos = await RepositoryModel.find({
      $or: [
        { owner: req.user.id },
        { collaborators: req.user.id },
        { viewers: req.user.id },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(repos);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error occurred",
      error: err.message,
    });
  }
});


/* GET SINGLE REPOSITORY */
repoApp.get("/:id", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.id)
      .populate("owner", "username email profileImageUrl")
      .populate("collaborators", "username email profileImageUrl")
      .populate("viewers", "username email profileImageUrl");

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const isCollaborator = (repo.collaborators || []).some(
      (user) => user._id.toString() === req.user.id
    );
    const isViewer = (repo.viewers || []).some(
      (user) => user._id.toString() === req.user.id
    );

    if (
      repo.owner._id.toString() !== req.user.id &&
      !isCollaborator &&
      !isViewer
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(repo);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error occurred",
      error: err.message,
    });
  }
});


/* UPDATE REPOSITORY (OWNER ONLY) */
repoApp.put("/:id", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only owner can update" });
    }

    const { name, description, isPrivate, gitRemoteUrl } = req.body;

    if (name) repo.name = name;
    if (description) repo.description = description;
    if (isPrivate !== undefined) repo.isPrivate = isPrivate;
    if (gitRemoteUrl !== undefined) {
      repo.gitRemoteUrl = gitRemoteUrl;
      repo.gitProvider = gitRemoteUrl?.includes("github.com") ? "github" : "none";
    }

    await repo.save();

    res.status(200).json({
      message: "Repository updated",
      repo,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* DELETE REPOSITORY (OWNER ONLY) */
repoApp.delete("/:id", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await repo.deleteOne();

    res.status(200).json({ message: "Repository deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "error occurred",
      error: err.message,
    });
  }
});


/* REMOVE COLLABORATOR (OWNER ONLY) */
repoApp.delete("/:repoId/collaborator/:userId", verifyToken, async (req, res) => {
  try {
    const { repoId, userId } = req.params;

    const repo = await RepositoryModel.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // prevent removing owner
    if (repo.owner.toString() === userId) {
      return res.status(400).json({ message: "Cannot remove owner" });
    }

    // remove collaborator
    repo.collaborators = (repo.collaborators || []).filter(
      (id) => id.toString() !== userId
    );
    repo.viewers = (repo.viewers || []).filter(
      (id) => id.toString() !== userId
    );

    await repo.save();

    // update collaboration record
    await CollaborationModel.findOneAndUpdate(
      { repoId, userId },
      { status: "removed" }
    );

    res.status(200).json({ message: "Collaborator removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

repoApp.get("/:id/git", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.id);
    if (!repo) return res.status(404).json({ message: "Repository not found" });

    const hasAccess =
      repo.owner.toString() === req.user.id ||
      (repo.collaborators || []).some((id) => id.toString() === req.user.id) ||
      (repo.viewers || []).some((id) => id.toString() === req.user.id);

    if (!hasAccess) return res.status(403).json({ message: "Access denied" });

    const match = (repo.gitRemoteUrl || "").match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
    if (!match) {
      return res.status(200).json({
        provider: repo.gitProvider,
        remoteUrl: repo.gitRemoteUrl,
        message: "No GitHub remote configured",
      });
    }

    const owner = match[1];
    const name = match[2];
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}`);
    const data = await response.json();

    res.status(response.ok ? 200 : response.status).json({
      provider: "github",
      remoteUrl: repo.gitRemoteUrl,
      defaultBranch: data.default_branch,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
