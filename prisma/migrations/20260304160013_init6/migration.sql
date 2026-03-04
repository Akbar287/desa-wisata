-- CreateTable
CREATE TABLE "landing_page_statistics" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_with_us" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_page_with_us_pkey" PRIMARY KEY ("id")
);
