/*
  Warnings:

  - Added the required column `expires_at` to the `user_sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_sessions_session_token_idx` ON `user_sessions`;

-- AlterTable
ALTER TABLE `user_sessions` ADD COLUMN `expires_at` DATETIME(3) NOT NULL;
UPDATE `user_sessions` SET `expires_at` = NOW();

-- CreateIndex
CREATE INDEX `user_sessions_user_account_id_session_token_idx` ON `user_sessions`(`user_account_id`, `session_token`);
