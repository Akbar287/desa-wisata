-- CreateEnum
CREATE TYPE "TourType" AS ENUM ('GRUP', 'PRIVAT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('B', 'L', 'D');

-- CreateEnum
CREATE TYPE "TourDateStatus" AS ENUM ('AVAILABLE', 'ALMOST_FULL', 'FULL', 'CLOSED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'ANSWERED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('OPEN', 'ALMOST_FULL', 'FULL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PrivatePackageTier" AS ENUM ('GOLD', 'PLATINUM', 'DIAMOND');

-- CreateTable
CREATE TABLE "destinations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "TourType" NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "overview" TEXT,
    "heroImage" TEXT,
    "groupSize" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_themes" (
    "tourId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "tour_themes_pkey" PRIMARY KEY ("tourId","themeId")
);

-- CreateTable
CREATE TABLE "tour_destinations" (
    "tourId" INTEGER NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "tour_destinations_pkey" PRIMARY KEY ("tourId","destinationId")
);

-- CreateTable
CREATE TABLE "tour_highlights" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_gallery" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_inclusions" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_inclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_exclusions" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_exclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_good_to_know" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tour_good_to_know_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_related" (
    "fromTourId" INTEGER NOT NULL,
    "toTourId" INTEGER NOT NULL,

    CONSTRAINT "tour_related_pkey" PRIMARY KEY ("fromTourId","toTourId")
);

-- CreateTable
CREATE TABLE "day_itineraries" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "distance" TEXT,

    CONSTRAINT "day_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_itinerary_meals" (
    "id" SERIAL NOT NULL,
    "dayItineraryId" INTEGER NOT NULL,
    "meal" "MealType" NOT NULL,

    CONSTRAINT "day_itinerary_meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_dates" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "TourDateStatus" NOT NULL DEFAULT 'AVAILABLE',
    "price" INTEGER NOT NULL,

    CONSTRAINT "tour_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_reviews" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_packages" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "subtitle" TEXT NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "badge" TEXT NOT NULL,
    "badgeEmoji" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "groupSize" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "dateRange" TEXT NOT NULL,
    "limitedSlots" INTEGER NOT NULL,

    CONSTRAINT "special_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_packages" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "tagline" TEXT NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "priceNote" TEXT NOT NULL,
    "tier" "PrivatePackageTier" NOT NULL,

    CONSTRAINT "private_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_package_inclusions" (
    "id" SERIAL NOT NULL,
    "privatePackageId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "private_package_inclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "readTime" TEXT NOT NULL,
    "authorId" INTEGER,
    "content" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "blog_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_related" (
    "fromPostId" INTEGER NOT NULL,
    "toPostId" INTEGER NOT NULL,

    CONSTRAINT "blog_related_pkey" PRIMARY KEY ("fromPostId","toPostId")
);

-- CreateTable
CREATE TABLE "trip_months" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "trip_months_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_entries" (
    "id" SERIAL NOT NULL,
    "tripMonthId" INTEGER NOT NULL,
    "tourId" INTEGER,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "duration" TEXT NOT NULL,
    "status" "TripStatus" NOT NULL DEFAULT 'OPEN',
    "info" TEXT,

    CONSTRAINT "trip_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "teamCategoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatar" TEXT,
    "experience" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_listings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "departmentEmoji" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "type" "JobType" NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "postedDate" TIMESTAMP(3) NOT NULL,
    "slots" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "workSchedule" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_responsibilities" (
    "id" SERIAL NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_responsibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_requirements" (
    "id" SERIAL NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_benefits" (
    "id" SERIAL NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_benefits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_qualifications" (
    "id" SERIAL NOT NULL,
    "jobListingId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "tourId" INTEGER NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "gender" "Gender" NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "findUs" TEXT NOT NULL,
    "comments" TEXT,
    "acceptTerms" BOOLEAN NOT NULL DEFAULT true,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "phoneCode" TEXT,
    "phoneNumber" TEXT,
    "subject" TEXT,
    "travelPlans" TEXT NOT NULL,
    "tourSlug" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vip_perks" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'private',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vip_perks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destinations_name_key" ON "destinations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "themes_name_key" ON "themes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "day_itineraries_tourId_day_key" ON "day_itineraries"("tourId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "special_packages_tourId_key" ON "special_packages"("tourId");

-- CreateIndex
CREATE UNIQUE INDEX "private_packages_tourId_key" ON "private_packages"("tourId");

-- CreateIndex
CREATE UNIQUE INDEX "trip_months_slug_key" ON "trip_months"("slug");

-- AddForeignKey
ALTER TABLE "tour_themes" ADD CONSTRAINT "tour_themes_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_themes" ADD CONSTRAINT "tour_themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_destinations" ADD CONSTRAINT "tour_destinations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_highlights" ADD CONSTRAINT "tour_highlights_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_gallery" ADD CONSTRAINT "tour_gallery_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_inclusions" ADD CONSTRAINT "tour_inclusions_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_exclusions" ADD CONSTRAINT "tour_exclusions_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_good_to_know" ADD CONSTRAINT "tour_good_to_know_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_related" ADD CONSTRAINT "tour_related_fromTourId_fkey" FOREIGN KEY ("fromTourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_related" ADD CONSTRAINT "tour_related_toTourId_fkey" FOREIGN KEY ("toTourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_itineraries" ADD CONSTRAINT "day_itineraries_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_itinerary_meals" ADD CONSTRAINT "day_itinerary_meals_dayItineraryId_fkey" FOREIGN KEY ("dayItineraryId") REFERENCES "day_itineraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_dates" ADD CONSTRAINT "tour_dates_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_reviews" ADD CONSTRAINT "tour_reviews_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "special_packages" ADD CONSTRAINT "special_packages_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_packages" ADD CONSTRAINT "private_packages_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_package_inclusions" ADD CONSTRAINT "private_package_inclusions_privatePackageId_fkey" FOREIGN KEY ("privatePackageId") REFERENCES "private_packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "blog_authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_tags" ADD CONSTRAINT "blog_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_related" ADD CONSTRAINT "blog_related_fromPostId_fkey" FOREIGN KEY ("fromPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_related" ADD CONSTRAINT "blog_related_toPostId_fkey" FOREIGN KEY ("toPostId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_entries" ADD CONSTRAINT "trip_entries_tripMonthId_fkey" FOREIGN KEY ("tripMonthId") REFERENCES "trip_months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_entries" ADD CONSTRAINT "trip_entries_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamCategoryId_fkey" FOREIGN KEY ("teamCategoryId") REFERENCES "team_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_responsibilities" ADD CONSTRAINT "job_responsibilities_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_requirements" ADD CONSTRAINT "job_requirements_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_benefits" ADD CONSTRAINT "job_benefits_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_qualifications" ADD CONSTRAINT "job_qualifications_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
