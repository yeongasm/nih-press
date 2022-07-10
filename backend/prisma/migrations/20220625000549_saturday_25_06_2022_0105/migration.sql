-- AlterTable
ALTER TABLE `articles_tag_entries` ADD COLUMN `is_primary_tag` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `document_tag_entries` ADD COLUMN `is_primary_tag` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `project_tag_entries` ADD COLUMN `is_primary_tag` BOOLEAN NOT NULL DEFAULT false;
