/*
  Warnings:

  - You are about to drop the `categories_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products_images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[image_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[image_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `categories_images` DROP FOREIGN KEY `categories_images_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `products_images` DROP FOREIGN KEY `products_images_product_id_fkey`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `image_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `image_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `categories_images`;

-- DropTable
DROP TABLE `products_images`;

-- CreateTable
CREATE TABLE `images` (
    `id` VARCHAR(191) NOT NULL,
    `bytes` BLOB NULL,
    `mimetype` VARCHAR(15) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `images_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `categories_image_id_key` ON `categories`(`image_id`);

-- CreateIndex
CREATE UNIQUE INDEX `products_image_id_key` ON `products`(`image_id`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
