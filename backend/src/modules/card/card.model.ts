import { baseColumns, images } from "@/db/models";
import { pgTable, uuid, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { groups } from "../index";

const cardStatusEnum = pgEnum("card_status", [
    "To Learn",
    "Repeated",
    "Know",
    "Learned",
]);

const cards = pgTable("Cards", {
    ...baseColumns,
    word: varchar("word", { length: 60 }).notNull(),
    translateWord: varchar("translate_word", { length: 100 }).notNull(),
    groupId: uuid("group_id")
        .notNull()
        .references(() => groups.id),
    imageId: uuid("image_id").references(() => images.id),
    status: cardStatusEnum("status").notNull().default("To Learn"),
    definition: text("definition").notNull().default(""),
    example: text("example").notNull().default(""),
    learnedAt: timestamp("learned_at", { withTimezone: true }),
    nextReviewAt: timestamp("next_review_at", { withTimezone: true }),
    reviewCount: integer("review_count").notNull().default(0),
    senseId: integer("sense_id")
});

type Card = typeof cards.$inferSelect;
type NewCard = typeof cards.$inferInsert;
type CardStatusEnum = typeof cardStatusEnum.enumValues[number];

export {
    type CardStatusEnum,
    cardStatusEnum,
    cards,
    type Card,
    type NewCard
}