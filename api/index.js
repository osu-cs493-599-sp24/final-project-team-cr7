const router = require('express').Router();

const assignments = require('./assignments');
const courses = require('./courses');
const submissions = require('./submissions');
const users = require('./users');

router.use('/assignments', assignments);
router.use('/courses', courses);
router.use('/submissions', submissions);
router.use('/users', users);

module.exports = router;
