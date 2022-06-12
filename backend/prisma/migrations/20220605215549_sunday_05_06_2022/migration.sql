-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_edited_by_fkey`;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `content_url` VARCHAR(255) NOT NULL,
    `repo_url` VARCHAR(255) NULL,
    `repo_type` ENUM('github', 'gitlab', 'bitbucket') NOT NULL DEFAULT 'github',
    `category_id` INTEGER NULL,
    `owned_by` INTEGER NOT NULL,

    INDEX `projects_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_edited_by_fkey` FOREIGN KEY (`edited_by`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `user_accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_owned_by_fkey` FOREIGN KEY (`owned_by`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
