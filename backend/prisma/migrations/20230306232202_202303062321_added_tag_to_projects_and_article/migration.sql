-- DropIndex
DROP INDEX "articles_title_created_at_idx";

-- DropIndex
DROP INDEX "projects_title_idx";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "tag" VARCHAR(255) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "tag" VARCHAR(255) NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "articles_tag_title_created_at_idx" ON "articles"("tag", "title", "created_at");

-- CreateIndex
CREATE INDEX "projects_tag_title_idx" ON "projects"("tag", "title");
