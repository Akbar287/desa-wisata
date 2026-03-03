-- CreateTable
CREATE TABLE "wahanas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageBanner" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wahanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wahana_galleries" (
    "id" SERIAL NOT NULL,
    "wahanaId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wahana_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_wahanas" (
    "TourId" INTEGER NOT NULL,
    "WahanaId" INTEGER NOT NULL,

    CONSTRAINT "tour_wahanas_pkey" PRIMARY KEY ("TourId","WahanaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "wahanas_name_key" ON "wahanas"("name");

-- AddForeignKey
ALTER TABLE "wahana_galleries" ADD CONSTRAINT "wahana_galleries_wahanaId_fkey" FOREIGN KEY ("wahanaId") REFERENCES "wahanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_wahanas" ADD CONSTRAINT "tour_wahanas_TourId_fkey" FOREIGN KEY ("TourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_wahanas" ADD CONSTRAINT "tour_wahanas_WahanaId_fkey" FOREIGN KEY ("WahanaId") REFERENCES "wahanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
