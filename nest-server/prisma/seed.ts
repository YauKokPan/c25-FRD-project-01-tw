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

async function resetPostgresSequence(tableName, columnName) {
  const maxIdResult = await prisma.$queryRawUnsafe(
    `SELECT MAX(${columnName}) FROM ${tableName};`,
  );

  const maxId = maxIdResult[0].max || 0;

  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE ${tableName}_${columnName}_seq RESTART WITH ${maxId + 1};`,
  );
}
async function resetPostgresSequences() {
  await resetPostgresSequence('hotels', 'id');
  await resetPostgresSequence('comments', 'id');
  await resetPostgresSequence('gallery', 'id');
  await resetPostgresSequence('bookings', 'id');
  await resetPostgresSequence('payments', 'id');
  await resetPostgresSequence('favorites', 'id');
}

const hotelSeedFile = join(process.cwd(), './data/hotels.csv');
const prisma = new PrismaClient();
const main = async () => {
  // delete table data first before seeding

  await prisma.favorite.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.hotel.deleteMany();
  await resetPostgresSequences();

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

  const fileContent = fs.readFileSync(hotelSeedFile, 'utf8');
  const parsedData = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  interface HotelRecord {
    user_id: number;
    name: string;
    address: string;
    district: string;
    google_map_address: string;
    phone: string;
    profile_pic: string;
    description: string;
    total_rooms: number;
    hourly_rate: number;
    is_deleted: boolean;
  }

  const hotels: HotelRecord[] = parsedData.data;

  // Sort the hotels data by ID before inserting
  hotels.sort((a, b) => a.user_id - b.user_id);

  for (const hotelRecord of hotels) {
    await prisma.hotel.create({
      data: {
        name: hotelRecord.name,
        address: hotelRecord.address,
        district: hotelRecord.district,
        google_map_address: hotelRecord.google_map_address,
        phone: hotelRecord.phone,
        profile_pic: hotelRecord.profile_pic,
        description: hotelRecord.description,
        user_id: +hotelRecord.user_id,
        is_deleted: Boolean(hotelRecord.is_deleted),
        total_rooms: +hotelRecord.total_rooms,
        hourly_rate: +hotelRecord.hourly_rate,
      },
    });
  }

  const galleryResults = [];
  fs.createReadStream(join(process.cwd(), '/data/gallery.csv'))
    .pipe(csv())
    .on('data', (data) => galleryResults.push(data))
    .on('end', async () => {
      for (const row of galleryResults) {
        row['hotel_id'] = +row['hotel_id'];
        await prisma.gallery.create({ data: row });
      }
    });
};

main()
  .then(() => console.log('seed done'))
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
