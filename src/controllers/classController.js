import * as classService from '../services/classService.js';

export const createClass = async (req, res) => {
  try {
    const cls = await classService.createClass(req.body);
    return res.status(201).json(cls);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await classService.getAllClasses();
    return res.status(200).json(classes);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getClassById = async (req, res) => {
  try {
    const cls = await classService.getClassById(req.params.id);
    return res.status(200).json(cls);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const cls = await classService.updateClass(req.params.id, req.body);
    return res.status(200).json(cls);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const cls = await classService.deleteClass(req.params.id);
    return res.status(200).json(cls);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};