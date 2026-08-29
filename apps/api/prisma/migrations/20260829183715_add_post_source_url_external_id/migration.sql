-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "external_id" TEXT,
ADD COLUMN     "source_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "posts_external_id_key" ON "posts"("external_id");
