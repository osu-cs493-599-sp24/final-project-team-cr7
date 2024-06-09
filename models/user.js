const { DataTypes } = require('sequelize')
const bcrypt = require('bcryptjs');

const sequelize = require('../lib/sequelize')

const User = sequelize.define('user', {
    name: {type: DataTypes.String, allowNull: false},
    email: {type: DataTypes.String, allowNull: false, unique: true},
    password: {
        type: DataTypes.String,
        allowNull: false,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 8))
        },
    },
    role: {type: DataTypes.String, defaultValue: 'student', isIn: [['admin', 'instructor', 'student']]}
})

exports.User = User

const UserSchema = {
    name: { required: true },
    email: { required: true },
    password: { required: true },
    role: { required: false },
}

exports.UserSchema = UserSchema