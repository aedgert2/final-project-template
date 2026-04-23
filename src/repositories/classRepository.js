import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const classSelect = { id: true, name: true, description: true };

export const createClass = (data) =>
  prisma.class.create({ data, select: classSelect });

export const findAllClasses = () =>
  prisma.class.findMany({ select: classSelect, orderBy: { id: 'asc' } });

export const findClassById = (id) =>
  prisma.class.findUnique({ where: { id }, select: classSelect });

export const findClassByName = (name) =>
  prisma.class.findUnique({ where: { name } });

export const updateClass = (id, data) =>
  prisma.class.update({ where: { id }, data, select: classSelect });

export const deleteClass = (id) =>
  prisma.class.delete({ where: { id }, select: classSelect });