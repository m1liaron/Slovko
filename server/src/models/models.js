const Card = require('./Card');
const Group = require('./Group');
const User = require('./User');
const Result = require('./Result');
const ResultMode = require('./ResultMode');
const WordResult = require('./WordResult');

// User - Group
User.hasMany(Group, { foreignKey: 'userId', as: 'groups' });
Group.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Group - Card
Group.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User - Result
User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Result - ResultMode
Result.hasMany(ResultMode, { foreignKey: 'userId', as: 'mode' });
ResultMode.belongsTo(Result, { foreignKey: 'resultId', as: 'result' });

// ResultMode - WordResult
ResultMode.hasMany(WordResult, { foreignKey: 'resultModeId', as: 'words' });
WordResult.belongsTo(ResultMode, { foreignKey: 'resultModeId', as: 'resultMode' })

module.exports = {
    Card,
    User,
    Group
}