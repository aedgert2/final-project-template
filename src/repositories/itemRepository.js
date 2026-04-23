import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const itemSelect = { id: true, name: true, type: true, tier: true };

export const createItem = (data) =>
  prisma.item.create({ data, select: itemSelect });

export const findAllItems = () =>
  prisma.item.findMany({ select: itemSelect, orderBy: { id: 'asc' } });

export const findItemById = (id) =>
  prisma.item.findUnique({ where: { id }, select: itemSelect });

export const findItemByName = (name) =>
  prisma.item.findUnique({ where: { name } });

export const updateItem = (id, data) =>
  prisma.item.update({ where: { id }, data, select: itemSelect });

export const deleteItem = (id) =>
  prisma.item.delete({ where: { id }, select: itemSelect });