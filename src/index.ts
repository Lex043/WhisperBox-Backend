import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { usernameRoute } from "./routes/username.route";
import { contentRoute } from "./routes/content.route";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
    res.status(200).json({ message: "API is healthy.." });
});

app.use("/api/v1", usernameRoute);
app.use("/api/v1", contentRoute);

app.listen(PORT, () => {
    console.log(`Speak lord, your server is listening on port ${PORT}`);
});
