const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const faculty = require('../controllers/facultyController');

router.use(auth, requireRole('Faculty'));

router.get('/subjects', faculty.getAssignedSubjects);
router.get('/students', faculty.getStudents);

module.exports = router;
