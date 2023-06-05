import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { join } from 'path';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import * as csv from "csv-parser";

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword: string) {
  const hash: string = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hash;
}

const hotelSeedFile = join(process.cwd(), './data/hotels_updated.csv');
const prisma = new PrismaClient();
const main = async () => {
  const insertUser = {
    name: 'admin',
    email: 'admin@sweethour.io',
    password: await hashPassword('1234'),
    phone: '12345678',
    is_admin: true,
  };

  await prisma.user.upsert({
    where: { name: insertUser.name },
    update: {},
    create: { ...insertUser },
  });

  const fileContent = fs.readFileSync(hotelSeedFile, 'utf8');
  const parsedData = Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
  });

  const hotels = parsedData.data;

  for (const hotelRecord of hotels) {
    const userId = parseInt(hotelRecord.user_id);

    if (!isNaN(userId)) {
      await prisma.hotel.create({
        data: {
          name: hotelRecord.name,
          address: hotelRecord.address,
          district: hotelRecord.district,
          phone: hotelRecord.phone,
          profile_pic: hotelRecord.profile_pic,
          description: hotelRecord.description,
          user_id: userId,
        },
      });
    } else {
      console.warn(
        `Warning: Invalid user_id for hotel "${hotelRecord.name}". Skipping this record.`,
      );
    }
  }
  const galleryResults = [];
  fs.createReadStream(__dirname + "/../data/gallery.csv")
    .pipe(csv())
    .on("data", (data) => galleryResults.push(data))
    .on("end", async () => {
      for (const row of galleryResults) {
        row['hotel_id'] = +row['hotel_id']
        await prisma.gallery.create({ data: row });
      }
    });
};

main()
  .then(() => console.log('seed done'))
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
// function csv(): any {
//   throw new Error('Function not implemented.');
// }

