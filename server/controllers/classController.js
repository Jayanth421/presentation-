const Class = require('../models/Class');

const listClasses = async (_req, res) => {
  const classes = await Class.find().sort({ createdAt: -1 });
  return res.json(classes);
};

const createClass = async (req, res) => {
  const { name, year, section } = req.body;
  const classDoc = await Class.create({ name, year, section });
  return res.status(201).json(classDoc);
};

const updateClass = async (req, res) => {
  const { id } = req.params;
  const { name, year, section } = req.body;
  const classDoc = await Class.findByIdAndUpdate(
    id,
    { $set: { name, year, section } },
    { new: true }
  );
  if (!classDoc) return res.status(404).json({ message: 'Class not found' });
  return res.json(classDoc);
};

const deleteClass = async (req, res) => {
  const { id } = req.params;
  const classDoc = await Class.findByIdAndDelete(id);
  if (!classDoc) return res.status(404).json({ message: 'Class not found' });
  return res.json({ message: 'Class deleted' });
};

module.exports = { listClasses, createClass, updateClass, deleteClass };
