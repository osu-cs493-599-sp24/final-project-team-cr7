const { DataTypes } = require('sequelize')
const sequelize = require("../lib/sequelize.js")
const { Course } = require('./course')


const Assignment = sequelize.define('Assignment', {
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
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
        type: DataTypes.DATE,
        allowNull: false
    }

})
Assignment.belongsTo(Course, {foreignKey: 'courseId'})
Course.hasMany(Assignment, { foreignKey: 'courseId'})


exports.Assignment = Assignment



const AssignmentSchema = {
    courseId: { required: true },
    title: { required: true },
    points: { required: true },
    due: { required: true },
}
exports.AssignmentSchema = AssignmentSchema