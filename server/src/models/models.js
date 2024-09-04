const Card = require('./Card');
const Group = require('./Group');
const User = require('./User');

User.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Group.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Group.hasMany(Card, { foreignKey: 'userId', as: 'card' });
Card.belongsTo(Card, { foreignKey: 'userId', as: 'card' });

module.exports = {
    Card,
    User
}