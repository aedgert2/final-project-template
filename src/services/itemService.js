import * as itemRepo from '../repositories/itemRepository.js';
import { parseId } from '../utils/helper.js';

const badRequest = (msg) => { const e = new Error(msg); e.status = 400; return e; };
const notFound   = (msg) => { const e = new Error(msg); e.status = 404; return e; };
const conflict   = (msg) => { const e = new Error(msg); e.status = 409; return e; };

const VALID_TYPES = ['weapon', 'armor', 'spell', 'consumable', 'accessory'];

const assertValidId = (param) => {
  const id = parseId(param);
  if (!id) throw badRequest('ID must be a positive integer.');
  return id;
};

export const createItem = async ({ name, type, tier }) => {
  if (!name || !type || tier === undefined) throw badRequest('name, type, and tier are required.');

  if (!VALID_TYPES.includes(type)) {
    throw badRequest(`type must be one of: ${VALID_TYPES.join(', ')}.`);
  }

  const parsedTier = parseInt(tier, 10);
  if (!Number.isInteger(parsedTier) || parsedTier < 1) throw badRequest('tier must be a positive integer.');

  const existing = await itemRepo.findItemByName(name);
  if (existing) throw conflict(`An item named "${name}" already exists.`);

  return itemRepo.createItem({ name, type, tier: parsedTier });
};

export const getAllItems = () => itemRepo.findAllItems();

export const getItemById = async (param) => {
  const id = assertValidId(param);
  const item = await itemRepo.findItemById(id);
  if (!item) throw notFound(`Item with id ${id} does not exist.`);
  return item;
};

export const updateItem = async (param, { name, type, tier }) => {
  const id = assertValidId(param);

  const item = await itemRepo.findItemById(id);
  if (!item) throw notFound(`Item with id ${id} does not exist.`);

  const updates = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw badRequest('name must be a non-empty string.');
    if (name !== item.name) {
      const duplicate = await itemRepo.findItemByName(name);
      if (duplicate) throw conflict(`An item named "${name}" already exists.`);
    }
    updates.name = name;
  }
  if (type !== undefined) {
    if (!VALID_TYPES.includes(type)) throw badRequest(`type must be one of: ${VALID_TYPES.join(', ')}.`);
    updates.type = type;
  }
  if (tier !== undefined) {
    const parsedTier = parseInt(tier, 10);
    if (!Number.isInteger(parsedTier) || parsedTier < 1) throw badRequest('tier must be a positive integer.');
    updates.tier = parsedTier;
  }

  if (Object.keys(updates).length === 0) throw badRequest('No valid fields provided for update.');

  return itemRepo.updateItem(id, updates);
};

export const deleteItem = async (param) => {
  const id = assertValidId(param);
  const item = await itemRepo.findItemById(id);
  if (!item) throw notFound(`Item with id ${id} does not exist.`);
  return itemRepo.deleteItem(id);
};