import { Router } from "express";
import { userNameController } from "../controllers/username.controller";

export const usernameRoute = Router();

usernameRoute.post("/user", userNameController.createUsername);
usernameRoute.delete("/user/:username", userNameController.deleteUser);
