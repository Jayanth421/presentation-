const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const student = require('../controllers/studentController');

router.use(auth, requireRole('Student'));

router.get('/subjects', student.getAssignedSubjects);

module.exports = router;
