const path = require('path');
const Ppt = require('../models/Ppt');
const Subject = require('../models/Subject');
const User = require('../models/User');

const canUploadToSubject = async (user, subjectId) => {
  if (user.role === 'Admin') return true;
  if (user.role !== 'Faculty') return false;
  const subject = await Subject.findOne({ _id: subjectId, assignedFaculty: user.id });
  return !!subject;
};

const uploadPpt = async (req, res) => {
  const { subjectId, classId } = req.body;
  if (!subjectId || !classId) return res.status(400).json({ message: 'Subject and Class are required' });

  const allowed = await canUploadToSubject(req.user, subjectId);
  if (!allowed) return res.status(403).json({ message: 'Not allowed to upload to this subject' });

  if (!req.file) return res.status(400).json({ message: 'File is required' });

  const subject = await Subject.findById(subjectId);
  if (!subject || !subject.classes.map((c) => c.toString()).includes(classId)) {
    return res.status(400).json({ message: 'Class is not assigned to this subject' });
  }

  const ppt = await Ppt.create({
    subject: subjectId,
    classRef: classId,
    uploadedBy: req.user.id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });

  return res.status(201).json(ppt);
};

const listPpts = async (req, res) => {
  const { role, id } = req.user;
  let query = {};

  if (role === 'Faculty') {
    const subjects = await Subject.find({ assignedFaculty: id }).select('_id');
    query.subject = { $in: subjects.map((s) => s._id) };
  }

  if (role === 'Student') {
    const fullUser = await User.findById(id);
    query.classRef = fullUser?.classRef || null;
  }

  const ppts = await Ppt.find(query)
    .populate('subject', 'name code')
    .populate('classRef')
    .populate('uploadedBy', 'name email')
    .sort({ createdAt: -1 });

  return res.json(ppts);
};

const downloadPpt = async (req, res) => {
  const { id } = req.params;
  const ppt = await Ppt.findById(id).populate('subject');
  if (!ppt) return res.status(404).json({ message: 'PPT not found' });

  const user = req.user;
  if (user.role === 'Faculty') {
    const subject = await Subject.findOne({ _id: ppt.subject._id, assignedFaculty: user.id });
    if (!subject) return res.status(403).json({ message: 'Forbidden' });
  }

  if (user.role === 'Student') {
    const fullUser = await User.findById(user.id);
    if (!fullUser.classRef || fullUser.classRef.toString() !== ppt.classRef.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  }

  const fileName = ppt.originalName || path.basename(ppt.filePath);
  return res.download(ppt.filePath, fileName);
};

module.exports = { uploadPpt, listPpts, downloadPpt };
