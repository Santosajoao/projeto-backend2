const { DataTypes } = require('sequelize');
const { sequelize } = require('../helpers/db');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, 
{
    tableName: 'tickets',
    timestamps: false
});

module.exports = Ticket;