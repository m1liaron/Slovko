const Card = require('./Card');
const Group = require('./Group');
const User = require('./User');
const Result = require('./Result/Result');
const ResultMode = require('./Result/ResultMode');
const WordResult = require('./Result/WordResult');
const SharedGroup = require('./SharedGroup/SharedGroup');
const SharedCard = require('./SharedGroup/SharedCard');

// User - Group
User.hasMany(Group, { foreignKey: 'userId', as: 'groups' });
Group.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - SharedGroup
User.hasMany(SharedGroup, { foreignKey: 'userId', as: 'groups' });
SharedGroup.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Group - Card
Group.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User - Result
User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Result - ResultMode
Result.hasMany(ResultMode, { foreignKey: 'resultId', as: 'mode' });
ResultMode.belongsTo(Result, { foreignKey: 'resultId', as: 'result' });

// ResultMode - WordResult
ResultMode.hasMany(WordResult, { foreignKey: 'resultModeId', as: 'words' });
WordResult.belongsTo(ResultMode, { foreignKey: 'resultModeId', as: 'resultMode' })

module.exports = {
    Card,
    User,
    Group,
    Result,
    ResultMode,
    WordResult,
    SharedGroup,
    SharedCard
}