/*
  Warnings:

  - Added the required column `original_filename` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `documents` ADD COLUMN `original_filename` VARCHAR(255) NOT NULL;
