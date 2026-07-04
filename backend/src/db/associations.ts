import { relations } from "drizzle-orm";

import {
    users,
    sections,
    groups,
    cards,
    results,
    resultModes,
    wordResults,
    sharedGroups,
    languages,
    sharedGroupLikes
} from "@/modules/index";
import { streaks } from "./models";

// User - Section
const usersRelations = relations(users, ({ many }) => ({
    sections: many(sections),
    sharedGroups: many(sharedGroups),
    streakDates: many(streaks),
    results: many(results)
}));

const sectionRelations = relations(sections, ({ one, many }) => ({
    user: one(users, { fields: [sections.userId], references: [users.id] }),
    language: one(languages, { fields: [sections.languageId], references: [languages.id]})
}))

// Section - Language
const languagesRelations = relations(languages, ({ many }) => ({
    sections: many(languages)
}));

// Section - Group
const groupRelations = relations(groups, ({ one, many }) => ({
    section: one(sections, { fields: [groups.sectionId], references: [sections.id] }),
    cards: many(cards)
}));

// Group - Card
const cardsRelations = relations(cards, ({ one }) => ({
    group: one(groups, { fields: [cards.groupId], references: [groups.id] }),
}));

// User - SharedGroup
const sharedGroupsRelations = relations(sharedGroups, ({ one, many }) => ({
    user: one(users, { fields: [sharedGroups.userId], references: [users.id] }),
    sharedGroups: many(sharedGroups),
}));

// User - Streak
const streaksRelations = relations(streaks, ({ one }) => ({
    user: one(users, { fields: [streaks.userId], references: [users.id] }),
}));

// User - Result
const resultsRelations = relations(results, ({ one, many }) => ({
    user: one(users, { fields: [results.userId], references: [users.id] }),
    mode: many(resultModes),
}));

// Result - ResultMode
const resultModesRelations = relations(resultModes, ({ one, many }) => ({
    result: one(results, { fields: [resultModes.resultId], references: [results.id] }),
    words: many(wordResults),
}));

// ResultMode - WordResult
const wordResultsRelations = relations(wordResults, ({ one }) => ({
    resultMode: one(resultModes, { fields: [wordResults.resultModeId], references: [resultModes.id] }),
}));

// SharedGroup - SharedCard
const sharedCardsRelations = relations(sharedGroups, ({ one, many }) => ({
    sharedGroup: one(sharedGroups, { fields: [sharedGroups.userId], references: [sharedGroups.id] }),
    likes: many(sharedGroupLikes),
}));

// SharedCard - SharedCardLikes
const sharedGroupLikesRelations = relations(sharedGroupLikes, ({ one }) => ({
    sharedGroup: one(sharedGroups, { fields: [sharedGroupLikes.sharedGroupId], references: [sharedGroups.id] }),
}));

export {
    usersRelations,
    sectionRelations,
    groupRelations,
    cardsRelations,
    sharedGroupsRelations,
    streaksRelations,
    resultsRelations,
    resultModesRelations,
    wordResultsRelations,
    sharedCardsRelations,
    sharedGroupLikesRelations
};
