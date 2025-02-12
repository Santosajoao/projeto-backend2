const { DataTypes } = require('sequelize');
const { sequelize } = require('../helpers/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, 
{
    tableName: 'users',
    timestamps: false
});

module.exports = User;
