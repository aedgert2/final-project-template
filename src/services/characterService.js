import * as characterRepo from '../repositories/characterRepository.js';
import * as classRepo from '../repositories/classRepository.js';
import * as itemRepo from '../repositories/itemRepository.js';
import { parseId } from '../utils/helper.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const badRequest = (msg) => { const e = new Error(msg); e.status = 400; return e; };
const notFound   = (msg) => { const e = new Error(msg); e.status = 404; return e; };
const forbidden  = (msg) => { const e = new Error(msg); e.status = 403; return e; };

const assertValidId = (param) => {
  const id = parseId(param);
  if (!id) throw badRequest('ID must be a positive integer.');
  return id;
};

const assertOwnership = (character, userId) => {
  if (character.userId !== userId) throw forbidden('You do not own this character.');
};

// ── Characters ────────────────────────────────────────────────────────────────

export const createCharacter = async ({ name, level, classId }, userId) => {
  if (!name || classId === undefined || classId === null) {
    throw badRequest('name and classId are required.');
  }

  const parsedClassId = parseId(String(classId));
  if (!parsedClassId) throw badRequest('classId must be a positive integer.');

  const cls = await classRepo.findClassById(parsedClassId);
  if (!cls) throw notFound(`Class with id ${parsedClassId} does not exist.`);

  const parsedLevel = level !== undefined ? parseInt(level, 10) : 1;
  if (!Number.isInteger(parsedLevel) || parsedLevel < 1) {
    throw badRequest('level must be a positive integer.');
  }

  return characterRepo.createCharacter({
    name,
    level: parsedLevel,
    classId: parsedClassId,
    userId,
  });
};

export const getMyCharacters = (userId) =>
  characterRepo.findAllByUser(userId);

export const getCharacterById = async (param, userId) => {
  const id = assertValidId(param);
  const character = await characterRepo.findByIdWithItems(id);
  if (!character) throw notFound(`Character with id ${id} does not exist.`);
  assertOwnership(character, userId);
  return character;
};

export const updateCharacter = async (param, { name, level, classId }, userId) => {
  const id = assertValidId(param);

  const character = await characterRepo.findById(id);
  if (!character) throw notFound(`Character with id ${id} does not exist.`);
  assertOwnership(character, userId);

  const updates = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw badRequest('name must be a non-empty string.');
    updates.name = name;
  }
  if (level !== undefined) {
    const parsedLevel = parseInt(level, 10);
    if (!Number.isInteger(parsedLevel) || parsedLevel < 1) throw badRequest('level must be a positive integer.');
    updates.level = parsedLevel;
  }
  if (classId !== undefined) {
    const parsedClassId = parseId(String(classId));
    if (!parsedClassId) throw badRequest('classId must be a positive integer.');
    const cls = await classRepo.findClassById(parsedClassId);
    if (!cls) throw notFound(`Class with id ${parsedClassId} does not exist.`);
    updates.classId = parsedClassId;
  }

  if (Object.keys(updates).length === 0) throw badRequest('No valid fields provided for update.');

  return characterRepo.updateCharacter(id, updates);
};

export const deleteCharacter = async (param, userId) => {
  const id = assertValidId(param);
  const character = await characterRepo.findById(id);
  if (!character) throw notFound(`Character with id ${id} does not exist.`);
  assertOwnership(character, userId);
  return characterRepo.deleteCharacter(id);
};

// ── Character Items ───────────────────────────────────────────────────────────

export const addItemToCharacter = async (characterParam, { itemId }, userId) => {
  const characterId = assertValidId(characterParam);
  const parsedItemId = parseId(String(itemId));
  if (!parsedItemId) throw badRequest('itemId must be a positive integer.');

  const character = await characterRepo.findById(characterId);
  if (!character) throw notFound(`Character with id ${characterId} does not exist.`);
  assertOwnership(character, userId);

  const item = await itemRepo.findItemById(parsedItemId);
  if (!item) throw notFound(`Item with id ${parsedItemId} does not exist.`);

  const existing = await characterRepo.findCharacterItem(characterId, parsedItemId);
  if (existing) {
    const e = new Error('Item is already assigned to this character.');
    e.status = 409;
    throw e;
  }

  return characterRepo.addItem(characterId, parsedItemId);
};

export const removeItemFromCharacter = async (characterParam, itemParam, userId) => {
  const characterId = assertValidId(characterParam);
  const itemId = assertValidId(itemParam);

  const character = await characterRepo.findById(characterId);
  if (!character) throw notFound(`Character with id ${characterId} does not exist.`);
  assertOwnership(character, userId);

  const existing = await characterRepo.findCharacterItem(characterId, itemId);
  if (!existing) throw notFound(`Item with id ${itemId} is not assigned to this character.`);

  return characterRepo.removeItem(characterId, itemId);
};