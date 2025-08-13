import { User } from "./User.js";
import { Section } from "./Section.js";
import { Group } from "./Group.js";
import { Card } from "./Card.js";
import { Streak } from "./Streak.js";
import { Result } from "./Result/Result.js";
import { ResultMode } from "./Result/ResultMode.js";
import { WordResult } from "./Result/WordResult.js";
import { SharedGroup } from "./SharedGroup/SharedGroup.js";
import { SharedCard } from "./SharedGroup/SharedCard.js";
import { SharedCardLikes } from "./SharedGroup/SharedCardLikes.js";
import { Image } from "./Image.js";

// User - Section
User.hasMany(Section, { foreignKey: "userId", as: "sections" });
Section.belongsTo(User, { foreignKey: "userId", as: "user" });

// Section - Group
Section.hasMany(Group, { foreignKey: "sectionId", as: "groups" });
Group.belongsTo(Section, { foreignKey: "sectionId", as: "section" });

// User - SharedGroup
User.hasMany(SharedGroup, { foreignKey: "userId", as: "sharedGroups" });
SharedGroup.belongsTo(User, { foreignKey: "userId", as: "user" });

// User - Streak
User.hasMany(Streak, { foreignKey: "userId", as: "streakDates" });
Streak.belongsTo(User, { foreignKey: "userId", as: "user" });

// Group - Card
Group.hasMany(Card, { foreignKey: "groupId", as: "cards" });
Card.belongsTo(Group, { foreignKey: "groupId", as: "group" });

// User - Result
User.hasMany(Result, { foreignKey: "userId", as: "results" });
Result.belongsTo(User, { foreignKey: "userId", as: "user" });

// Result - ResultMode
Result.hasMany(ResultMode, { foreignKey: "resultId", as: "mode" });
ResultMode.belongsTo(Result, { foreignKey: "resultId", as: "result" });

// ResultMode - WordResult
ResultMode.hasMany(WordResult, { foreignKey: "resultModeId", as: "words" });
WordResult.belongsTo(ResultMode, {
  foreignKey: "resultModeId",
  as: "resultMode",
});

// SharedGroup - SharedCard
SharedGroup.hasMany(SharedCard, {
  foreignKey: "sharedGroupId",
  as: "sharedCards",
});
SharedCard.belongsTo(SharedGroup, {
  foreignKey: "sharedGroupId",
  as: "sharedGroup",
});

// SharedCard - SharedCardLikes
SharedCard.hasMany(SharedCardLikes, {
  foreignKey: "sharedGroupId",
  as: "likes",
});
SharedCardLikes.belongsTo(SharedCard, {
  foreignKey: "sharedGroupId",
  as: "sharedCard",
});

export {
  Card,
  User,
  Streak,
  Group,
  Result,
  ResultMode,
  WordResult,
  SharedGroup,
  SharedCard,
  SharedCardLikes,
  Image,
};
