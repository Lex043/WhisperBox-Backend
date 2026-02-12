import { Request, Response } from "express";
import { db } from "../lib/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";
import logger from "../utils/logger";

const generateUsername = (base: string) => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${base}${random}`;
};

export const userNameController = {
    createUsername: async (req: Request, res: Response) => {
        try {
            const { userName } = req.body;
            if (!userName) {
                return res
                    .status(400)
                    .json({ success: false, message: "Username is required" });
            }

            let finalUsername = userName;

            const existingUsername = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.username, userName))
                .limit(1);

            if (existingUsername.length > 0) {
                finalUsername = generateUsername(userName);
            }

            const [user] = await db
                .insert(usersTable)
                .values({ username: finalUsername })
                .returning();

            return res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            logger.error({ err: error });
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const { username } = req.params;
            if (!username) {
                return res
                    .status(400)
                    .json({ success: false, message: "Username is required" });
            }
            const result = await db
                .delete(usersTable)
                .where(eq(usersTable.username, username));

            if (result.rowCount === 0) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }

            return res
                .status(200)
                .json({ success: true, message: "User Deleted successfully" });
        } catch (error) {
            logger.error({ err: error });
            return res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    },
};
