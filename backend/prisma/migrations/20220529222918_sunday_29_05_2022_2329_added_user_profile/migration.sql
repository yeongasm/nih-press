-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_group_id_fkey`;

-- AlterTable
ALTER TABLE `categories` MODIFY `group_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `user_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_account_id` INTEGER NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `profile_img_id` INTEGER NULL,
    `profile_banner_id` INTEGER NULL,

    UNIQUE INDEX `user_profile_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_user_account_id_fkey` FOREIGN KEY (`user_account_id`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_profile_img_id_fkey` FOREIGN KEY (`profile_img_id`) REFERENCES `images`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_profile_banner_id_fkey` FOREIGN KEY (`profile_banner_id`) REFERENCES `images`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
