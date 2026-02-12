import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 255 }).notNull().unique(),
});

export const textsTable = pgTable("texts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    content: varchar({ length: 500 }).notNull(),
});
