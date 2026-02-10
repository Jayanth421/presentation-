const Subject = require('../models/Subject');

const listSubjects = async (_req, res) => {
  const subjects = await Subject.find()
    .populate('assignedFaculty', 'name email')
    .populate('classes');
  return res.json(subjects);
};

const createSubject = async (req, res) => {
  const { name, code } = req.body;
  const subject = await Subject.create({ name, code });
  return res.status(201).json(subject);
};

const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { name, code } = req.body;
  const subject = await Subject.findByIdAndUpdate(
    id,
    { $set: { name, code } },
    { new: true }
  );
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  return res.json(subject);
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByIdAndDelete(id);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });
  return res.json({ message: 'Subject deleted' });
};

module.exports = { listSubjects, createSubject, updateSubject, deleteSubject };
