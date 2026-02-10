const Subject = require('../models/Subject');

const getAssignedSubjects = async (req, res) => {
  const subjects = await Subject.find({ classes: req.user.classRef }).populate('assignedFaculty', 'name email');
  return res.json(subjects);
};

module.exports = { getAssignedSubjects };
