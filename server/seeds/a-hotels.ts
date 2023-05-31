import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Knex } from "knex";

interface Hotels {
  name: string;
  address: string;
  district: string;
  phone: string;
  profile_pic: string;
  description: string;
}

export async function seed(knex: Knex): Promise<void> {
  await knex("hotels").del();
  await knex.raw("ALTER SEQUENCE hotels_id_seq RESTART WITH 1");

  try {
    const csvString = fs.readFileSync(
      path.join(__dirname, "..", "data", "hotels_new.csv"),
      "utf8"
    );

    let { data, errors } = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    });

    if (errors.length) {
      console.error(errors);
      process.exit(1);
    }

    const insertQueryString = `
      INSERT INTO hotels (name, address, district, phone, profile_pic, description)
      VALUES ${(data as Hotels[])
        .map(
          (row) =>
            `('${row.name}', '${row.address}', '${row.district}','${row.phone}','${row.profile_pic}','${row.description}')`
        )
        .join(", ")};
    `;

    await knex.transaction(async (trx) => {
      await trx.raw(insertQueryString);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
