import { Card } from "./Card";
import { Group } from "./Group";
import { User } from "./User";
import { Streak } from "./Streak";
import { Result } from "./Result/Result";
import { ResultMode } from "./Result/ResultMode";
import { WordResult } from "./Result/WordResult";
import { SharedGroup } from "./SharedGroup/SharedGroup";
import { SharedCard } from "./SharedGroup/SharedCard";
import { SharedCardLikes } from "./SharedGroup/SharedCardLikes";
import { Image } from "./Image";

// User - Group
User.hasMany(Group, { foreignKey: "userId", as: "groups" });
Group.belongsTo(User, { foreignKey: "userId", as: "user" });

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
	Image
};
