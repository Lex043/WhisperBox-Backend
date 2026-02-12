import { Router } from "express";
import { userNameController } from "../controllers/username.controller";

export const usernameRoute = Router();

usernameRoute.post("/", userNameController.createUsername);
usernameRoute.delete("/users/:username", userNameController.deleteUser);
