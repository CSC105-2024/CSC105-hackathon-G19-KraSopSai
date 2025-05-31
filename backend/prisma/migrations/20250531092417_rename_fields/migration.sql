/*
  Warnings:

  - You are about to drop the column `victimid` on the `HitEffect` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Victim` table. All the data in the column will be lost.
  - Added the required column `victimId` to the `HitEffect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Victim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HitEffect` DROP FOREIGN KEY `HitEffect_victimid_fkey`;

-- DropForeignKey
ALTER TABLE `Victim` DROP FOREIGN KEY `Victim_userid_fkey`;

-- DropIndex
DROP INDEX `HitEffect_victimid_fkey` ON `HitEffect`;

-- DropIndex
DROP INDEX `Victim_userid_fkey` ON `Victim`;

-- AlterTable
ALTER TABLE `HitEffect` DROP COLUMN `victimid`,
    ADD COLUMN `victimId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Victim` DROP COLUMN `userid`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Victim` ADD CONSTRAINT `Victim_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HitEffect` ADD CONSTRAINT `HitEffect_victimId_fkey` FOREIGN KEY (`victimId`) REFERENCES `Victim`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
