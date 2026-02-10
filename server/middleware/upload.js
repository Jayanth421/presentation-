const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Subject = require('../models/Subject');

const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    try {
      const subjectId = req.body.subjectId || req.params.subjectId;
      if (!subjectId) return cb(new Error('Subject is required'));
      const subject = await Subject.findById(subjectId);
      if (!subject) return cb(new Error('Subject not found'));

      const dir = path.join(__dirname, '..', 'uploads', subjectId.toString());
      fs.mkdirSync(dir, { recursive: true });
      return cb(null, dir);
    } catch (err) {
      return cb(err);
    }
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.ppt' || ext === '.pptx') {
    return cb(null, true);
  }
  return cb(new Error('Only .ppt and .pptx files are allowed'));
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
