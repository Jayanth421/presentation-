const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const classCtrl = require('../controllers/classController');

router.get('/', auth, classCtrl.listClasses);
router.post('/', auth, requireRole('Admin'), classCtrl.createClass);
router.put('/:id', auth, requireRole('Admin'), classCtrl.updateClass);
router.delete('/:id', auth, requireRole('Admin'), classCtrl.deleteClass);

module.exports = router;
