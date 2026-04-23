import * as characterService from '../services/characterService.js';

export const createCharacter = async (req, res) => {
  try {
    const character = await characterService.createCharacter(req.body, req.user.id);
    return res.status(201).json(character);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getMyCharacters = async (req, res) => {
  try {
    const characters = await characterService.getMyCharacters(req.user.id);
    return res.status(200).json(characters);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const getCharacterById = async (req, res) => {
  try {
    const character = await characterService.getCharacterById(req.params.id, req.user.id);
    return res.status(200).json(character);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const updateCharacter = async (req, res) => {
  try {
    const character = await characterService.updateCharacter(req.params.id, req.body, req.user.id);
    return res.status(200).json(character);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const deleteCharacter = async (req, res) => {
  try {
    const character = await characterService.deleteCharacter(req.params.id, req.user.id);
    return res.status(200).json(character);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const result = await characterService.addItemToCharacter(req.params.id, req.body, req.user.id);
    return res.status(201).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const result = await characterService.removeItemFromCharacter(req.params.id, req.params.itemId, req.user.id);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
};