import exp from 'express'
import { RepositoryModel } from "../Models/RepositoryModel.js";
import { UserModel } from "../Models/UserModel.js"
export const Repo = exp.Router();
import { verifyToken } from '../Middleware/authMiddleware.js';

Repo.post("/", verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body

    const repo = await RepositoryModel.create({
      name,
      description,
      isPublic,
      owner: req.user.id
    })

    await UserModel.findByIdAndUpdate(req.user.id, {
      $push: { repositories: repo._id }
    })

    res.status(201).json(repo)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
Repo.get("/", verifyToken, async (req, res) => {
  try {
    console.log("Fetching repos for user ID:", req.user.id);
              
    const repos = await RepositoryModel.find({
      owner: req.user.id
    }).populate("owner", "username email");

    console.log(`Found ${repos.length} repos for user ${req.user.id}`);
    res.json(repos);
  } catch (err) {
    console.error("Error fetching repos:", err.message);
    res.status(500).json({ error: err.message });
  }
});
