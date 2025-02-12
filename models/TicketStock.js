const { DataTypes } = require('sequelize');
const { sequelize } = require('../helpers/db');
const User = require('./User');
const Ticket = require('./Ticket');

const TicketStock = sequelize.define('TicketStock', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, 
{
    tableName: 'ticket_stock',
    timestamps: false
});

TicketStock.belongsTo(Ticket, { foreignKey: 'ticketId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

module.exports = TicketStock;
