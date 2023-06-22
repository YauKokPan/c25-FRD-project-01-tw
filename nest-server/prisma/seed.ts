import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { join } from 'path';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as csv from 'csv-parser';
import { faker } from '@faker-js/faker';

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
  await resetPostgresSequence('users', 'id');
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
  await prisma.user.deleteMany();
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
      password: await hashPassword('tecky'),
      phone: '87456789',
      is_admin: false,
    },
    {
      name: 'Alex',
      email: 'alex@tecky.io',
      password: await hashPassword('tecky'),
      phone: '87456100',
      is_admin: false,
    },
    {
      name: 'Gordon',
      email: 'gordon@tecky.io',
      password: await hashPassword('tecky'),
      phone: '87456112',
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

  const numberOfUsers = 46;

  for (let i = 0; i < numberOfUsers; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await hashPassword(faker.internet.password()),
        phone: faker.phone.number('61######'),
        is_admin: false,
      },
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

  // fakerjs to populate comment table
  const numComments = 500;

  // Generate comments
  for (let i = 0; i < numComments; i++) {
    const userId = faker.datatype.boolean() ? 1 : 2;
    const hotelId = faker.number.int({ min: 1, max: 147 });
    const nickName = faker.internet.userName();
    const commentText = faker.lorem.sentence();
    const rating = faker.number.int({ min: 1, max: 5 });
    const is_deleted = false;

    await prisma.comment.create({
      data: {
        user_id: userId,
        hotel_id: hotelId,
        nick_name: nickName,
        comment_text: commentText,
        rating: rating,
        is_deleted: is_deleted,
      },
    });
  }

  // populate bookings
  const numberOfBookings = 1000;
  const numberOfHotels = 147;

  for (let i = 0; i < numberOfBookings; i++) {
    const startDate = faker.date.between({
      from: '2022-01-01',
      to: '2023-12-31',
    });
    const durationHours = faker.number.int({ min: 1, max: 7 });
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000,
    );

    const pricePerHour = faker.number.int({ min: 100, max: 500 });
    const total_prices = durationHours * pricePerHour;

    await prisma.booking.create({
      data: {
        user_id: faker.number.int({ min: 1, max: 50 }),
        hotel_id: faker.number.int({ min: 1, max: numberOfHotels }),
        start_time: startDate,
        end_time: endDate,
        total_hours: durationHours,
        total_prices,
        booking_phone: faker.phone.number('61######'),
        booking_email: faker.internet.email(),
        remarks: faker.lorem.sentences(3),
      },
    });
  }
};

const callFuncTwice = (func: any, n: number) => {
  for (let i = 1; i <= n; i++) {
    func;
  }
};

callFuncTwice(
  main()
    .then(() => console.log('seed done'))
    .catch((err) => console.error(err))
    .finally(() => prisma.$disconnect()),
  2,
);
