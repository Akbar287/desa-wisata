-- CreateEnum
CREATE TYPE "StatusTeamMember" AS ENUM ('AKTIF', 'TIDAK AKTIF', 'CUTI');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "status" "StatusTeamMember" NOT NULL DEFAULT 'TIDAK AKTIF';
