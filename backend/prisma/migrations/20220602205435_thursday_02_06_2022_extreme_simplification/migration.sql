/*
  Warnings:

  - You are about to drop the column `profile_banner_id` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `profile_img_id` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resume_revision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_uploaded_by_fkey`;

-- DropForeignKey
ALTER TABLE `resume` DROP FOREIGN KEY `resume_cv_history_id_fkey`;

-- DropForeignKey
ALTER TABLE `resume_info` DROP FOREIGN KEY `resume_info_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `resume_info` DROP FOREIGN KEY `resume_info_resume_id_fkey`;

-- DropForeignKey
ALTER TABLE `resume_revision` DROP FOREIGN KEY `resume_revision_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `user_profile_profile_banner_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_profile` DROP FOREIGN KEY `user_profile_profile_img_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_sessions` DROP FOREIGN KEY `user_sessions_user_account_id_fkey`;

-- AlterTable
ALTER TABLE `user_profile` DROP COLUMN `profile_banner_id`,
    DROP COLUMN `profile_img_id`,
    ADD COLUMN `profile_banner_url` VARCHAR(255) NULL,
    ADD COLUMN `profile_img_url` VARCHAR(255) NULL,
    ADD COLUMN `resume_url` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `images`;

-- DropTable
DROP TABLE `resume`;

-- DropTable
DROP TABLE `resume_info`;

-- DropTable
DROP TABLE `resume_revision`;

-- DropTable
DROP TABLE `user_sessions`;
