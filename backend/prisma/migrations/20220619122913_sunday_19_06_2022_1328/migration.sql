-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_edited_by_fkey`;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_edited_by_fkey` FOREIGN KEY (`edited_by`) REFERENCES `user_profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `user_profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
