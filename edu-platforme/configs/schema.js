import { pgTable, serial, varchar, boolean, json, integer, text, timestamp, unique } from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable('user', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull(),
    clerkId: varchar(),
    isMember: boolean().default(false),
    creditsUsed: integer().default(0),
    stripeCustomerId: varchar(),
    stripeSubscriptionId: varchar(),
    subscriptionStatus: varchar().default('free'),
    subscriptionTier: varchar().default('Free'),
    subscriptionCurrentPeriodEnd: timestamp(),
    createdAt: timestamp().defaultNow()
}, (table) => ({
    // Définir les contraintes uniques avec des noms spécifiques
    emailUnique: unique("user_email_unique").on(table.email),
    clerkIdUnique: unique("user_clerkId_unique").on(table.clerkId),
}))

export const STUDY_TABLE = pgTable('study', {
    id : serial().primaryKey(),
    courseId : varchar().notNull(),
    courseType : varchar().notNull(),
    topic : varchar().notNull(),
    difficultyLevel : varchar().default('Easy'),
    courseLayout : json(),
    createdBy : varchar().notNull(),
    status : varchar().default('Generating'),
    createdAt: timestamp().defaultNow()
}, (table) => ({
    // Contrainte unique sur courseId si nécessaire
    courseIdUnique: unique("study_courseId_unique").on(table.courseId),
}))

export const CHAPTER_NOTES_TABLE = pgTable('chapterNotes', {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    chapterId: integer().notNull(),
    notes: text(),
    createdAt: timestamp().defaultNow()
})

export const STUDY_TYPE_CONTENT_TABLE = pgTable('studyTypeContent', {
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    content: json(),
    type: varchar().notNull(),
    status: varchar().default('Generating'),
    createdAt: timestamp().defaultNow()
})