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

exports.getUserById = async function (id, includePassword = false) {
    try {
      const options = includePassword ? {} : { attributes: { exclude: ['password'] } };
      const user = await User.findByPk(id, options);
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }
  
exports.validateCredentials = async function (id, password) {
    try {
      // Fetch the user by ID
      const user = await exports.getUserById(id, true);
      console.log('User:', user); // Log the user object
      
      // Compare the provided password with the hashed password
      if (!user) {
        console.log('User not found');
        return false;
      }
      const passwordMatch = bcrypt.compareSync(password, user.password);
      console.log('Password match:', passwordMatch); // Log the result of password comparison
      
      return passwordMatch;
    } catch (error) {
      console.error("Error validating credentials:", error);
      throw error;
    }
}