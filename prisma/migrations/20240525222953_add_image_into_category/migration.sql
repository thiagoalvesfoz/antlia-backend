/*
  Warnings:

  - You are about to drop the column `show_menu` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `categories_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `categories_images` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `categories_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `categories_images` DROP FOREIGN KEY `categories_images_product_id_fkey`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `show_menu`;

-- AlterTable
ALTER TABLE `categories_images` DROP COLUMN `product_id`,
    ADD COLUMN `category_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `products_images` (
    `id` VARCHAR(191) NOT NULL,
    `bytes` BLOB NULL,
    `mimetype` VARCHAR(15) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `products_images_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `categories_images_category_id_key` ON `categories_images`(`category_id`);

-- AddForeignKey
ALTER TABLE `categories_images` ADD CONSTRAINT `categories_images_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products_images` ADD CONSTRAINT `products_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
