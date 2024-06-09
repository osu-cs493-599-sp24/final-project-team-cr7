const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")

const Assignment = sequelize.define('Assignment', {
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    due: {
        type: DataTypes.STRING,
        allowNull: false
    }

})
exports.Assignment = Assignment

const AssignmentSchema = {
    courseId: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true },
}
exports.AssignmentSchema = AssignmentSchema