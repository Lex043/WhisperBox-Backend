import { Request, Response } from "express";
import { db } from "../lib/drizzle";
import { asc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { textsTable, usersTable } from "../db/schema";
import logger from "../utils/logger";

export const contentController = {
    getContents: async (req: Request, res: Response) => {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json({
                    success: false,
                    message: "Username is required",
                });
            }

            const page = Number(req.query.page) || 1;
            const limit = Math.min(Number(req.query.limit) || 10, 50);
            const offset = (page - 1) * limit;

            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

            if (user.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const contents = await db
                .select()
                .from(textsTable)
                .where(eq(textsTable.userId, user[0].id))
                .orderBy(asc(textsTable.id))
                .limit(limit)
                .offset(offset);

            return res.status(200).json({
                success: true,
                data: contents,
                meta: { page, limit },
            });
        } catch (error) {
            logger.error({ err: error });
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    },

    postContent: async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            const { content } = req.body;
            if (!content || !username) {
                return res.status(400).json({
                    success: false,
                    message: "Content and username are required",
                });
            }
            const user = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, username))
                .limit(1);

            if (user.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const [text] = await db
                .insert(textsTable)
                .values({ content, userId: user[0].id })
                .returning();
            return res.status(201).json({
                success: true,
                message: "Whisper created successfully",
                data: text,
            });
        } catch (error) {
            logger.error({ err: error });
            return res
                .status(500)
                .json({ success: false, message: "Server error" });
        }
    },
    deleteContent: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Content id is required",
                });
            }
            const result = await db
                .delete(textsTable)
                .where(eq(textsTable.id, Number(id)));

            if (result.rowCount === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "Content not found" });
            }

            return res
                .status(200)
                .json({ success: true, message: "User Deleted successfully" });
        } catch (error) {
            logger.error({ err: error });
            return res
                .status(500)
                .json({ success: false, message: "Server error" });
        }
    },
};
