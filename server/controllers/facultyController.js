const Subject = require('../models/Subject');
const User = require('../models/User');

const getAssignedSubjects = async (req, res) => {
  const subjects = await Subject.find({ assignedFaculty: req.user.id }).populate('classes');
  return res.json(subjects);
};

const getStudents = async (req, res) => {
  const subjects = await Subject.find({ assignedFaculty: req.user.id });
  const classIds = subjects.flatMap((s) => s.classes);
  const students = await User.find({ role: 'Student', classRef: { $in: classIds } })
    .populate('classRef')
    .sort({ name: 1 });
  return res.json(students);
};

module.exports = { getAssignedSubjects, getStudents };
