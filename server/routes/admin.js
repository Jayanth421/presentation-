const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const admin = require('../controllers/adminController');

router.use(auth, requireRole('Admin'));

router.get('/dashboard', admin.dashboard);
router.get('/users', admin.listUsers);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);
router.put('/subjects/:subjectId/assign', admin.assignSubject);
router.delete('/ppts/:id', admin.deletePpt);

module.exports = router;
