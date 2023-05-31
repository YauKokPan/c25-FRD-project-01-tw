import { Knex } from "knex";
const hotelTable = "hotels"

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(hotelTable,(table)=>{
        table.increments();
        table.string("name");
        table.string("address");
        table.string("district");
        table.string("phone");
        table.string("profile_pic");
        table.text("description");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(hotelTable)
}

