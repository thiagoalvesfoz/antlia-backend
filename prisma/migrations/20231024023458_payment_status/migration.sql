/*
  Warnings:

  - The values [SUCCEED,FAILED] on the enum `invoices_pay_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `invoices` MODIFY `pay_status` ENUM('PAID', 'PENDING', 'PARTLY_PAID', 'CANCELED') NOT NULL;
