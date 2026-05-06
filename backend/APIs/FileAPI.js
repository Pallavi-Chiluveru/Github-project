import exp from "express";
import fs from "fs";
import path from "path";

import { upload } from "../utils/multer.js";
import { RepoFileModel } from "../models/RepoFileModel.js";
import { RepositoryModel } from "../models/RepositoryModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudStorage.js";

export const fileApp = exp.Router();

const hasReadAccess = (repo, userId) => {
  return (
    repo.owner.toString() === userId ||
    (repo.collaborators || []).some((id) => id.toString() === userId) ||
    (repo.viewers || []).some((id) => id.toString() === userId)
  );
};

const hasWriteAccess = (repo, userId) => {
  return (
    repo.owner.toString() === userId ||
    (repo.collaborators || []).some((id) => id.toString() === userId)
  );
};

fileApp.post("/:repoId/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (!hasWriteAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can upload files" });
    }

    const cloudFile = await uploadToCloudinary(req.file);

    const file = await RepoFileModel.create({
      repoId: repo._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      storageProvider: cloudFile ? "cloudinary" : "local",
      cloudUrl: cloudFile?.url || "",
      cloudPublicId: cloudFile?.publicId || "",
      cloudResourceType: cloudFile?.resourceType || "",
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      message: "File uploaded",
      file,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

fileApp.get("/:repoId/files", verifyToken, async (req, res) => {
  try {
    const repo = await RepositoryModel.findById(req.params.repoId);

    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    if (!hasReadAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const files = await RepoFileModel.find({
      repoId: req.params.repoId,
    }).select("originalName filename mimeType size createdAt storageProvider cloudUrl");

    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

fileApp.get("/download/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await RepoFileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const repo = await RepositoryModel.findById(file.repoId);
    if (!hasReadAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (file.cloudUrl) {
      const cloudResponse = await fetch(file.cloudUrl);
      if (!cloudResponse.ok) {
        return res.status(502).json({ message: "Unable to download from Cloudinary" });
      }

      const buffer = Buffer.from(await cloudResponse.arrayBuffer());
      res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${file.originalName}"`);
      return res.send(buffer);
    }

    return res.download(path.resolve(file.filePath), file.originalName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

fileApp.get("/content/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await RepoFileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const repo = await RepositoryModel.findById(file.repoId);
    if (!hasReadAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!file.mimeType?.startsWith("text/") && !file.originalName.match(/\.(js|jsx|json|css|html|md|txt)$/i)) {
      return res.status(400).json({ message: "Only text files can be edited" });
    }

    let content;
    if (file.cloudUrl) {
      const cloudResponse = await fetch(file.cloudUrl);
      if (!cloudResponse.ok) {
        return res.status(502).json({ message: "Unable to read from Cloudinary" });
      }
      content = await cloudResponse.text();
    } else {
      content = fs.readFileSync(file.filePath, "utf8");
    }

    res.status(200).json({
      file,
      content,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

fileApp.put("/content/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await RepoFileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const repo = await RepositoryModel.findById(file.repoId);
    if (!hasWriteAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can edit files" });
    }

    const content = req.body.content || "";
    fs.writeFileSync(file.filePath, content, "utf8");
    file.size = Buffer.byteLength(content);

    const cloudFile = await uploadToCloudinary({
      path: file.filePath,
      mimetype: file.mimeType || "text/plain",
      originalname: file.originalName,
    });

    if (cloudFile) {
      file.storageProvider = "cloudinary";
      file.cloudUrl = cloudFile.url;
      file.cloudPublicId = cloudFile.publicId;
      file.cloudResourceType = cloudFile.resourceType;
    }

    await file.save();

    res.status(200).json({ message: "File updated", file });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

fileApp.delete("/:fileId", verifyToken, async (req, res) => {
  try {
    const file = await RepoFileModel.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const repo = await RepositoryModel.findById(file.repoId);

    if (!hasWriteAccess(repo, req.user.id)) {
      return res.status(403).json({ message: "Only owner and collaborators can delete files" });
    }

    await deleteFromCloudinary(file);

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await file.deleteOne();

    res.status(200).json({ message: "File deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
