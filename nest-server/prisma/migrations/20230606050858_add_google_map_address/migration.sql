/*
  Warnings:

  - You are about to drop the column `type` on the `rooms` table. All the data in the column will be lost.
  - Added the required column `google_map_address` to the `hotels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "google_map_address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "room_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_rooms_room_types_relation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_rooms_room_types_relation_AB_unique" ON "_rooms_room_types_relation"("A", "B");

-- CreateIndex
CREATE INDEX "_rooms_room_types_relation_B_index" ON "_rooms_room_types_relation"("B");

-- AddForeignKey
ALTER TABLE "_rooms_room_types_relation" ADD CONSTRAINT "_rooms_room_types_relation_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rooms_room_types_relation" ADD CONSTRAINT "_rooms_room_types_relation_B_fkey" FOREIGN KEY ("B") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
