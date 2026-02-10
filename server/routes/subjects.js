const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const subject = require('../controllers/subjectController');

router.get('/', auth, subject.listSubjects);
router.post('/', auth, requireRole('Admin'), subject.createSubject);
router.put('/:id', auth, requireRole('Admin'), subject.updateSubject);
router.delete('/:id', auth, requireRole('Admin'), subject.deleteSubject);

module.exports = router;
