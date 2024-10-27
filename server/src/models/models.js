const Card = require('./Card');
const Group = require('./Group');
const User = require('./User');
const Result = require('./Result');

// User - Group
User.hasMany(Group, { foreignKey: 'userId', as: 'groups' });
Group.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Group - Card
Group.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

// User - Result
User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    Card,
    User,
    Group
}