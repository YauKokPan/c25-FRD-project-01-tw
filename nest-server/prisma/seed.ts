import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { join } from 'path';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as csv from 'csv-parser';

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword: string) {
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash;
}

// reset  postgres id sequences
async function resetPostgresSequences() {
  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "bookings_id_seq" RESTART WITH 1;`,
  );

  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "equipments_id_seq" RESTART WITH 1;`,
  );

  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "room_types_id_seq" RESTART WITH 1;`,
  );
  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "rooms_id_seq" RESTART WITH 1;`,
  );

  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "gallery_id_seq" RESTART WITH 1;`,
  );
  await prisma.$executeRaw(
    Prisma.sql`ALTER SEQUENCE "hotels_id_seq" RESTART WITH 1;`,
  );
}

const hotelSeedFile = join(process.cwd(), './data/hotels.csv');
const prisma = new PrismaClient();
const main = async () => {
  // delete table data first before seeding
  await resetPostgresSequences();
  await prisma.booking.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.room.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.hotel.deleteMany();

  const insertUsers = [
    {
      name: 'admin',
      email: 'admin@sweethour.io',
      password: await hashPassword('1234'),
      phone: '12345678',
      is_admin: true,
    },
    {
      name: 'Jason',
      email: 'jason@sweethour.io',
      password: await hashPassword('5678'),
      phone: '87456789',
      is_admin: false,
    },
  ];

  for (const user of insertUsers) {
    await prisma.user.upsert({
      where: { name: user.name },
      update: {},
      create: { ...user },
    });
  }
  //dummy data for hotelBooking

  const fileContent = fs.readFileSync(hotelSeedFile, 'utf8');
  const parsedData = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const hotels = parsedData.data;

  for (const hotelRecord of hotels) {
    const userId = parseInt(hotelRecord.user_id);

    await prisma.hotel.create({
      data: {
        name: hotelRecord.name,
        address: hotelRecord.address,
        district: hotelRecord.district,
        google_map_address: hotelRecord.google_map_address,
        phone: hotelRecord.phone,
        profile_pic: hotelRecord.profile_pic,
        description: hotelRecord.description,
        user_id: userId,
      },
    });
  }

  const galleryResults = [];
  fs.createReadStream(__dirname + '/../data/gallery.csv')
    .pipe(csv())
    .on('data', (data) => galleryResults.push(data))
    .on('end', async () => {
      for (const row of galleryResults) {
        row['hotel_id'] = +row['hotel_id'];
        await prisma.gallery.create({ data: row });
      }
    });

  const roomTypesResults = [];
  fs.createReadStream(__dirname + '/../data/room_types.csv')
    .pipe(csv())
    .on('data', (data) => roomTypesResults.push(data))
    .on('end', async () => {
      for (const row of roomTypesResults) {
        await prisma.roomType.create({ data: row });
      }
    });

  const roomResults = [];
  fs.createReadStream(__dirname + '/../data/rooms.csv')
    .pipe(csv())
    .on('data', (data) => roomResults.push(data))
    .on('end', async () => {
      for (const row of roomResults) {
        row['hotel_id'] = +row['hotel_id'];
        row['number'] = +row['number'];
        row['hourly_rate'] = +row['hourly_rate'];
        row['available'] = Boolean(row['available']);
        row['room_type_id'] = +row['room_type_id'];
        await prisma.room.create({ data: row });
      }
    });

  const equipmentResults = [];
  fs.createReadStream(__dirname + '/../data/equipments.csv')
    .pipe(csv())
    .on('data', (data) => equipmentResults.push(data))
    .on('end', async () => {
      for (const row of equipmentResults) {
        await prisma.equipment.create({ data: row });
      }
    });
};

main()
  .then(() => console.log('seed done'))
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
