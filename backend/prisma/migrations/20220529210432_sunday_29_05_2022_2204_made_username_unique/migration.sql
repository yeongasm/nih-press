/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `user_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_accounts_username_key` ON `user_accounts`(`username`);
