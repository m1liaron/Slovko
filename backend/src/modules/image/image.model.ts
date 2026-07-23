import { pgTable, uuid, text } from "drizzle-orm/pg-core";

const images = pgTable("Images", {
	id: uuid("id").defaultRandom().primaryKey(),
	url: text("url").notNull(),
});

type Image = typeof images.$inferSelect;
type NewImage = typeof images.$inferInsert;

export { images, type Image, type NewImage };