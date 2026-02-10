const router = require('express').Router();
const { auth, requireRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const ppt = require('../controllers/pptController');

router.get('/', auth, ppt.listPpts);
router.post('/upload', auth, requireRole('Admin', 'Faculty'), upload.single('file'), ppt.uploadPpt);
router.get('/:id/download', auth, ppt.downloadPpt);

module.exports = router;
