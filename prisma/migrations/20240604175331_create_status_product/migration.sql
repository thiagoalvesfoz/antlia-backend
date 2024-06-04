/*
  Warnings:

  - You are about to drop the column `availability` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `availability`,
    ADD COLUMN `status` ENUM('PUBLISHED', 'UNPUBLISHED') NOT NULL DEFAULT 'UNPUBLISHED';
