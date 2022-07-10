-- AlterTable
ALTER TABLE `projects` MODIFY `repo_type` ENUM('none', 'github', 'gitlab', 'bitbucket') NOT NULL DEFAULT 'none';
