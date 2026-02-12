import { Router } from "express";
import { contentController } from "../controllers/content.controller";

export const contentRoute = Router();

contentRoute.get("/link/:username", contentController.getContents);
contentRoute.post("/link/:username", contentController.postContent);
contentRoute.delete("/:id", contentController.deleteContent);
