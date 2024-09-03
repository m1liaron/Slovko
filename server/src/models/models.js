const Card = require('./Card');
const User = require('./User');

User.hasMany(Card, { foreignKey: 'userId', as: 'cards' });
Card.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    Card,
    User
}