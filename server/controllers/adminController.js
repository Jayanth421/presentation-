const User = require('../models/User');
const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Ppt = require('../models/Ppt');

const dashboard = async (_req, res) => {
  const [students, faculty, subjects] = await Promise.all([
    User.countDocuments({ role: 'Student' }),
    User.countDocuments({ role: 'Faculty' }),
    Subject.countDocuments(),
  ]);

  return res.json({ students, faculty, subjects });
};

const listUsers = async (_req, res) => {
  const users = await User.find().populate('classRef').sort({ createdAt: -1 });
  return res.json(users);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, classRef, name } = req.body;

  const updates = {};
  if (role) updates.role = role;
  if (typeof classRef !== 'undefined') updates.classRef = classRef || null;
  if (name) updates.name = name;

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ message: 'User deleted' });
};

const assignSubject = async (req, res) => {
  const { subjectId } = req.params;
  const { facultyId, classIds } = req.body;

  const subject = await Subject.findById(subjectId);
  if (!subject) return res.status(404).json({ message: 'Subject not found' });

  if (facultyId) subject.assignedFaculty = facultyId;
  if (Array.isArray(classIds)) subject.classes = classIds;

  await subject.save();
  return res.json(subject);
};

const deletePpt = async (req, res) => {
  const { id } = req.params;
  const ppt = await Ppt.findByIdAndDelete(id);
  if (!ppt) return res.status(404).json({ message: 'PPT not found' });
  return res.json({ message: 'PPT deleted' });
};

module.exports = {
  dashboard,
  listUsers,
  updateUser,
  deleteUser,
  assignSubject,
  deletePpt,
};
