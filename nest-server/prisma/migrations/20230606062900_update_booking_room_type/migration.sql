/*
  Warnings:

  - You are about to drop the `_rooms_room_types_relation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `room_type_id` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_rooms_room_types_relation" DROP CONSTRAINT "_rooms_room_types_relation_A_fkey";

-- DropForeignKey
ALTER TABLE "_rooms_room_types_relation" DROP CONSTRAINT "_rooms_room_types_relation_B_fkey";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "room_type_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_rooms_room_types_relation";

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "total_hours" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "is_shown_up" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
