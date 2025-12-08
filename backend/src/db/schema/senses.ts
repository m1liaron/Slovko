import { serial, integer, text } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

import { headwords } from "./headwords";
import { partOfSpeechEnum } from "./part_of_speech";

export const senses = pgEnum("senses", {
  id: serial("id").primaryKey(),
  headwordId: integer("headword_id")
    .references(() => headwords.id, { onDelete: "cascade" })
    .notNull(),
  pos: integer("part_of_speech_id")
    .references(() => partOfSpeechEnum.id, { onDelete: "cascade " })
    .notNull(),
  phrase: text("phrase").notNull(),
  meaning: text("meaning").notNull(),
});
