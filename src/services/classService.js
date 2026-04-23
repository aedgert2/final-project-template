import * as classRepo from '../repositories/classRepository.js';
import { parseId } from '../utils/helper.js';

const badRequest = (msg) => { const e = new Error(msg); e.status = 400; return e; };
const notFound   = (msg) => { const e = new Error(msg); e.status = 404; return e; };
const conflict   = (msg) => { const e = new Error(msg); e.status = 409; return e; };

const assertValidId = (param) => {
  const id = parseId(param);
  if (!id) throw badRequest('ID must be a positive integer.');
  return id;
};

export const createClass = async ({ name, description }) => {
  if (!name || !description) throw badRequest('name and description are required.');

  const existing = await classRepo.findClassByName(name);
  if (existing) throw conflict(`A class named "${name}" already exists.`);

  return classRepo.createClass({ name, description });
};

export const getAllClasses = () => classRepo.findAllClasses();

export const getClassById = async (param) => {
  const id = assertValidId(param);
  const cls = await classRepo.findClassById(id);
  if (!cls) throw notFound(`Class with id ${id} does not exist.`);
  return cls;
};

export const updateClass = async (param, { name, description }) => {
  const id = assertValidId(param);

  const cls = await classRepo.findClassById(id);
  if (!cls) throw notFound(`Class with id ${id} does not exist.`);

  const updates = {};
  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) throw badRequest('name must be a non-empty string.');
    // Check uniqueness only if name is changing
    if (name !== cls.name) {
      const duplicate = await classRepo.findClassByName(name);
      if (duplicate) throw conflict(`A class named "${name}" already exists.`);
    }
    updates.name = name;
  }
  if (description !== undefined) {
    if (typeof description !== 'string' || !description.trim()) throw badRequest('description must be a non-empty string.');
    updates.description = description;
  }

  if (Object.keys(updates).length === 0) throw badRequest('No valid fields provided for update.');

  return classRepo.updateClass(id, updates);
};

export const deleteClass = async (param) => {
  const id = assertValidId(param);
  const cls = await classRepo.findClassById(id);
  if (!cls) throw notFound(`Class with id ${id} does not exist.`);
  return classRepo.deleteClass(id);
};