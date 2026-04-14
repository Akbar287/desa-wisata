ALTER TABLE "testimonials"
ADD COLUMN "isPublished" BOOLEAN DEFAULT false;

CREATE TABLE "testimonial_images" (
  "id" SERIAL NOT NULL,
  "testimonial_id" INTEGER NOT NULL,
  "file_name" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "image" BYTEA NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "testimonial_images_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "testimonial_images_testimonial_id_idx"
ON "testimonial_images"("testimonial_id");

ALTER TABLE "testimonial_images"
ADD CONSTRAINT "testimonial_images_testimonial_id_fkey"
FOREIGN KEY ("testimonial_id")
REFERENCES "testimonials"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
