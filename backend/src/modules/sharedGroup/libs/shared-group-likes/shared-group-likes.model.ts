import { pgTable, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "@/db/models/base.model";
import { sharedGroups } from "../../index";
import { users } from "../../../index";

const sharedGroupLikes = pgTable("SharedCardLike", {
    ...baseColumns,
    sharedGroupId: uuid("shared_group_id")
        .notNull()
        .references(() => sharedGroups.id),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id),
});

type SharedGroupLike = typeof sharedGroupLikes.$inferSelect;
type NewSharedGroupLike = typeof sharedGroupLikes.$inferInsert;

export { sharedGroupLikes, type SharedGroupLike, type NewSharedGroupLike };