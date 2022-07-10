-- AlterTable
ALTER TABLE `articles` ADD COLUMN `publish` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `show` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `publish` BOOLEAN NOT NULL DEFAULT false;
