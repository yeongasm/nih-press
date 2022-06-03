/*
  Warnings:

  - Added the required column `created_by` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `resume_revision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categories` ADD COLUMN `created_by` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `resume_revision` ADD COLUMN `created_by` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `resume_revision` ADD CONSTRAINT `resume_revision_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `user_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
