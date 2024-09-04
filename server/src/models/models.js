const Card = require('./Card');
const Group = require('./Group');
const User = require('./User');

// User - Group
User.hasMany(Group, { foreignKey: 'userId', as: 'groups' });
Group.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Group - Card
Group.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

module.exports = {
    Card,
    User,
    Group
}