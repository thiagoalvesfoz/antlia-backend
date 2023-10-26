/*
  Warnings:

  - Made the column `end_at` on table `invoices` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoices` MODIFY `start_at` DATE NOT NULL,
    MODIFY `end_at` DATE NOT NULL;
