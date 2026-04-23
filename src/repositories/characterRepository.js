import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const characterSelect = {
  id: true,
  name: true,
  level: true,
  classId: true,
  userId: true,
};

export const createCharacter = (data) =>
  prisma.character.create({ data, select: characterSelect });

export const findAllByUser = (userId) =>
  prisma.character.findMany({
    where: { userId },
    select: characterSelect,
  });

export const findById = (id) =>
  prisma.character.findUnique({
    where: { id },
    select: characterSelect,
  });

export const findByIdWithItems = (id) =>
  prisma.character.findUnique({
    where: { id },
    select: {
      ...characterSelect,
      items: {
        select: {
          item: { select: { id: true, name: true, type: true, tier: true } },
        },
      },
    },
  });

export const updateCharacter = (id, data) =>
  prisma.character.update({ where: { id }, data, select: characterSelect });

export const deleteCharacter = (id) =>
  prisma.character.delete({ where: { id }, select: characterSelect });

// ── Character Items ───────────────────────────────────────────────────────────

export const findCharacterItem = (characterId, itemId) =>
  prisma.characterItem.findUnique({
    where: { characterId_itemId: { characterId, itemId } },
  });

export const addItem = (characterId, itemId) =>
  prisma.characterItem.create({
    data: { characterId, itemId },
    select: { characterId: true, itemId: true },
  });

export const removeItem = (characterId, itemId) =>
  prisma.characterItem.delete({
    where: { characterId_itemId: { characterId, itemId } },
    select: { characterId: true, itemId: true },
  });