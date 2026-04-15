-- CreateTable
CREATE TABLE "TeamHargaPemandu" (
    "id" SERIAL NOT NULL,
    "teamMemberId" INTEGER NOT NULL,
    "harga" TEXT NOT NULL,

    CONSTRAINT "TeamHargaPemandu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamHargaPemandu" ADD CONSTRAINT "TeamHargaPemandu_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
