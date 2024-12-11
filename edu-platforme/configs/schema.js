import { pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable('user', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    isMember: boolean().default(false),
})