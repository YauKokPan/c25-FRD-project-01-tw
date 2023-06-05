/*
  Warnings:

  - You are about to drop the column `createdAt` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `gallery` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "hourly_rate" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "equipments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_equipments_rooms_relation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_equipments_rooms_relation_AB_unique" ON "_equipments_rooms_relation"("A", "B");

-- CreateIndex
CREATE INDEX "_equipments_rooms_relation_B_index" ON "_equipments_rooms_relation"("B");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_equipments_rooms_relation" ADD CONSTRAINT "_equipments_rooms_relation_A_fkey" FOREIGN KEY ("A") REFERENCES "equipments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_equipments_rooms_relation" ADD CONSTRAINT "_equipments_rooms_relation_B_fkey" FOREIGN KEY ("B") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
