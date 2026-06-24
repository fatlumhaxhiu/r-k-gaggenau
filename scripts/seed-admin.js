const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@rk-gaggenau.de';
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!password) throw new Error('ADMIN_SEED_PASSWORD environment variable is not set.');
  const password_hash = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password_hash,
      full_name: 'Super Admin',
      role: 'super_admin'
    },
  });

  console.log('✅ Admin user created:', admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
