const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs');

const sequelize = require('../lib/sequelize');

const User = sequelize.define('Users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8))
        },
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'student',
        isIn: [[
            'admin',
            'instructor',
            'student',
        ]]
    },
})

exports.User = User

const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: false },
}
exports.UserSchema = UserSchema