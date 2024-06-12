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
      validate: {
          isIn: {
              args: [['admin', 'instructor', 'student']],
              msg: 'Role must be either "admin", "instructor", or "student"',
          },
      },
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

exports.validateCredentials = async function (id, password) {
  const user = await User.findByPk(id)
  return user && await bcrypt.compare(password, user.password)
}