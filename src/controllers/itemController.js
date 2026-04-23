import * as itemService from '../services/itemService.js';

export const createItem = async (req, res) => {
  try {
    const item = await itemService.createItem(req.body);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    return res.status(200).json(items);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    return res.status(200).json(item);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await itemService.updateItem(req.params.id, req.body);
    return res.status(200).json(item);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await itemService.deleteItem(req.params.id);
    return res.status(200).json(item);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};