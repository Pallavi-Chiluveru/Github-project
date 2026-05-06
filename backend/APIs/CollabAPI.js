import exp from "express";
import { CollaborationModel } from "../models/CollaborationModel.js";
import { RepositoryModel } from "../models/RepositoryModel.js";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const collabApp = exp.Router();


/* SEND INVITE */
collabApp.post("/invite/:repoId", verifyToken, async (req, res) => {
  try {
    const { email, role = "collaborator" } = req.body;
    const repoId = req.params.repoId;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const repo = await RepositoryModel.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    // only owner can invite
    if (repo.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!["collaborator", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const isCollaborator = (repo.collaborators || []).some(
      (id) => id.toString() === user._id.toString()
    );
    const isViewer = (repo.viewers || []).some(
      (id) => id.toString() === user._id.toString()
    );

    if (isCollaborator || isViewer) {
      return res.status(400).json({ message: "User already has access" });
    }

    // already invited?
    const existing = await CollaborationModel.findOne({
      repoId,
      userId: user._id,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Invite already sent" });
    }

    const invite = new CollaborationModel({
      repoId,
      userId: user._id,
      invitedBy: req.user.id,
      role,
    });

    await invite.save();

    res.status(201).json({ message: "Invite sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* GET MY INVITES */
collabApp.get("/my-invites", verifyToken, async (req, res) => {
  try {
    const invites = await CollaborationModel.find({
      userId: req.user.id,
      status: "pending",
    }).populate("repoId", "name");

    res.status(200).json(invites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ACCEPT INVITE */
collabApp.post("/accept/:id", verifyToken, async (req, res) => {
  try {
    const invite = await CollaborationModel.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    invite.status = "accepted";
    await invite.save();

    const repo = await RepositoryModel.findById(invite.repoId);

    const isAlready = (repo.collaborators || []).some(
      (id) => id.toString() === req.user.id
    );

    if (invite.role === "viewer") {
      const isViewer = (repo.viewers || []).some((id) => id.toString() === req.user.id);
      repo.viewers = repo.viewers || [];
      if (!isViewer) repo.viewers.push(req.user.id);
    } else if (!isAlready) {
      repo.collaborators = repo.collaborators || [];
      repo.collaborators.push(req.user.id);
    }
    await repo.save();

    res.status(200).json({ message: "Invite accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* REJECT INVITE */
collabApp.post("/reject/:id", verifyToken, async (req, res) => {
  try {
    const invite = await CollaborationModel.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    invite.status = "rejected";
    await invite.save();

    res.status(200).json({ message: "Invite rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* LEAVE REPOSITORY (COLLABORATOR ONLY) */
collabApp.delete("/leave/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await RepositoryModel.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    // owner cannot leave
    if (repo.owner.toString() === req.user.id) {
      return res.status(400).json({ message: "Owner cannot leave repo" });
    }

    const isCollaborator = (repo.collaborators || []).some(
      (id) => id.toString() === req.user.id
    );
    const isViewer = (repo.viewers || []).some(
      (id) => id.toString() === req.user.id
    );

    if (!isCollaborator && !isViewer) {
      return res.status(400).json({ message: "You do not have repository access" });
    }

    // remove from collaborators
    repo.collaborators = (repo.collaborators || []).filter(
      (id) => id.toString() !== req.user.id
    );
    repo.viewers = (repo.viewers || []).filter(
      (id) => id.toString() !== req.user.id
    );

    await repo.save();

    // update collaboration status
    await CollaborationModel.findOneAndUpdate(
      { repoId, userId: req.user.id },
      { status: "removed" }
    );

    res.status(200).json({ message: "You left the repository" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET REPO COLLABORATORS */
collabApp.get("/repo/:repoId", verifyToken, async (req, res) => {
  try {
    const { repoId } = req.params;
    const collabs = await CollaborationModel.find({ repoId })
      .populate("userId", "username email profileImageUrl")
      .populate("invitedBy", "username");
    
    // Map to match frontend expectations
    const result = collabs.map(c => ({
      ...c.toObject(),
      user: c.userId 
    }));
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
