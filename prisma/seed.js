import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      username: 'alice',
      email: 'alice@example.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      username: 'bob',
      email: 'bob@example.com',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Users created: admin (id=${admin.id}), alice (id=${user1.id}), bob (id=${user2.id})`);

  // ── Classes ─────────────────────────────────────────────────────────────────
  const warrior = await prisma.class.upsert({
    where: { name: 'Warrior' },
    update: {},
    create: { name: 'Warrior', description: 'A powerful melee fighter who excels in close combat.' },
  });

  const mage = await prisma.class.upsert({
    where: { name: 'Mage' },
    update: {},
    create: { name: 'Mage', description: 'An arcane spellcaster who wields elemental magic.' },
  });

  const rogue = await prisma.class.upsert({
    where: { name: 'Rogue' },
    update: {},
    create: { name: 'Rogue', description: 'A stealthy assassin who strikes from the shadows.' },
  });

  const paladin = await prisma.class.upsert({
    where: { name: 'Paladin' },
    update: {},
    create: { name: 'Paladin', description: 'A holy warrior who combines combat and divine magic.' },
  });

  console.log(`✅ Classes created: Warrior (id=${warrior.id}), Mage (id=${mage.id}), Rogue (id=${rogue.id}), Paladin (id=${paladin.id})`);

  // ── Items ───────────────────────────────────────────────────────────────────
  const ironSword = await prisma.item.upsert({
    where: { name: 'Iron Sword' },
    update: {},
    create: { name: 'Iron Sword', type: 'weapon', tier: 1 },
  });

  const steelSword = await prisma.item.upsert({
    where: { name: 'Steel Sword' },
    update: {},
    create: { name: 'Steel Sword', type: 'weapon', tier: 2 },
  });

  const leatherArmor = await prisma.item.upsert({
    where: { name: 'Leather Armor' },
    update: {},
    create: { name: 'Leather Armor', type: 'armor', tier: 1 },
  });

  const chainmail = await prisma.item.upsert({
    where: { name: 'Chainmail' },
    update: {},
    create: { name: 'Chainmail', type: 'armor', tier: 2 },
  });

  const fireball = await prisma.item.upsert({
    where: { name: 'Fireball Tome' },
    update: {},
    create: { name: 'Fireball Tome', type: 'spell', tier: 2 },
  });

  const healthPotion = await prisma.item.upsert({
    where: { name: 'Health Potion' },
    update: {},
    create: { name: 'Health Potion', type: 'consumable', tier: 1 },
  });

  console.log(`✅ Items created: ${ironSword.id}, ${steelSword.id}, ${leatherArmor.id}, ${chainmail.id}, ${fireball.id}, ${healthPotion.id}`);

  // ── Characters ──────────────────────────────────────────────────────────────
  // Alice's characters
  const aragorn = await prisma.character.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Aragorn',
      level: 5,
      userId: user1.id,
      classId: warrior.id,
    },
  });

  const gandalf = await prisma.character.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Gandalf',
      level: 10,
      userId: user1.id,
      classId: mage.id,
    },
  });

  // Bob's characters
  const legolas = await prisma.character.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Legolas',
      level: 4,
      userId: user2.id,
      classId: rogue.id,
    },
  });

  console.log(`✅ Characters created: Aragorn (id=${aragorn.id}), Gandalf (id=${gandalf.id}), Legolas (id=${legolas.id})`);

  // ── Character Items ──────────────────────────────────────────────────────────
  await prisma.characterItem.upsert({
    where: { characterId_itemId: { characterId: aragorn.id, itemId: ironSword.id } },
    update: {},
    create: { characterId: aragorn.id, itemId: ironSword.id },
  });

  await prisma.characterItem.upsert({
    where: { characterId_itemId: { characterId: aragorn.id, itemId: chainmail.id } },
    update: {},
    create: { characterId: aragorn.id, itemId: chainmail.id },
  });

  await prisma.characterItem.upsert({
    where: { characterId_itemId: { characterId: gandalf.id, itemId: fireball.id } },
    update: {},
    create: { characterId: gandalf.id, itemId: fireball.id },
  });

  await prisma.characterItem.upsert({
    where: { characterId_itemId: { characterId: legolas.id, itemId: leatherArmor.id } },
    update: {},
    create: { characterId: legolas.id, itemId: leatherArmor.id },
  });

  console.log('✅ Character items assigned');
  console.log('\n🎉 Seed complete!');
  console.log('\nTest credentials:');
  console.log('  Admin  → email: admin@example.com  | password: Admin123!');
  console.log('  Alice  → email: alice@example.com  | password: User123!');
  console.log('  Bob    → email: bob@example.com    | password: User123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });